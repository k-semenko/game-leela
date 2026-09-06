import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from '../../src/payment/payment.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Payments } from '../../src/entity/payments.entity';
import { HttpModule } from '@nestjs/axios';

describe('PaymentService', () => {
  let service: PaymentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule.register({})],
      providers: [
        PaymentService,
        {
          provide: getRepositoryToken(Payments),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<PaymentService>(PaymentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
