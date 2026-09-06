import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Patch,
  Post,
  Req,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  UpdateUserDto,
  UpdateUserInterface,
  UserRole,
  UsersDTO,
  UsersInterface,
} from './users.interface';
import * as process from 'process';
import { JwtAuthGuard } from '../auth/jwt-auth-guard.service';
import { Role, Roles } from '../roles/roles.decorator';
import {
  ApiBody,
  ApiExcludeEndpoint,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Not } from 'typeorm';
import { User } from '../entity/user.entity';
import { ChangePassDto } from './user.dto';
import { LocalStrategy } from '../auth/local.auth';
import { PinoLogger } from 'nestjs-pino';
import { TelegramService } from '../telegram/telegram.service';

@ApiTags('Users')
@Controller('api')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly telegramService: TelegramService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(UsersController.name);
  }

  @Get('/users/all')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Получение данных по всем пользователям' })
  async getAllUsers(@Request() req: any): Promise<User[]> {
    if (req.user.role !== UserRole.Admin) {
      throw new ForbiddenException('Доступ запрещен');
    }

    return this.usersService.findAll();
  }

  @Patch('/profile/change-pass')
  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: ChangePassDto })
  @ApiOperation({ summary: 'Изменение пароля из ЛК пользователя' })
  async changePassFromLk(
    @Body() data: ChangePassDto,
    @Req() req: any,
    @Res() res: any,
  ) {
    const user = await this.usersService.findOne({
      select: { id: true, password: true },
      where: { id: req.user.id },
    });

    const passwordValid = await LocalStrategy.validatePass(
      data.oldPassword,
      user.password,
    );

    if (!passwordValid) {
      throw new BadRequestException('Текущий пароль не верен');
    } else {
      user.password = await LocalStrategy.hashPass(data.password);
      await user.save();
    }

    return res.status(200).json({ message: 'Пароль успешно изменен' });
  }

  @Post('/signup')
  @ApiBody({ type: UsersDTO })
  @ApiOperation({ summary: 'Регистрация нового пользователя' })
  async createUser(@Body() user: UsersInterface, @Res() res: any) {
    const errors: string[] = [];
    if (user.role === UserRole.Admin) {
      if (!user?.secret || user.secret !== process.env.JWT_SECRET) {
        throw new ForbiddenException('Регистрация запрещена');
      }
    } else if (![UserRole.User, UserRole.Curator].includes(user.role)) {
      throw new BadRequestException('Неизвестная роль');
    }

    if (!user?.username) errors.push('Поле "Логин" обязательно.');
    if (!user?.password) errors.push('Поле "Пароль" обязательно.');

    const issetUser: User | undefined =
      await this.usersService.findUserByUsername(user?.username);
    if (issetUser) errors.push('Пользователь с таким логином уже существует');

    if (errors?.length !== 0) {
      throw new BadRequestException(errors.join('\n'));
    }

    user.password = await LocalStrategy.hashPass(user.password);

    const createdUser = await this.usersService
      .createUser(user)
      .catch((error) => {
        throw new BadRequestException(`${error.code} ${error.detail}`);
      });

    if (createdUser) {
      try {
        await this.telegramService.sendMessageToGroup(
          `*Новый пользователь!*
${process.env.ORIGIN}` +
            `

Логин: *${createdUser.username}*
Роль: *${createdUser.role}*`,
        );
      } catch {
        // Bot/TG may be offline in local dev — user is already created.
      }

    } else {
      throw new BadRequestException(
        'Не удалось создать пользователя. Попробуйте позже',
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/user/update')
  @ApiOperation({ summary: 'Обновление данных пользователя' })
  @ApiBody({ type: UpdateUserDto })
  async updateUserData(
    @Body() user: UpdateUserInterface,
    @Request() req: any,
    @Res() res: any,
  ) {
    if (user.id !== req.user.id && req.user.role !== Role.ADMIN) {
      throw new ForbiddenException('Нельзя обновить чужой профиль');
    }

    if (user.email !== null) {
      const userData = await this.usersService.findOne({
        where: { id: Not(user.id), email: user.email },
      });

      if (userData) {
        throw new BadRequestException(
          'Указанный Email уже используется в системе',
        );
      }
    }

    await this.usersService.updateUser(user).catch((error) => {
      throw new BadRequestException(error);
    });

    return res.status(200).json({ message: 'Данные пользователя обновлены' });
  }

  @Get('/user/profile')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Получение данных пользователя' })
  async getUserProfileData(@Request() req: any, @Res() res: any) {
    const user = await this.usersService
      .profileInfo(req.user.username)
      .catch((error) => {
        throw new BadRequestException(error);
      });

    return res.status(200).json({
      ...user,
      tg: user.tg?.telegramId ?? null,
    });
  }

  @Delete('/user/profile')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Удаление пользователя' })
  async deleteUserProfile(@Request() req: any) {
    return await this.usersService.deleteUser(req.user.id).catch((error) => {
      throw new BadRequestException(error);
    });
  }

  @Get('userData')
  @UseGuards(JwtAuthGuard)
  @ApiExcludeEndpoint()
  async getUserData(@Request() req: any) {
    const user = await this.usersService.findById(req.user.id);
    if (!user) {
      return req.user;
    }
    return {
      id: user.id,
      username: user.username,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      exp: req.user.exp,
    };
  }
}
