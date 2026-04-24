import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { UserService } from '../user/user.service';
import { RecommenderService } from '../recommender/recommender.service';
import { ChatbotController } from './chatbot.controller';
import { ChatbotService } from './chatbot.service';

@Module({
  imports: [DatabaseModule],
  controllers: [ChatbotController],
  providers: [ChatbotService, UserService, RecommenderService],
})
export class ChatbotModule {}
