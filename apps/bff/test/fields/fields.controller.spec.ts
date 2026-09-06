import { Test, TestingModule } from '@nestjs/testing';
import { FieldsController } from '../../src/fields/fields.controller';
import { JwtService } from '@nestjs/jwt';
import { FieldsService } from '../../src/fields/fields.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Fields } from '../../src/entity/fields.entity';

describe('FieldsController', () => {
  let controller: FieldsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FieldsController],
      providers: [
        JwtService,
        FieldsService,
        { provide: getRepositoryToken(Fields), useValue: {} },
      ],
    }).compile();

    controller = module.get<FieldsController>(FieldsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
