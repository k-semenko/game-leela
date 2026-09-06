import { Test, TestingModule } from '@nestjs/testing';
import { CellsService } from '../../src/cells/cells.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Cells } from '../../src/entity/cells.entity';
import { LoggerModuleMock } from '../test.mock';

describe('CellsService', () => {
  let service: CellsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModuleMock],
      providers: [
        CellsService,
        {
          provide: getRepositoryToken(Cells),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<CellsService>(CellsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
