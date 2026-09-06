import { Test, TestingModule } from '@nestjs/testing';
import { TariffsController } from '../../src/tariffs/tariffs.controller';
import { TariffsService } from '../../src/tariffs/tariffs.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Tariffs } from '../../src/entity/tariffs.entity';

describe('TariffsController', () => {
  let controller: TariffsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TariffsController],
      providers: [
        TariffsService,
        {
          provide: getRepositoryToken(Tariffs),
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<TariffsController>(TariffsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
