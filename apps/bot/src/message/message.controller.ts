import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { ResponsePaymentInterface } from '../dto/payment.interface';
import { tgMessage, tgMessageMarkdown } from '../core/message';
import * as process from 'process';
import { UserInterface } from '../user/user.interface';
import { PinoLogger } from 'nestjs-pino';

@Controller('message')
export class MessageController {
  host = process.env.ORIGIN;

  constructor(
    private readonly messageService: MessageService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(MessageService.name);
  }

  @Post()
  async message(@Body() data: any) {
    this.logger.debug(data);
    return await this.messageService
      .sendMessage(JSON.stringify(data, null, 2))
      .catch((err) => {
        this.logger.error(err);
        throw new BadRequestException(err);
      });
  }

  @Post('/group')
  async messageToGroup(@Body('message') message: string) {
    return await this.messageService
      .sendMessage(
        tgMessageMarkdown(message),
        process.env.TG_PROJECT_GROUP_ID,
        { parse_mode: 'MarkdownV2' },
      )
      .then(() => {
        this.logger.debug('/group сообщение отправлено');
      })
      .catch((err) => {
        this.logger.error(err);
        throw new BadRequestException(err);
      });
  }

  @Post('/new-payment')
  async newPayment(@Body() data: ResponsePaymentInterface) {
    return await this.messageService
      .newPayment(data)
      .then(() => {
        this.logger.debug('/new-payment сообщение отправлено');
      })
      .catch((err) => {
        this.logger.error(err);
        throw new BadRequestException(err);
      });
  }

  @Post('/canceled-payment')
  async canceledPayment(@Body() data: ResponsePaymentInterface) {
    return await this.messageService.canceledPayment(data).catch((err) => {
      console.log(err);
    });
  }

  @Post('/start-error/:chatId')
  async startErrorMessage(@Param('chatId') chatId: number) {
    await this.messageService
      .sendMessage(
        tgMessageMarkdown(tgMessage.errorMessageOnStart(this.host)),
        chatId,
        { parse_mode: 'MarkdownV2' },
      )
      .catch((err) => {
        this.logger.error(err);
        throw new BadRequestException(err.message);
      });
  }

  @Post('/hello/:chatId')
  async helloMessage(
    @Param('chatId') chatId: number,
    @Body() userData: UserInterface,
  ) {
    await this.messageService
      .sendMessage(
        tgMessageMarkdown(tgMessage.helloMessage(this.host)),
        chatId,
        { parse_mode: 'MarkdownV2' },
      )
      .catch((err) => {
        this.logger.error(err);
        throw new BadRequestException(err.message);
      });

    await this.messageService
      .sendMessage(
        tgMessageMarkdown(tgMessage.newTgRel(userData)),
        process.env.TG_PROJECT_GROUP_ID,
        { parse_mode: 'MarkdownV2' },
      )
      .catch((err) => {
        this.logger.error(err);
        throw new BadRequestException(err.message);
      });
  }
}
