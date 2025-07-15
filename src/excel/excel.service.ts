// src/excel/excel.service.ts
import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import * as path from 'path';
import { ExcelReaderService } from './reader/excel-reader.service';
import { ExcelCalculatorService } from './calculator/excel-calculator.service';
import { ExcelWriterService } from './writer/excel-writer.service';
import { acountNumberRegex } from './utils/excelUtils';
import { CompaniesService } from 'src/companies/companies.service';
import { AccountingAccountsService } from 'src/accounting-accounts/accounting-accounts.service';
import { SegmentsService } from 'src/segments/segments.service';
import { MovementsService } from 'src/movements/movements.service';
import { convertToISODate } from './utils/dateUtils';
import { excelCommonDateRegex } from './utils/dateUtils';

@Injectable()
export class ExcelService {
  constructor(
    private readonly reader: ExcelReaderService,
    private readonly calculator: ExcelCalculatorService,
    private readonly writer: ExcelWriterService,
    private readonly companiesService: CompaniesService,
    private readonly accountsService: AccountingAccountsService,
    private readonly segmentsService: SegmentsService,
    private readonly movementsService: MovementsService,
  ) {}

  async validateFormat(filePath: string): Promise<boolean> {
    try {
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.readFile(filePath);
      console.log({ workbook });
      const worksheet = workbook.worksheets[0];

      if (!worksheet) {
        console.error('No se encontró la hoja de cálculo.');
        return false;
      }
      console.log('Contenido del archivo:');
      // Leer filas
      worksheet.eachRow((row, rowNumber) => {
        if (Array.isArray(row.values)) {
          row.values.forEach((field, columnNumber) => {
            console.log(
              `Row: ${rowNumber}, Column ${columnNumber}: ${
                typeof field === 'object' && field !== null
                  ? JSON.stringify(field)
                  : String(field)
              }`,
            );
          });
        }
      });
      return true;
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        console.error(error.stack);
      }
      return false;
    }
  }

  async createTestExcel(): Promise<string> {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Resumen');

    sheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Nombre', key: 'name', width: 30 },
      { header: 'Monto', key: 'amount', width: 15 },
    ];

    sheet.addRow({ id: 1, name: 'Juan Pérez', amount: 1000 });
    sheet.addRow({ id: 2, name: 'Ana García', amount: 2500 });

    const outputPath = path.join(__dirname, '../../output/resumen.xlsx');
    await workbook.xlsx.writeFile(outputPath);

    return outputPath;
  }

  async procesar(filePath: string): Promise<string> {
    const resumen = await this.calculator.resumirPorNombre(filePath);
    const outputPath = 'output/resumen.xlsx';
    await this.writer.writeResumen(resumen, outputPath);
    return outputPath;
  }

  async parseResume(filePath: string): Promise<void> {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    const sheet = workbook.worksheets[0];

    const rows = sheet.getSheetValues(); // matriz [fila][columna]

    // 1️⃣ Buscar la razón social de la empresa
    const companyName = String(rows[1]?.[4] || '').trim();
    console.log({ companyName });

    // Buscar la razón social en la base de datos para obtener su id
    try {
      const company =
        await this.companiesService.findOrCreateByCompanyName(companyName);

      // 2️⃣ Buscar las cuentas contables
      let currentAccountId = 0;
      let currentSegmentId = 0;
      for (let i = 1; i < rows.length; i++) {
        const currentRow = rows[i];
        const currentFirstColumn = String(rows[i]?.[1] || '').trim();
        // 3️⃣ Buscar a partir del valor de la primera columna:
        // 1. Cuenta contable
        if (currentFirstColumn.match(acountNumberRegex)) {
          const accountName = String(rows[i]?.[2] || '').trim();
          const companyId = company.company_id;
          const account = await this.accountsService.findOrCreateByCodeAndName(
            companyId,
            currentFirstColumn,
            accountName,
          );
          currentAccountId = account.accounting_account_id;
        }
        // 2. Segmento
        if (currentFirstColumn.toLowerCase().startsWith('segmento')) {
          const segmentCode = currentFirstColumn
            .split(' ')
            .filter((_, index) => index > 0)
            .join(' ')
            .trim();
          const segment = await this.segmentsService.findOrCreateByCode(
            currentAccountId,
            segmentCode,
          );
          currentSegmentId = segment.segment_id;
        }
        // 3. Movimiento
        if (currentFirstColumn.match(excelCommonDateRegex)) {
          const movementDate = String(currentRow?.[1] || '');
          // const movementType = String(currentRow?.[2] || ''); // El tipo del movimiento -> "Diario" o "Egresos"
          const movementNumber = String(currentRow?.[3] || '');
          const movementConcept = String(currentRow?.[4] || '');
          const movementReference = String(currentRow?.[5] || '');
          const movementCharge = String(currentRow?.[6] || '');
          const dto = {
            segment_id: currentSegmentId,
            date: convertToISODate(movementDate),
            number: parseInt(movementNumber),
            concept: movementConcept,
            charge: parseFloat(movementCharge),
            reference: movementReference,
          };
          const movement = await this.movementsService.create(dto);
          console.log({ movement });
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        throw error;
      }
      throw error;
    }
    /*
    SELECT c.company_name, aa.acount_code, aa."name", s.code, m."date", m."number", m.concept, m.reference, m.charge FROM companies AS c 
    INNER JOIN accounting_accounts AS aa ON c.company_id = aa.company_id
    INNER JOIN segments AS s ON aa.accounting_account_id = s.accounting_account_id
    INNER JOIN movements AS m ON s.segment_id = m.segment_id;
    */
  }

  private isValidDate(value: string): boolean {
    return /^\d{1,2}\/[a-zA-Z]{3}\/\d{4}$/.test(value);
  }

  private parseNumber(value: any): number {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      return parseFloat(value.replace(/,/g, '').trim()) || 0;
    }
    return 0;
  }
}
