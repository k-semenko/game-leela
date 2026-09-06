import { Injectable } from '@nestjs/common';
import * as process from 'process';
import { MailerService } from '@nestjs-modules/mailer';
import { Feedback } from '../entity/feedback.entity';

@Injectable()
export class MailService {
  constructor(private readonly mailService: MailerService) {}

  sendTicket = async (data: Feedback) => {
    let username = null;

    if (data.user) {
      username =
        data.user.firstName && data.user.lastName
          ? data.user.firstName + ' ' + data.user.lastName
          : data.user.username;
    }

    return await this.mailService.sendMail({
      from: `${process.env.MAIL_USER}, ${data.email}`,
      to: process.env.MAIL_USER,
      subject: data.subject,
      template: './ticket',
      context: {
        id: data.id,
        username: username ?? 'Не определен',
        subject: data.subject,
        text: data.text,
        email: data.email,
      },
    });
  };

  sendResetPassMessage = async (
    email: string,
    username: string,
    resetToken: string,
  ) => {
    const siteUrl = String(process.env.ORIGIN);
    const resetLink = `${siteUrl}change-password/?resetToken=${resetToken}`;
    return await this.mailService.sendMail({
      from: `${process.env.MAIL_USER}`,
      to: email,
      subject: 'Сброс пароля «Game Leela»',
      template: './reset-pass',
      context: {
        email: email,
        siteUrl: siteUrl,
        username: username,
        resetLink: resetLink,
      },
    });
  };
}
