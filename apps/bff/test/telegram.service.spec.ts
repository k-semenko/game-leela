import { Test, TestingModule } from '@nestjs/testing';
import { TelegramService } from '../src/telegram/telegram.service';
import { HttpModule } from '@nestjs/axios';

describe('TelegramService', () => {
  let service: TelegramService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule.register({})],
      providers: [TelegramService],
    }).compile();

    service = module.get<TelegramService>(TelegramService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
