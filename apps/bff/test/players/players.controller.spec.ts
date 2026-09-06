import { Test, TestingModule } from '@nestjs/testing';
import { PlayersController } from '../../src/players/players.controller';
import { JwtService } from '@nestjs/jwt';
import { PlayersService } from '../../src/players/players.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Players } from '../../src/entity/players.entity';
import { LoggerModuleMock } from '../test.mock';
import * as fs from 'fs';

describe('PlayersController', () => {
  let controller: PlayersController;

  beforeEach(async () => {
    if (!fs.existsSync('./logs')) {
      fs.mkdirSync('./logs', 744);
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlayersController],
      imports: [LoggerModuleMock],
      providers: [
        JwtService,
        {
          provide: PlayersService,
          useValue: {},
        },
        {
          provide: getRepositoryToken(Players),
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<PlayersController>(PlayersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
