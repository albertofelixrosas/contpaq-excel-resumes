// import { TypeOrmModuleOptions } from '@nestjs/typeorm';
// export type DatabasesOption = Pick<TypeOrmModuleOptions, 'type'>;

type DatabaseName =
  | 'postgres'
  | 'mysql'
  | 'sqlite'
  | 'mssql'
  | 'oracle'
  | 'mongodb';

export interface DatabaseConfig {
  type: DatabaseName;
  host: string;
  port: number;
  username: string;
  password: string;
  name: string;
}
