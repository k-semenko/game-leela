import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { JwtModule } from '@nestjs/jwt';
import * as process from 'process';
import { TelegramUserRel } from '../entity/tg.entity';
import { User } from '../entity/user.entity';
import { ResetPassEntity } from '../entity/reset-pass.entity';
import { TelegramService } from '../telegram/telegram.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  providers: [UsersService, TelegramService],
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([User, TelegramUserRel, ResetPassEntity]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '12h' },
    }),
  ],
  exports: [UsersService, TypeOrmModule],
  controllers: [UsersController],
})
export class UsersModule {}
