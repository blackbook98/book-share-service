import { Controller, UseGuards, Post, Get, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RecommenderService } from './recommender.service';

@Controller('recommender')
export class RecommenderController {
  constructor(private readonly recommendationService: RecommenderService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('')
  async getRecommendations() {
    console.log('Computing recommendations for all eligible users...');
    return this.recommendationService.computeAllRecommendations();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/:userId')
  async getUserRecommendations(@Param('userId') userId: string) {
    return this.recommendationService.getRecommendationsForUser(userId);
  }
}
