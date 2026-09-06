import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role, ROLES_KEY } from './roles.decorator';
import { Request } from 'express';
import * as process from 'process';
import { JwtService } from '@nestjs/jwt';
import { Context } from 'telegraf';
import { ACCESS_TOKEN_COOKIE, readCookie } from '../auth/cookie';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const isTgRequest = await this.checkTgRequest(request);
    if (isTgRequest) return true;

    const token = this.extractTokenFromHeader(request);
    let requiredRoles: Role[] = this.reflector.getAllAndOverride<Role[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (request.path === '/api/role-access' && !requiredRoles) {
      requiredRoles = [];
      const roleArr = request.body['roles'];
      roleArr.forEach((item: Role) => {
        requiredRoles.push(Object.values(Role).find((r) => r === item));
      });
    }

    if (!requiredRoles) {
      return true;
    }

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

    return requiredRoles.some((role) => role === request['user'].role);
  }

  private extractTokenFromHeader = (request: Request): string | null => {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    if (type === 'Bearer' && token) {
      return token;
    }
    return readCookie(request, ACCESS_TOKEN_COOKIE);
  };

  private checkTgRequest = async (request: Request) => {
    if (request instanceof Context) {
      const ctx: Context = request;
      try {
        return ctx.telegram.token === process.env.TG_BOT_TOKEN;
      } catch (e) {
        return false;
      }
    }

    return false;
  };
}
