import { Module } from '@nestjs/common';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entities } from './modelExports';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const databaseUrl = configService.get<string>('DATABASE_URL');

        if (databaseUrl) {
          // Neon / production
          return {
            type: 'postgres',
            url: databaseUrl,
            ssl: { rejectUnauthorized: false },
            entities,
            synchronize: true, // never auto-sync in production
          };
        }

        // Local development
        return {
          type: 'postgres',
          host: configService.get<string>('DB_HOST'),
          port: 5432,
          username: configService.get<string>('DB_USERNAME'),
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_NAME'),
          entities,
          synchronize: true,
        };
      },
    }),
    TypeOrmModule.forFeature(entities),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
