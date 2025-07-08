import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';

@Injectable()
export class ExcelCalculatorService {
  async resumirPorNombre(filePath: string): Promise<Record<string, number>> {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);

    const worksheet = workbook.worksheets[0];
    const resumen: Record<string, number> = {};

    let currentNombre = '';
    let acumulado = 0;

    worksheet.eachRow((row, rowNumber) => {
      console.log({ row, rowNumber });
      const getCellString = (cell: ExcelJS.Cell) => {
        const value = cell.value;
        type TextValue = {
          text: string;
        };
        type ResultValue = {
          result: string;
        };
        if (typeof value === 'object' && value !== null) {
          // ExcelJS may return objects for rich text, formulas, etc.
          if ('text' in value) return String((value as TextValue).text).trim();
          if ('result' in value)
            return String((value as ResultValue).result).trim();
          return '';
        }
        return String(value ?? '').trim();
      };

      const cell1 = getCellString(row.getCell(1));
      const cell2 = getCellString(row.getCell(2));
      const cell7 = getCellString(row.getCell(7));
      const cell8 = getCellString(row.getCell(8));

      if (cell7 === 'Saldo inicial:') {
        // nuevo bloque detectado
        if (currentNombre) {
          // guarda el acumulado anterior
          if (!resumen[currentNombre]) resumen[currentNombre] = 0;
          resumen[currentNombre] += acumulado;
        }

        currentNombre = cell2; // "Nombre"
        acumulado = 0;
      } else if (this.isValidDate(cell1)) {
        // fila de movimiento
        const saldo = this.parseNumber(cell8);
        acumulado = saldo; // normalmente el último saldo es el acumulado
      }
    });

    // guarda el último bloque
    if (currentNombre) {
      if (!resumen[currentNombre]) resumen[currentNombre] = 0;
      resumen[currentNombre] += acumulado;
    }

    return resumen;
  }

  private isValidDate(value: string): boolean {
    // detecta algo como dd/mmm/yyyy
    return /^\d{1,2}\/[a-zA-Z]{3}\/\d{4}$/.test(value);
  }

  private parseNumber(value: string): number {
    // quita comas, espacios y convierte a número
    return parseFloat(value.replace(/,/g, '').trim()) || 0;
  }
}
