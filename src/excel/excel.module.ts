import { Module } from '@nestjs/common';
import { ExcelController } from './excel.controller';
import { ExcelService } from './excel.service';
import { ExcelReaderService } from './reader/excel-reader.service';
import { ExcelWriterService } from './writer/excel-writer.service';
import { ExcelCalculatorService } from './calculator/excel-calculator.service';
import { MovementsService } from 'src/movements/movements.service';
import { CompaniesService } from 'src/companies/companies.service';
import { SegmentsService } from 'src/segments/segments.service';
import { AccountingAccountsService } from 'src/accounting-accounts/accounting-accounts.service';

@Module({
  imports: [
    MovementsService,
    CompaniesService,
    SegmentsService,
    AccountingAccountsService,
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
