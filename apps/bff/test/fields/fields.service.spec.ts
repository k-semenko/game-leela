import { Test, TestingModule } from '@nestjs/testing';
import { FieldsService } from '../../src/fields/fields.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Fields } from '../../src/entity/fields.entity';

describe('FieldsService', () => {
  let service: FieldsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FieldsService,
        {
          provide: getRepositoryToken(Fields),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<FieldsService>(FieldsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
