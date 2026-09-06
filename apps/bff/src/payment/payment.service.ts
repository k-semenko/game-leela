import { BadRequestException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosHeaders } from 'axios';
import * as process from 'process';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Payments } from '../entity/payments.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payments)
    private readonly paymentsRepo: Repository<Payments>,
    private readonly http: HttpService,
  ) {}

  findAll = async (options?: FindManyOptions<Payments>) => {
    return this.paymentsRepo.find(options);
  };

  createPayment = async (data: Payments) => {
    return this.paymentsRepo.save(data);
  };

  findByPaymentId = async (paymentId: string) => {
    return await this.paymentsRepo.findOne({ where: { paymentId: paymentId } });
  };

  findBy = async (condition: FindOneOptions<Payments>) => {
    return await this.paymentsRepo.findOne(condition);
  };

  get headers(): AxiosHeaders {
    return new AxiosHeaders()
      .set(
        'Authorization',
        'Basic ' + Buffer.from(process.env.YOOMONEY).toString('base64'),
      )
      .set('Content-Type', 'application/json');
  }

  getPayments = async (params: any) => {
    return await this.http.axiosRef
      .get(`https://api.yookassa.ru/v3/payments/`, {
        headers: this.headers,
        params: params,
      })
      .then((res) => res.data)
      .catch((err) => {
        throw new BadRequestException(err.response?.data ?? err.response);
      });
  };
}
