import { Controller, UseGuards, Post, Get, Body, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('saveLists')
  async saveLists(@Body() body: any) {
    await this.userService.saveLists(body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('lists')
  async getLists(@Query('userId') userId: string) {
    return this.userService.getLists(userId);
  }
}
