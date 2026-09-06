import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Strategy } from 'passport-local';
import * as bcrypt from 'bcrypt';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  //  @UseGuards(AuthGuard('local'))
  async validate(username: string, password: string): Promise<any> {
    return await this.authService.validateUser(username, password);
  }

  static validatePass = async (
    pass: string,
    currentPass: string,
  ): Promise<boolean> => {
    return await bcrypt.compare(pass, currentPass);
  };

  static hashPass = async (pass: string): Promise<string> => {
    return await bcrypt.hash(pass, 10);
  };
}
