import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from '../src/mail/mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import * as process from 'process';

describe('MailService', () => {
  let service: MailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MailService],
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
    }).compile();

    service = module.get<MailService>(MailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
