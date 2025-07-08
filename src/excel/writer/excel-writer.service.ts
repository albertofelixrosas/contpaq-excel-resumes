import { Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import * as ExcelJS from 'exceljs';
import * as fsPromises from 'fs/promises';

@Injectable()
export class ExcelWriterService {
  async write(results: any): Promise<string> {
    console.log('Escribiendo resultados en archivo...');
    const outputPath = path.join(__dirname, '../../../output/results.json');

    try {
      const fetchResponse = await fetch('');
      const json: unknown = await fetchResponse.json();
      console.log({ json });
    } catch (error) {
      console.error(error);
    }

    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2), 'utf-8');

    return outputPath;
  }

  async writeResumen(
    resumen: Record<string, number>,
    outputPath: string,
  ): Promise<void> {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Resumen');

    sheet.columns = [
      { header: 'Concepto', key: 'concepto', width: 30 },
      { header: 'Total', key: 'total', width: 15 },
    ];

    Object.entries(resumen).forEach(([nombre, total]) => {
      sheet.addRow({ concepto: nombre, total });
    });

    await workbook.xlsx.writeFile(outputPath);
  }

  async writeJson(data: unknown, filename = 'result.json'): Promise<string> {
    // Construir la ruta absoluta a la carpeta uploads/
    const uploadsDir = path.resolve(__dirname, '..', '..', 'uploads');
    const filePath = path.join(uploadsDir, filename);

    try {
      // Asegúrate de que la carpeta existe
      await fsPromises.mkdir(uploadsDir, { recursive: true });

      // Serializar los datos con formato legible
      const json = JSON.stringify(data, null, 2);

      // Escribir el archivo
      await fsPromises.writeFile(filePath, json, 'utf-8');

      console.log(`✅ Archivo JSON escrito en: ${filePath}`);
      return filePath;
    } catch (err) {
      console.error(`❌ Error al escribir el JSON:`, err);
      throw err;
    }
  }
}
