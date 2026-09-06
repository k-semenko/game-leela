import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { UsersService } from '../users/users.service';
import { UsersModule } from '../users/users.module';
import { AuthService } from '../auth/auth.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [UsersModule, AuthModule],
  providers: [UsersService, AuthService],
  controllers: [AdminController],
})
export class AdminModule {}
