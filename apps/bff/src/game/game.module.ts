import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameController } from './game.controller';
import { PlayersModule } from '../players/players.module';
import { UsersModule } from '../users/users.module';
import { Games } from '../entity/games.entity';
import { TelegramService } from '../telegram/telegram.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  providers: [GameService, TelegramService],
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([Games]),
    PlayersModule,
    UsersModule,
  ],
  exports: [GameService, TypeOrmModule],
  controllers: [GameController],
})
export class GameModule {}
