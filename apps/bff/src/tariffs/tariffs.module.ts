import { Module } from '@nestjs/common';
import { TariffsService } from './tariffs.service';
import { TariffsController } from './tariffs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tariffs } from '../entity/tariffs.entity';

@Module({
  providers: [TariffsService],
  imports: [TypeOrmModule.forFeature([Tariffs])],
  exports: [TariffsService, TypeOrmModule],
  controllers: [TariffsController],
})
export class TariffsModule {}
