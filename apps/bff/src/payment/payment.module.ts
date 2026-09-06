import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentController } from './payment.controller';
import { HttpModule } from '@nestjs/axios';
import { TariffsModule } from '../tariffs/tariffs.module';
import { Payments } from '../entity/payments.entity';
import { UsersModule } from '../users/users.module';
import { TelegramService } from '../telegram/telegram.service';

@Module({
  providers: [PaymentService, TelegramService],
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([Payments]),
    TariffsModule,
    UsersModule,
  ],
  exports: [PaymentService, TypeOrmModule],
  controllers: [PaymentController],
})
export class PaymentModule {}
