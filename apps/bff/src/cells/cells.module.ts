import { Module } from '@nestjs/common';
import { CellsService } from './cells.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CellsController } from './cells.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import * as process from 'process';
import { ConfigModule } from '@nestjs/config';
import { Cells } from '../entity/cells.entity';

@Module({
  providers: [CellsService],
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([Cells]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '12h' },
    }),
  ],
  exports: [CellsService, TypeOrmModule],
  controllers: [CellsController],
})
export class CellsModule {}
