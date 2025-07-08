// src/excel/excel.controller.ts
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Get,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ExcelService } from './excel.service';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('excel')
export class ExcelController {
  constructor(private readonly excelService: ExcelService) {}

  @Post('single')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads', // Directory to save uploaded files
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async uploadSingleFile(@UploadedFile() file: Express.Multer.File) {
    const allowedMimes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
    ];
    try {
      console.log({ file });
      if (!file || !allowedMimes.includes(file.mimetype)) {
        throw new Error('Invalid file type. Please upload an Excel file.');
      }
      const haveValidFileFormat = await this.excelService.validateFormat(
        file.path,
      );
      if (!haveValidFileFormat) {
        throw new Error(
          'El archivo no parece tener el formato correcto para procesarlo',
        );
      }
      // await this.excelService.procesar();
      await this.excelService.parseResume(file.path);
      return {
        message: '¡Se ha procesado correctamente el archivo!',
        filename: file.filename,
      };
    } catch (error) {
      if (error instanceof Error) {
        return {
          message: 'Error uploading file',
          error: error.message,
        };
      }
      return {
        message: 'Error uploading file',
        error: 'An unexpected error occurred.',
      };
    }
  }

  @Get('generate')
  async generate() {
    const path = await this.excelService.createTestExcel();
    return { message: 'Archivo generado', path };
  }
}
