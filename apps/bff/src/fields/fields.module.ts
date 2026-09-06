import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FieldsController } from './fields.controller';
import { FieldsService } from './fields.service';
import { Fields } from '../entity/fields.entity';

@Module({
  providers: [FieldsService],
  imports: [TypeOrmModule.forFeature([Fields])],
  exports: [FieldsService, TypeOrmModule],
  controllers: [FieldsController],
})
export class FieldsModule {}
