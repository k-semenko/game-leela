import { Test, TestingModule } from '@nestjs/testing';
import { TariffsService } from '../../src/tariffs/tariffs.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Tariffs } from '../../src/entity/tariffs.entity';

describe('TariffsService', () => {
  let service: TariffsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TariffsService,
        {
          provide: getRepositoryToken(Tariffs),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<TariffsService>(TariffsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
