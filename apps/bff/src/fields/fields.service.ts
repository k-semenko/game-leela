import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { Fields } from '../entity/fields.entity';

@Injectable()
export class FieldsService {
  constructor(
    @InjectRepository(Fields)
    private fieldsRepository: Repository<Fields>,
  ) {}

  async getAllFields(options?: FindManyOptions<Fields>): Promise<Fields[]> {
    return await this.fieldsRepository.find({
      ...options,
      order: { id: 'ASC', ...(options?.order ?? {}) },
    });
  }
}
