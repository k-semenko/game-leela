import { Module } from '@nestjs/common';
import { PlayersService } from './players.service';
import { PlayersController } from './players.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import * as process from 'process';
import { Players } from '../entity/players.entity';

@Module({
  providers: [PlayersService],
  imports: [
    TypeOrmModule.forFeature([Players]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '12h' },
    }),
  ],
  exports: [PlayersService, TypeOrmModule],
  controllers: [PlayersController],
})
export class PlayersModule {}
