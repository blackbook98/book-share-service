import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController, AuthModule, AuthService } from './auth/exports';
import { UserModule, UserController, UserService } from './user/exports';

@Module({
  imports: [AuthModule, UserModule],
  controllers: [AppController, AuthController, UserController],
  providers: [AppService, AuthService, UserService],
})
export class AppModule {}
