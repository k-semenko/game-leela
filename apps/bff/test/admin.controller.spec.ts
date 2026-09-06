import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from '../src/admin/admin.controller';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../src/users/users.service';
import { GameService } from '../src/game/game.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../src/entity/user.entity';
import { Games } from '../src/entity/games.entity';
import { TelegramUserRel } from '../src/entity/tg.entity';
import { ResetPassEntity } from '../src/entity/reset-pass.entity';
import { AuthModule } from '../src/auth/auth.module';
import { AuthService } from '../src/auth/auth.service';

describe('AdminController', () => {
  let controller: AdminController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [
        JwtService,
        UsersService,
        GameService,
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: {},
        },
        {
          provide: getRepositoryToken(Games),
          useValue: {},
        },
        {
          provide: getRepositoryToken(TelegramUserRel),
          useValue: {},
        },
        {
          provide: getRepositoryToken(ResetPassEntity),
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<AdminController>(AdminController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
