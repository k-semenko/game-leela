import { Test, TestingModule } from '@nestjs/testing';
import { FeedbackService } from '../../src/feedback/feedback.service';
import { MailerModule } from '@nestjs-modules/mailer';
import process from 'process';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Feedback } from '../../src/entity/feedback.entity';

describe('FeedbackService', () => {
  let service: FeedbackService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FeedbackService,
        {
          provide: getRepositoryToken(Feedback),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<FeedbackService>(FeedbackService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
