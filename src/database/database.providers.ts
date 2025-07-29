import { ConfigService } from '@nestjs/config';
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { DatabaseConfig } from './types/DatabaseConfig';

export const typeOrmConfigAsync: TypeOrmModuleAsyncOptions = {
  inject: [ConfigService],
  useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
    const dbConfig = configService.get<DatabaseConfig>('database');

    if (!dbConfig) {
      throw new Error('Database configuration not found');
    }

    const isProd = configService.get<string>('NODE_ENV') === 'production';

    const result: TypeOrmModuleOptions = {
      type: dbConfig.type,
      host: dbConfig.host,
      port: dbConfig.port,
      username: dbConfig.username,
      password: dbConfig.password,
      database: dbConfig.name,
      entities: [__dirname + '/../**/*.entity.{ts,js}'],
      synchronize: !isProd,
      migrations: [__dirname + '/../migrations/*{.ts,.js}'],
      migrationsRun: isProd,
      logging: !isProd,
    };

    return result;
  },
};
