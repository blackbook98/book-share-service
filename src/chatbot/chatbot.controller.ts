import { Controller, Post, Body, UseGuards, Request, HttpException, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ChatbotService } from './chatbot.service';
import { v4 as uuidv4 } from 'uuid';

class ChatMessageDto {
  message: string;
  session_id: string;
}

@Controller('chatbot')
@UseGuards(AuthGuard('jwt'))
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Post('message')
  async chat(@Body() dto: ChatMessageDto, @Request() req) {
    const userId = req.user.userId;
    const sessionId = dto.session_id || uuidv4();

    try {
      const response = await this.chatbotService.chat(
        userId,
        dto.message,
        sessionId,
      );
      return { response, session_id: sessionId };
    } catch (error) {
      throw new HttpException(
        error.message || 'Chatbot failed to respond',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
