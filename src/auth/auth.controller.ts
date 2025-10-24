import { Controller, Post, Request } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Request() req) {
    let { user } = req.body;
    return this.authService.login(user);
  }

  @Post('register')
  async register(@Request() req) {
    let { user } = req.body;
    return this.authService.register(user);
  }
}
