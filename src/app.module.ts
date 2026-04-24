import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/exports';
import { DatabaseModule } from './database/database.module';
import { RecommenderModule } from './recommender/recommender.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    AuthModule,
    RecommenderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
