import { Test, TestingModule } from '@nestjs/testing';
import { PaymentController } from '../../src/payment/payment.controller';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PaymentService } from '../../src/payment/payment.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Payments } from '../../src/entity/payments.entity';
import { HttpModule } from '@nestjs/axios';
import { TariffsService } from '../../src/tariffs/tariffs.service';
import { Tariffs } from '../../src/entity/tariffs.entity';
import { UsersService } from '../../src/users/users.service';
import { User } from '../../src/entity/user.entity';
import { TelegramUserRel } from '../../src/entity/tg.entity';
import { DEFAULT_BOT_NAME } from 'nestjs-telegraf';
import { checkYooKassaIp } from '../../src/constants';
import { Logger } from 'nestjs-pino';
import { LoggerModuleMock } from '../test.mock';
import * as fs from 'fs';
import { ResetPassEntity } from '../../src/entity/reset-pass.entity';
import { TelegramService } from '../../src/telegram/telegram.service';

describe('PaymentController', () => {
  let controller: PaymentController;

  beforeEach(async () => {
    if (!fs.existsSync('./logs')) {
      fs.mkdirSync('./logs', 744);
    }

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        LoggerModuleMock,
        ConfigModule.forRoot({
          envFilePath: '../.env',
        }),
        HttpModule.register({}),
      ],
      providers: [
        TelegramService,
        PaymentService,
        TariffsService,
        UsersService,
        {
          provide: DEFAULT_BOT_NAME,
          useValue: {},
        },
        {
          provide: getRepositoryToken(ResetPassEntity),
          useValue: {},
        },
        {
          provide: getRepositoryToken(Payments),
          useValue: {},
        },
        {
          provide: getRepositoryToken(TelegramUserRel),
          useValue: {},
        },
        {
          provide: getRepositoryToken(Tariffs),
          useValue: {},
        },
        {
          provide: getRepositoryToken(User),
          useValue: {},
        },
        {
          provide: JwtService,
          useValue: {
            verify: (data: any) => true,
          },
        },
      ],
      controllers: [PaymentController],
    }).compile();
    module.useLogger(module.get(Logger));

    controller = module.get<PaymentController>(PaymentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('test ip', () => {
    expect(checkYooKassaIp('77.75.156.11')).toBeTruthy();
    expect(checkYooKassaIp('77.75.156.35')).toBeTruthy();

    expect(checkYooKassaIp('185.71.76.0')).toBeTruthy();
    expect(checkYooKassaIp('185.71.76.31')).toBeTruthy();
    expect(checkYooKassaIp('185.71.76.32')).toBeFalsy();

    expect(checkYooKassaIp('185.71.77.0')).toBeTruthy();
    expect(checkYooKassaIp('185.71.77.31')).toBeTruthy();
    expect(checkYooKassaIp('185.71.77.100')).toBeFalsy();

    expect(checkYooKassaIp('77.75.153.0')).toBeTruthy();
    expect(checkYooKassaIp('77.75.153.127')).toBeTruthy();
    expect(checkYooKassaIp('77.75.153.128')).toBeFalsy();

    expect(checkYooKassaIp('77.75.154.128')).toBeTruthy();
    expect(checkYooKassaIp('77.75.154.200')).toBeTruthy();
    expect(checkYooKassaIp('77.75.154.255')).toBeTruthy();
    expect(checkYooKassaIp('77.75.154.206')).toBeTruthy();
    expect(checkYooKassaIp('77.75.154.127')).toBeFalsy();
    expect(checkYooKassaIp('77.75.154.256')).toBeFalsy();

    expect(checkYooKassaIp('77.60.154.256')).toBeFalsy();
    expect(checkYooKassaIp('77.60.10.256')).toBeFalsy();
    expect(checkYooKassaIp('100.60.10.256')).toBeFalsy();
  });
});
