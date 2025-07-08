import { Module } from '@nestjs/common';
import { ExcelController } from './excel.controller';
import { ExcelService } from './excel.service';
import { ExcelReaderService } from './reader/excel-reader.service';
import { ExcelWriterService } from './writer/excel-writer.service';
import { ExcelCalculatorService } from './calculator/excel-calculator.service';

@Module({
  controllers: [ExcelController],
  providers: [
    ExcelService,
    ExcelReaderService,
    ExcelWriterService,
    ExcelCalculatorService,
  ],
})
export class ExcelModule {}
