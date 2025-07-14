// src/excel/excel.service.ts
import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import * as path from 'path';
import { ExcelReaderService } from './reader/excel-reader.service';
import { ExcelCalculatorService } from './calculator/excel-calculator.service';
import { ExcelWriterService } from './writer/excel-writer.service';
// import { Record, Resume } from 'src/types/excel';

@Injectable()
export class ExcelService {
  constructor(
    private readonly reader: ExcelReaderService,
    private readonly calculator: ExcelCalculatorService,
    private readonly writer: ExcelWriterService,
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

    // const resume: Resume = { records: [] };

    const rows = sheet.getSheetValues(); // matriz [fila][columna]
    let startIndex = 1;

    console.log({ rows });

    // 1️⃣ Buscar el primer registro con "Egresos" o "Diario" en la columna 2
    for (let i = 1; i < rows.length; i++) {
      const col1 = String(rows[i]?.[1] || '').trim();
      if (col1.toLowerCase().startsWith('segmento:')) {
        startIndex = i;
        break;
      }
    }

    // 2️⃣ Buscar a partir de ahí la fila con "N o m b r e"
    let nombreRowIndex = -1;
    for (let i = startIndex; i < rows.length; i++) {
      const found = String(rows[i]?.[2] || '').replace(/\s/g, '');
      if (found.toLowerCase() === 'nombre') {
        nombreRowIndex = i;
        break;
      }
    }

    if (nombreRowIndex === -1) {
      console.error('No se encontró la fila con "N o m b r e"');
      // return resume;
    }

    // 3️⃣ Procesar los bloques de movimientos a partir de la fila vacía debajo de "Tipo"
    let i = nombreRowIndex + 3; // saltar "Nombre", "Tipo", y la fila vacía
    while (i < rows.length) {
      const currentRow = rows[i];
      const cuenta = String(currentRow?.[1] || '').trim();
      const nombre = String(currentRow?.[2] || '').trim();

      if (!cuenta && !nombre) {
        i++;
        continue;
      }

      /*
      const record: Record = {
        title: nombre,
        rows: [],
      };
      */

      const nextRow = rows[i + 1] || [];
      const nextRowFirstCell = String(nextRow?.[1] || '').trim();

      // 4️⃣ Ver si tiene movimientos
      if (!nextRowFirstCell) {
        // no hay movimientos asociados
        // resume.records.push(record); -> Agregar registro de los movimientos
        i += 2; // saltar esta cabecera + fila vacía
        continue;
      }

      i++; // bajar al primer movimiento
      while (i < rows.length) {
        const row = rows[i];
        const date = String(row?.[1] || '').trim();
        const type = String(row?.[2] || '').trim() as 'Egresos' | 'Diario';
        /*
        const number = Number(row?.[3] || 0);
        const concept = String(row?.[4] || '').trim();
        const reference = String(row?.[5] || '').trim();
        const debits = this.parseNumber(row?.[6]);
        const credits = this.parseNumber(row?.[7]);
        const balance = this.parseNumber(row?.[8]);
        */

        if (!date) {
          i++;
          continue;
        }

        // detener si encontramos "Segmento: 100 GG" en la primera celda
        const firstCell = String(row?.[1] || '').trim();
        if (
          !date || // está vacío
          firstCell.toLowerCase().includes('subtotal') ||
          firstCell.toLowerCase().includes('total') ||
          (!this.isValidDate(date) && !['Egresos', 'Diario'].includes(type))
        ) {
          break; // fin de los movimientos de este título
        }

        if (this.isValidDate(date)) {
          /*
          record.rows.push({
            date,
            type,
            number,
            concept,
            reference,
            debits,
            credits,
            balance,
          });
          */
        }

        i++;
      }

      // resume.records.push(record);
    }

    await this.writer.writeJson(/* resume */ {});
    // return resume;
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
