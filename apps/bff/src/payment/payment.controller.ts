import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  NotImplementedException,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  CreatePaymentDto,
  PaymentDto,
  ProductItemsDto,
  ResponsePaymentDto,
} from './payment.interface';
import { PaymentService } from './payment.service';
import {
  ApiBody,
  ApiExcludeEndpoint,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth-guard.service';
import * as uuid from 'uuid';
import * as process from 'process';
import { HttpService } from '@nestjs/axios';
import { AxiosHeaders } from 'axios';
import { TariffsService } from '../tariffs/tariffs.service';
import { UsersService } from '../users/users.service';
import { Payments } from '../entity/payments.entity';
import { TariffsDto } from '../tariffs/tariffs.dto';
import * as moment from 'moment';
import { PaymentEventDto, PaymentEvents } from './payment-event.dto';
import { checkYooKassaIp } from '../constants';
import { Role, Roles } from '../roles/roles.decorator';
import { PinoLogger } from 'nestjs-pino';
import { TelegramService } from '../telegram/telegram.service';

@ApiTags('Payment')
@Controller('api/payment')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly tariffsService: TariffsService,
    private readonly userService: UsersService,
    private readonly http: HttpService,
    private readonly telegramService: TelegramService,
    private readonly logger: PinoLogger,
  ) {
    logger.setContext(PaymentController.name);
  }

  @Get('/all')
  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Список платежей из БД',
    description: 'Получения списка платежей сохраненного в БД',
  })
  async getAllPayments() {
    return await this.paymentService
      .findAll()
      .then((data) => {
        this.logger.debug(
          data,
          'GetAllPayments. Получения списка платежей сохраненного в БД',
        );
        return data;
      })
      .catch((err) => {
        this.logger.error(
          err,
          'GetAllPayments. Получения списка платежей сохраненного в БД',
        );
        throw new NotImplementedException(err.error.message ?? err.message);
      });
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Список платежей в YooKassa',
    description: 'Получение списка платежей в соответствии с параметрами',
  })
  @ApiQuery({
    name: 'status',
    description: 'Фильтр по статусу платежа',
    example: 'succeeded',
    required: false,
  })
  @ApiQuery({
    name: 'created_at.gte',
    description: 'Фильтр по времени создания',
    example: '2024-03-07T10:07:01.398Z',
    required: false,
  })
  async getPayments(@Query() params: any, @Res() res: any) {
    const paymentStatus = await this.paymentService
      .getPayments(params)
      .then((data) => {
        this.logger.debug(data, 'GetPayments. Список платежей в YooKassa');
        return data;
      })
      .catch((err) => {
        this.logger.error(err, 'GetPayments. Список платежей в YooKassa');
        throw new NotImplementedException(err.error.message ?? err.message);
      });
    return res.status(200).json(paymentStatus);
  }

  @Get('/:paymentId')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Статуса платежа в YooKassa',
    description: 'Проверка статуса платежа',
  })
  @ApiParam({
    name: 'paymentId',
    description: 'Id платежа',
  })
  async getPaymentStatus(
    @Param('paymentId') paymentId: string,
    @Res() res: any,
  ) {
    const payment = await this.paymentService.findByPaymentId(paymentId);

    const paymentStatus = await this.http.axiosRef
      .get(`${process.env.YOOMONEY_API}/payments/${payment.orderId}`, {
        headers: this.headers,
      })
      .then((res) => {
        this.logger.debug(
          res.data,
          'GetPaymentStatus. Статуса платежа в YooKassa',
        );
        return res.data;
      })
      .catch((err) => {
        this.logger.error(
          err.response?.data ?? err.response,
          'GetPaymentStatus. Статуса платежа в YooKassa',
        );
        throw new BadRequestException(
          err.response?.data.message ?? err.response.message,
        );
      });

    return res.status(200).json(paymentStatus);
  }

  @Post('/status')
  @ApiOperation({
    summary: 'Callback YouKassa',
  })
  async setStatus(
    @Body() data: PaymentEventDto,
    @Req() req: any,
    @Res() res: any,
  ) {
    const ip = req.headers['x-forwarded-for'] || req.headers['x-real-ip'];
    if (!checkYooKassaIp(ip)) {
      this.logger.warn(`SetStatus. Проверка IP не прошла ${ip}`);
      throw new ForbiddenException(`IP нет в списке YooKassa.`);
    } else {
      this.logger.info(data, 'Callback YouKassa. Получен объект платежа');
    }

    let payment = await this.paymentService.findBy({
      where: { orderId: data.object.id },
      relations: { user: true },
    });

    this.logger.debug(payment, 'Callback YouKassa. Получение платежа из БД');
    if (payment) {
      this.logger.debug(data.event, 'Callback YouKassa. Обработка event-а');

      payment.status = data.object.status;
      payment.paid = data.object.paid;
      payment.incomeAmount = data.object.income_amount?.value ?? 0;
      payment = await payment.save();

      switch (data.event) {
        case PaymentEvents.SUCCEEDED:
          payment.user.freeGames =
            Number(payment.user.freeGames) +
            Number(data.object.metadata.gamesCount);

          await payment.user.save();
          await this.telegramService.newPayment(data.object).catch((err) => {
            this.logger.error(
              err,
              'Callback YouKassa. Ошибка отправки сообщения о платеже в ТГ',
            );
            return res.status(200).json({});
          });
          return res.status(200).json({});
        case PaymentEvents.CANCELED:
          await this.telegramService
            .canceledPayment(data.object)
            .catch((err) => {
              this.logger.error(
                err,
                'Callback YouKassa. Ошибка отправки сообщения о платеже в ТГ',
              );
              return res.status(200).json({});
            });

          return res.status(200).json({});
        default:
          await this.telegramService.sendMessageAdmin(data).catch((err) => {
            this.logger.error(
              err,
              'Callback YouKassa. Ошибка отправки сообщения о платеже в ТГ',
            );
          });
          return res.status(400).json({});
      }
    } else {
      this.logger.error(data, 'Callback YouKassa. Не удалось найти платеж');
      return res.status(400).json({});
    }
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Создание платежа',
    description: 'Запрос оплаты заказа для получения ссылки на эквайринг',
  })
  @ApiBody({
    type: CreatePaymentDto,
    description: 'Объект создания платежа',
  })
  async createPayment(
    @Body() data: CreatePaymentDto,
    @Req() req: any,
    @Res() res: any,
  ) {
    const idempotenceKey = uuid.v4();
    const headers = this.headers.set('Idempotence-Key', idempotenceKey);

    const tariff = await this.tariffsService
      .findTariffById(data.tariffId)
      .then((data) => {
        this.logger.debug(data, 'CreatePayment. Создание платежа');
        return data;
      })
      .catch((err) => {
        this.logger.error(err, 'CreatePayment. Ошибка поиска тарифа');
        throw new NotFoundException(err.error.message ?? err.message);
      });

    const requestData = this.getPaymentData(tariff);
    requestData.receipt.customer.email = data.email;
    requestData.confirmation.return_url = process.env.ORIGIN + `profile`;
    this.logger.debug(
      requestData,
      'CreatePayment. Тело запроса на создание платежа',
    );

    let payment = new Payments();
    payment.user = await this.userService.findById(req.user.id);
    payment.paymentId = idempotenceKey;

    payment = await this.paymentService
      .createPayment(payment)
      .then((data) => {
        this.logger.debug(data, 'CreatePayment. Созданный платеж в БД');
        return data;
      })
      .catch((err) => {
        this.logger.error(err, 'CreatePayment. Ошибка создания платежа в БД');
        throw new BadRequestException(err.error.message ?? err.message);
      });

    const responseData: ResponsePaymentDto = await this.http.axiosRef
      .post<ResponsePaymentDto>(
        `${process.env.YOOMONEY_API}/payments`,
        requestData,
        { headers: headers },
      )
      .then((res) => {
        this.logger.info(
          res.data,
          'CreatePayment. Создан новый платеж в YooKassa',
        );
        return res.data;
      })
      .catch((err) => {
        console.log(err);
        this.logger.error(
          err,
          'CreatePayment. Ошибка создания платежа YooKassa',
        );
        throw new BadRequestException(
          err.response?.data.message ?? err.response.message,
        );
      });

    payment.paid = responseData.paid;
    payment.status = responseData.status;
    payment.orderId = responseData.id;
    payment.confirmationUrl = responseData.confirmation.confirmation_url;
    payment.createdAt = moment(responseData.created_at).format(
      'yyyy-MM-DD hh:mm:ss',
    );
    await payment.save();

    return res.status(200).json({ confirmationUrl: payment.confirmationUrl });
  }

  get headers(): AxiosHeaders {
    return new AxiosHeaders()
      .set(
        'Authorization',
        'Basic ' + Buffer.from(process.env.YOOMONEY).toString('base64'),
      )
      .set('Content-Type', 'application/json');
  }

  getPaymentData = (tariff: TariffsDto): PaymentDto => {
    const product: ProductItemsDto = {
      amount: {
        value: tariff.price,
        currency: 'RUB',
      },
      description: tariff.description,
      vat_code: 1,
      quantity: 1,
    };

    return {
      amount: {
        value: tariff.price,
        currency: 'RUB',
      },
      receipt: {
        customer: {
          email: '',
        },
        items: [product],
      },
      capture: true,
      confirmation: {
        return_url: '',
        type: 'redirect',
      },
      description: tariff.description,
      metadata: {
        gamesCount: tariff.gamesCount,
      },
    };
  };
}
