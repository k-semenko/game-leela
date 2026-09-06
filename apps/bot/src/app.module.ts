import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as process from 'process';
import { TelegrafModule } from 'nestjs-telegraf';
import { session } from 'telegraf';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { UserModule } from './user/user.module';
import { CommandsService } from './services/commands.service';
import { DatabaseService } from './services/db.service';
import { GamesService } from './services/games.service';
import { MessageController } from './message/message.controller';
import { MessageModule } from './message/message.module';
import { LoggerModule } from 'nestjs-pino';
import { AppLoggerConfig } from './core/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TelegrafModule.forRoot({
      token: process.env.TG_BOT_TOKEN,
      launchOptions: {
        dropPendingUpdates: true,
      },
      middlewares: [session()],
    }),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    LoggerModule.forRoot(AppLoggerConfig),
    UserModule,
    MessageModule,
  ],
  controllers: [AppController, MessageController],
  providers: [AppService, DatabaseService, CommandsService, GamesService],
})
export class AppModule {}
