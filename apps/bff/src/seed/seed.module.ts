import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { Fields } from '../entity/fields.entity';
import { Cells } from '../entity/cells.entity';
import { Tariffs } from '../entity/tariffs.entity';
import { User } from '../entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Fields, Cells, Tariffs, User])],
  providers: [SeedService],
})
export class SeedModule {}
