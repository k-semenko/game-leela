import { Module } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedbackController } from './feedback.controller';
import { MailService } from '../mail/mail.service';
import { JwtModule } from '@nestjs/jwt';
import * as process from 'process';
import { Feedback } from '../entity/feedback.entity';

@Module({
  providers: [FeedbackService, MailService],
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '12h' },
    }),
    TypeOrmModule.forFeature([Feedback]),
  ],
  exports: [FeedbackService, TypeOrmModule],
  controllers: [FeedbackController],
})
export class FeedbackModule {}
