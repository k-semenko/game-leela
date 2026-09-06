import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../entity/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<User> {
    const user: User = await this.usersService.findUserByUsername(username);

    if (!user) {
      throw new BadRequestException('Пользователь не найден');
    }

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      throw new BadRequestException('Не верный логин или пароль');
    }

    if (user && passwordValid) {
      return user;
    }
  }

  async login(user: any): Promise<{ access_token: string }> {
    const accessToken = this.jwtService.sign({
      id: user.id,
      username: user.username,
      role: user.role,
    });

    return { access_token: accessToken };
  }
}
