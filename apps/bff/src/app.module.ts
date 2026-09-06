import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsModule } from './events/events.module';
import * as process from 'process';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { GameController } from './game/game.controller';
import { GameModule } from './game/game.module';
import { PlayersModule } from './players/players.module';
import { RolesGuard } from './roles/roles.guard';
import { APP_GUARD } from '@nestjs/core';
import { CellsController } from './cells/cells.controller';
import { CellsModule } from './cells/cells.module';
import { FieldsModule } from './fields/fields.module';
import { FeedbackController } from './feedback/feedback.controller';
import { FeedbackModule } from './feedback/feedback.module';
import { FeedbackService } from './feedback/feedback.service';
import { MailService } from './mail/mail.service';
import { MailModule } from './mail/mail.module';
import { AdminController } from './admin/admin.controller';
import { AdminModule } from './admin/admin.module';
import { AuthService } from './auth/auth.service';
import { UsersService } from './users/users.service';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from './users/users.module';
import { PaymentService } from './payment/payment.service';
import { PaymentController } from './payment/payment.controller';
import { PaymentModule } from './payment/payment.module';
import { HttpModule } from '@nestjs/axios';
import { TariffsModule } from './tariffs/tariffs.module';
import { TariffsService } from './tariffs/tariffs.service';
import { AppDataSource } from './data-source';
import { LoggerModule } from 'nestjs-pino';
import { LoggerParams } from './constants';
import { TelegramService } from './telegram/telegram.service';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    LoggerModule.forRoot(LoggerParams()),
    TypeOrmModule.forRoot(AppDataSource),
    PassportModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '12h' },
    }),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    AuthModule,
    EventsModule,
    GameModule,
    JwtModule,
    PlayersModule,
    CellsModule,
    FieldsModule,
    FeedbackModule,
    MailModule,
    AdminModule,
    UsersModule,
    PaymentModule,
    TariffsModule,
    SeedModule,
  ],
  controllers: [
    AppController,
    GameController,
    CellsController,
    FeedbackController,
    AdminController,
    PaymentController,
  ],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    FeedbackService,
    AuthService,
    UsersService,
    MailService,
    PaymentService,
    TariffsService,
    TelegramService,
  ],
})
export class AppModule {}
