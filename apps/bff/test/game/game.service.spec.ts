import { Test, TestingModule } from '@nestjs/testing';
import { GameService } from '../../src/game/game.service';
import { GameServiceMock } from './game.mock';
import { LoggerModuleMock } from '../test.mock';

describe('GameService', () => {
  let service: GameService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModuleMock],
      providers: [
        {
          provide: GameService,
          useValue: GameServiceMock,
        },
      ],
    }).compile();

    service = module.get<GameService>(GameService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
