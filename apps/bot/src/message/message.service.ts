import { InjectBot } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';
import { tgMessage } from '../core/message';
import { BadRequestException } from '@nestjs/common';
import { ResponsePaymentInterface } from '../dto/payment.interface';
import * as process from 'process';

export class MessageService {
  TgAdmins: number[] = JSON.parse(process.env.TG_ADMINS ?? '[]');

  constructor(@InjectBot() private bot: Telegraf<Context>) {}

  newPayment = async (payment: ResponsePaymentInterface) => {
    await this.bot.telegram
      .sendMessage(this.TgAdmins[0], tgMessage.newPaymentMessage(payment), {
        parse_mode: 'HTML',
      })
      .catch((err) => {
        console.log(err);
        throw new BadRequestException(err.message);
      });
  };

  async canceledPayment(data: ResponsePaymentInterface) {
    await this.bot.telegram
      .sendMessage(this.TgAdmins[0], tgMessage.canceledPaymentMessage(data), {
        parse_mode: 'HTML',
      })
      .catch((err) => {
        throw new BadRequestException(err.message);
      });
  }

  async sendMessage(data: any, chatId?: string | number, extra?: any) {
    return await this.bot.telegram
      .sendMessage(chatId ?? this.TgAdmins[0], data, extra ?? null)
      .catch((err) => {
        throw new BadRequestException(err.message);
      });
  }
}
