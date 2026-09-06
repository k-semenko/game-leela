import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';
import { LocalStrategy } from './local.auth';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from '../entity/user.entity';
import { MailService } from '../mail/mail.service';
import { TelegramService } from '../telegram/telegram.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [UsersModule, HttpModule, TypeOrmModule.forFeature([User])],
  providers: [
    AuthService,
    UsersService,
    LocalStrategy,
    TelegramService,
    MailService,
  ],
  exports: [AuthModule, TypeOrmModule],
  controllers: [AuthController],
})
export class AuthModule {}
