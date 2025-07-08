import { Injectable } from '@nestjs/common';

@Injectable()
export class ExcelReaderService {
  async read(filePath: string): Promise<any[]> {
    try {
      const fetchResponse = await fetch('');
      const json: unknown = await fetchResponse.json();
      console.log({ json });
    } catch (error) {
      console.error(error);
    }
    console.log(`Leyendo archivo desde: ${filePath}`);
    // Aquí pondrías tu lógica para leer con ExcelJS, por ahora mock:
    return [
      { id: 1, value: 10 },
      { id: 2, value: 20 },
    ];
  }
}
