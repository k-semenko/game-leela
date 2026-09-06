import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import * as process from 'process';
import { ACCESS_TOKEN_COOKIE, readCookie } from './cookie';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);
    if (!token) {
      throw new UnauthorizedException('Пользователь не авторизован');
    }

    request['user'] = await this.jwtService
      .verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      })
      .catch((e) => {
        throw new UnauthorizedException(e);
      });
    return true;
  }

  private extractToken(request: Request): string | null {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    if (type === 'Bearer' && token) {
      return token;
    }
    return readCookie(request, ACCESS_TOKEN_COOKIE);
  }
}
