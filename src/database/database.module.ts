import { Module } from '@nestjs/common';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './models/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: 5432,
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [User], //TODO: import all entities
        synchronize:
          configService.get<string>('NODE_ENV') === 'production' ? false : true,
      }),
    }),
    TypeOrmModule.forFeature([User]), //TODO: import all entities
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
