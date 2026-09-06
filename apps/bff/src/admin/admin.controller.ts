import { Controller, Param, Post, Res, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { Role, Roles } from '../roles/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth-guard.service';
import { UsersService } from '../users/users.service';
import { AuthService } from '../auth/auth.service';
import { User } from '../entity/user.entity';

@ApiTags('Admin')
@Controller('api/admin')
export class AdminController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('loginAsUser/:id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Авторизация под пользователем' })
  @ApiParam({
    type: Number,
    name: 'id',
    description: 'ID пользователя',
  })
  async loginAyUser(@Param('id') userId: number, @Res() res: any) {
    const user: User = await this.userService.findById(userId);

    if (user) {
      const token = await this.authService.login(user);
      return res.status(200).json(token);
    } else {
      return res.status(404).json({ message: 'User not found' });
    }
  }
}
