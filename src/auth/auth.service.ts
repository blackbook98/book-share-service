import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/exports';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async login(user: any) {
    try {
      let validation = await this.validateUser(user.username, user.password);
      if (validation) {
        const payload = { username: user.username, sub: user.id };
        let access_token = this.jwtService.sign(payload);
        return {
          access_token: access_token,
        };
      }
    } catch (error) {
      throw new UnauthorizedException('Login failed');
    }
  }
}
