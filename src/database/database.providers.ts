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

    console.log(`{
      type: ${dbConfig.type},
      host: ${dbConfig.host},
      port: ${dbConfig.port},
      username: ${dbConfig.username},
      password: ${dbConfig.password},
      database: ${dbConfig.name},
    }`);

    const result: TypeOrmModuleOptions = {
      type: dbConfig.type,
      host: dbConfig.host,
      port: dbConfig.port,
      username: dbConfig.username,
      password: dbConfig.password,
      database: dbConfig.name,
      entities: [__dirname + '/../**/*.entity.{ts,js}'],
      synchronize: false, // mejor usar migraciones en prod
      migrations: [__dirname + '/../migrations/*{.ts,.js}'],
      migrationsRun: true,
      logging: true,
    };

    return result;
  },
};
