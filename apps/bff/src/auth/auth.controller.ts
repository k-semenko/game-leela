import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Patch,
  Post,
  Request,
  Res,
  Response,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth-guard.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import * as process from 'process';
import { UsersService } from '../users/users.service';
import * as uuid from 'uuid';
import { ResetPassEntity } from '../entity/reset-pass.entity';
import { ChangePassAuthDto } from './auth.dto';
import * as moment from 'moment';
import { LocalStrategy } from './local.auth';
import { MailService } from '../mail/mail.service';
import { Exception } from 'handlebars';
import { TelegramService } from '../telegram/telegram.service';
import { clearAccessTokenCookie, setAccessTokenCookie } from './cookie';

@ApiTags('Auth')
@Controller('api')
export class AuthController {
  constructor(
    private authService: AuthService,
    @Inject(UsersService) private userService: UsersService,
    private readonly mailService: MailService,
    private readonly telegramService: TelegramService,
  ) {}

  @UseGuards(AuthGuard('local'))
  @Post('auth/login')
  async login(@Request() req: any, @Res({ passthrough: true }) res: any) {
    const { access_token } = await this.authService.login(req.user);
    setAccessTokenCookie(res, access_token);
    // Token is httpOnly cookie — do not expose to JS. Keep shape minimal for clients.
    return { ok: true };
  }

  @Post('auth/logout')
  async logout(@Res({ passthrough: true }) res: any) {
    clearAccessTokenCookie(res);
    return { ok: true };
  }

  @UseGuards(JwtAuthGuard)
  @Post('auth/tg')
  @ApiBody({ type: Object })
  async authTelegram(@Body() data: any, @Request() req: any) {
    let user = await this.userService.findUserByTg(data.chatId);

    if (!user) {
      user = await this.userService.fillUserTg(req.user.id, data.chatId);
      await this.telegramService.helloMessage(data.chatId, user);
      return user;
    } else {
      await this.telegramService.startErrorMessage(data.chatId);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete('auth/tg')
  async removeAuthTelegram(@Request() req: any, @Response() res: any) {
    await this.userService.deleteTgRel(req.user.id).catch((err) => {
      throw new BadRequestException(err.error ?? err);
    });
    return res.status(200).json({});
  }

  @UseGuards(JwtAuthGuard)
  @Get('authenticate')
  getAuthentication(@Response() res: any) {
    return res.status(200).json({});
  }

  @Post('role-access')
  @UseGuards(JwtAuthGuard)
  getProfile(@Response() res: any) {
    return res.status(200).json({});
  }

  @Post('auth/change-pass')
  async createChangePassLink(@Body('email') email: string, @Res() res: any) {
    const user = await this.userService.findOne({
      where: { email: email },
    });

    if (!user) {
      throw new BadRequestException('Указанный Email не найден');
    }

    const resetPass = new ResetPassEntity();
    resetPass.userId = user.id;
    resetPass.resetToken = uuid.v4();
    await resetPass.save();

    await this.mailService
      .sendResetPassMessage(user.email, user.username, resetPass.resetToken)
      .then(() => res.status(200).json({}))
      .catch((err) => {
        throw new Exception(err.message);
      });
  }

  @Patch('auth/change-pass')
  async resetPassword(@Body() data: ChangePassAuthDto, @Res() res: any) {
    const resetPass = await this.userService.findResetPass({
      where: { resetToken: data.resetToken },
      order: { id: 'DESC' },
    });

    console.log(resetPass);

    if (
      resetPass &&
      moment().diff(resetPass.createdAt, 'm') <
        Number(process.env.RESET_PASS_EXPIRATION)
    ) {
      const user = await this.userService.findById(resetPass.userId);
      user.password = await LocalStrategy.hashPass(data.password);
      await user.save();

      return res.status(200).json({});
    } else {
      throw new BadRequestException(
        'Ссылка на сброс пароля не корректна или устарела. Пожалуйста запросите новую ссылку через форму восстановления пароля',
      );
    }
  }
}
