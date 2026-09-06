import { Test, TestingModule } from '@nestjs/testing';
import { CellsController } from '../../src/cells/cells.controller';
import { JwtService } from '@nestjs/jwt';
import { CellsService } from '../../src/cells/cells.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Cells } from '../../src/entity/cells.entity';
import { LoggerModuleMock } from '../test.mock';
import * as fs from 'fs';

describe('CellsController', () => {
  let controller: CellsController;

  beforeEach(async () => {
    if (!fs.existsSync('./logs')) {
      fs.mkdirSync('./logs', 744);
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CellsController],
      imports: [LoggerModuleMock],
      providers: [
        JwtService,
        {
          provide: CellsService,
          useValue: {},
        },
        {
          provide: getRepositoryToken(Cells),
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<CellsController>(CellsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
