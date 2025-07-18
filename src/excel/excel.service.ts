// src/excel/excel.service.ts
import { BadRequestException, Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
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
import { CreateMovementDto } from 'src/movements/dto/create-movement.dto';

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

  async procesar(filePath: string): Promise<string> {
    const resumen = await this.calculator.resumirPorNombre(filePath);
    const outputPath = 'output/resumen.xlsx';
    await this.writer.writeResumen(resumen, outputPath);
    return outputPath;
  }

  async loadAllMovementDataByFilename(filePath: string): Promise<void> {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    const sheet = workbook.worksheets[0];

    const rows = sheet.getSheetValues(); // matriz [fila][columna]

    // 1️⃣ Buscar la razón social de la empresa
    const companyName = String(rows[1]?.[4] || '').trim();

    if (!companyName) {
      throw new BadRequestException(
        'No se encontró la razón social en el documento',
      );
    }

    // Buscar la razón social en la base de datos para obtener su id
    try {
      const company =
        await this.companiesService.findOrCreateByCompanyName(companyName);

      // 2️⃣ Buscar las cuentas contables
      let currentAccountId = 0;
      let currentAccountName = '';
      let currentSegmentId = 0;
      for (let i = 1; i < rows.length; i++) {
        const currentRow = rows[i];
        const currentFirstColumn = String(rows[i]?.[1] || '').trim();
        // 3️⃣ Buscar a partir del valor de la primera columna:
        // 1. Cuenta contable
        if (currentFirstColumn.match(acountNumberRegex)) {
          const accountName = String(rows[i]?.[2] || '').trim();
          currentAccountName = accountName;
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
            company.company_id,
            segmentCode,
          );
          currentSegmentId = segment.segment_id;
        }
        // 3. Movimiento
        if (currentFirstColumn.match(excelCommonDateRegex)) {
          const movementDate = String(currentRow?.[1] || '');
          // const movementType = String(currentRow?.[2] || ''); // El tipo del movimiento -> "Diario" o "Egresos"
          const movementNumber = String(currentRow?.[3] || '');
          const movementConcept = String(currentRow?.[4] || ''); // Aquí es en realidad el proveedor
          const movementReference = String(currentRow?.[5] || '');
          const movementCharge = String(currentRow?.[6] || '');
          const finalChargeValue = parseFloat(movementCharge);

          const dto: CreateMovementDto = {
            segment_id: currentSegmentId,
            accounting_account_id: currentAccountId,
            date: convertToISODate(movementDate),
            number: parseInt(movementNumber),
            concept: currentAccountName, // valor por defecto, luego cambiará por el usuario
            charge: isNaN(finalChargeValue) ? null : finalChargeValue,
            reference: movementReference,
            supplier: movementConcept,
          };
          await this.movementsService.create(dto);
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        throw error;
      }
      throw error;
    }
  }
}
