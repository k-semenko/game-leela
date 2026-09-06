import { Test, TestingModule } from '@nestjs/testing';
import { FeedbackController } from '../../src/feedback/feedback.controller';
import { JwtService } from '@nestjs/jwt';
import { FeedbackService } from '../../src/feedback/feedback.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Feedback } from '../../src/entity/feedback.entity';
import { MailerModule } from '@nestjs-modules/mailer';
import * as process from 'process';
import { MailService } from '../../src/mail/mail.service';

describe('FeedbackController', () => {
  let controller: FeedbackController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FeedbackController],
      imports: [
        MailerModule.forRoot({
          transport: {
            host: process.env.MAIL_HOST,
            secure: Boolean(process.env.MAIL_SECURE),
            auth: {
              user: process.env.MAIL_USER,
              pass: process.env.MAIL_PASS,
            },
          },
        }),
      ],
      providers: [
        JwtService,
        FeedbackService,
        MailService,
        {
          provide: getRepositoryToken(Feedback),
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<FeedbackController>(FeedbackController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
