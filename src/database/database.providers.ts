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

    const databaseProperties = {
      type: dbConfig.type,
      host: dbConfig.host,
      port: dbConfig.port,
      username: dbConfig.username,
      password: dbConfig.password,
      database: dbConfig.name,
    };

    setTimeout(() => {
      console.log(JSON.stringify(databaseProperties, null, 2));
    }, 2000);

    const result: TypeOrmModuleOptions = {
      type: dbConfig.type,
      host: dbConfig.host,
      port: dbConfig.port,
      username: dbConfig.username,
      password: dbConfig.password,
      database: dbConfig.name,
      entities: [__dirname + '/../**/*.entity.{ts,js}'],
      synchronize: true, // mejor usar migraciones en prod
      migrations: [__dirname + '/../migrations/*{.ts,.js}'],
      migrationsRun: true,
      logging: false, // imprime que cosas suceden en cuanto a sentencias sql en terminal
    };

    return result;
  },
};
