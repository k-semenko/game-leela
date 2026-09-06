import { Test, TestingModule } from '@nestjs/testing';
import { PlayersService } from '../../src/players/players.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Players } from '../../src/entity/players.entity';
import { LoggerModuleMock } from '../test.mock';

describe('PlayersService', () => {
  let service: PlayersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModuleMock],
      providers: [
        PlayersService,
        {
          provide: getRepositoryToken(Players),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<PlayersService>(PlayersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
