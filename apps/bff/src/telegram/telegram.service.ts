import { Injectable } from '@nestjs/common';
import { ResponsePaymentDto } from '../payment/payment.interface';
import { HttpService } from '@nestjs/axios';
import * as process from 'process';
import { User } from '../entity/user.entity';

@Injectable()
export class TelegramService {
  constructor(private readonly httpService: HttpService) {}

  newPayment = async (data: ResponsePaymentDto) => {
    return await this.httpService.axiosRef.post(
      `${process.env.TG_ORIGIN}/message/new-payment`,
      data,
    );
  };

  canceledPayment = async (data: ResponsePaymentDto) => {
    return await this.httpService.axiosRef.post(
      `${process.env.TG_ORIGIN}/message/canceled-payment`,
      data,
    );
  };

  sendMessageAdmin = async (data: any) => {
    return await this.httpService.axiosRef.post(
      `${process.env.TG_ORIGIN}/message`,
      data,
    );
  };

  sendMessageToGroup = async (message: string) => {
    return await this.httpService.axiosRef.post(
      `${process.env.TG_ORIGIN}/message/group`,
      { message: message },
    );
  };

  helloMessage = async (chatId: number, user: User) => {
    return await this.httpService.axiosRef.post(
      `${process.env.TG_ORIGIN}/message/hello/${chatId}`,
      user,
    );
  };

  async startErrorMessage(chatId: number) {
    return await this.httpService.axiosRef.post(
      `${process.env.TG_ORIGIN}/message/start-error/${chatId}`,
    );
  }
}
