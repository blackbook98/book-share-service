import {
  Controller,
  UseGuards,
  Post,
  Get,
  Delete,
  Body,
  Query,
  Param,
} from '@nestjs/common';
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

  @UseGuards(AuthGuard('jwt'))
  @Delete('lists')
  async deleteList(@Body() body: { book_id: string; user_id: string }) {
    return this.userService.deleteList(body.book_id, body.user_id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('reviews')
  async saveReview(@Body() body: any) {
    return this.userService.saveReview(body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('reviews/:bookId')
  async getReviewsByBook(@Param('bookId') bookId: string) {
    return this.userService.getReviewsByBook(bookId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('reviews/user')
  async getReviewsByUser(@Query('userId') userId: string) {
    return this.userService.getReviewsByUser(userId);
  }
}
