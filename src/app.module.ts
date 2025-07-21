import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ExcelModule } from './excel/excel.module';
import { CompaniesModule } from './companies/companies.module';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from './database/configuration';
import { DatabaseModule } from './database/database.module';
import { databaseValidationSchema } from './config/validation';
import { AccountingAccountsModule } from './accounting-accounts/accounting-accounts.module';
import { SegmentsModule } from './segments/segments.module';
import { MovementsModule } from './movements/movements.module';
import { ConceptsModule } from './concepts/concepts.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      load: [databaseConfig],
      validationSchema: databaseValidationSchema,
    }),
    DatabaseModule,
    ExcelModule,
    CompaniesModule,
    AccountingAccountsModule,
    SegmentsModule,
    MovementsModule,
    ConceptsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
