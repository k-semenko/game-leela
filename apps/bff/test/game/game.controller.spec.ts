import { Test, TestingModule } from '@nestjs/testing';
import { GameController } from '../../src/game/game.controller';
import { JwtService } from '@nestjs/jwt';
import { GameService } from '../../src/game/game.service';
import { GameServiceMock } from './game.mock';
import { PlayersService } from '../../src/players/players.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Players } from '../../src/entity/players.entity';
import { Logger } from 'nestjs-pino';
import { UsersService } from '../../src/users/users.service';
import { User } from '../../src/entity/user.entity';
import { TelegramUserRel } from '../../src/entity/tg.entity';
import { LoggerModuleMock } from '../test.mock';
import * as fs from 'fs';
import { ResetPassEntity } from '../../src/entity/reset-pass.entity';
import { HttpModule } from '@nestjs/axios';
import { TelegramService } from '../../src/telegram/telegram.service';

describe('GameController', () => {
  let controller: GameController;

  beforeEach(async () => {
    if (!fs.existsSync('./logs')) {
      fs.mkdirSync('./logs', 744);
    }

    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModuleMock, HttpModule.register({})],
      controllers: [GameController],
      providers: [
        TelegramService,
        JwtService,
        PlayersService,
        UsersService,
        {
          provide: getRepositoryToken(Players),
          useValue: {},
        },
        {
          provide: GameService,
          useValue: GameServiceMock,
        },
        {
          provide: getRepositoryToken(ResetPassEntity),
          useValue: {},
        },
        {
          provide: getRepositoryToken(User),
          useValue: {},
        },
        {
          provide: getRepositoryToken(TelegramUserRel),
          useValue: {},
        },
      ],
    }).compile();
    module.useLogger(module.get(Logger));
    controller = module.get<GameController>(GameController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
