import { Module } from '@nestjs/common';
import { ExcelController } from './excel.controller';
import { ExcelService } from './excel.service';
import { ExcelReaderService } from './reader/excel-reader.service';
import { ExcelWriterService } from './writer/excel-writer.service';
import { ExcelCalculatorService } from './calculator/excel-calculator.service';
import { MovementsModule } from 'src/movements/movements.module';
import { CompaniesModule } from 'src/companies/companies.module';
import { SegmentsModule } from 'src/segments/segments.module';
import { AccountingAccountsModule } from 'src/accounting-accounts/accounting-accounts.module';

@Module({
  imports: [
    MovementsModule,
    CompaniesModule,
    SegmentsModule,
    AccountingAccountsModule,
  ],
  controllers: [ExcelController],
  providers: [
    ExcelService,
    ExcelReaderService,
    ExcelWriterService,
    ExcelCalculatorService,
  ],
})
export class ExcelModule {}
