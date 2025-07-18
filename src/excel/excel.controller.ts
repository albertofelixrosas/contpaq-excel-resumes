// src/excel/excel.controller.ts
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ExcelService } from './excel.service';
import { diskStorage } from 'multer';
import { ApiConsumes, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('excel')
@ApiTags('Excel')
export class ExcelController {
  constructor(private readonly excelService: ExcelService) {}

  @Post('single')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads', // Directory to save uploaded files
        filename: (req, file, cb) => {
          return cb(null, file.originalname);
        },
      }),
    }),
  )
  @ApiConsumes('multipart/form-data') // Indica que consume multipart
  @ApiBody({
    description: 'Archivo Excel a subir (.xlsx, .xls)',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Archivo procesado correctamente' })
  @ApiResponse({ status: 400, description: 'Tipo de archivo inválido o error' })
  async uploadSingleFile(@UploadedFile() file: Express.Multer.File) {
    const allowedMimes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
    ];
    try {
      console.log({ file });
      if (!file || !allowedMimes.includes(file.mimetype)) {
        throw new BadRequestException(
          'Tipo de archivo invalido, los tipos admitidos son archivos excel (.xls, .xlsx).',
        );
      }
      await this.excelService.parseResume(file.path);
      return {
        message: '¡Se ha procesado correctamente el archivo!',
        filename: file.filename,
        statusCode: 201,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      console.error(error);

      throw new InternalServerErrorException(
        error instanceof Error ? error.message : 'Un error desconocido ocurrió',
      );
    }
  }

  /*
  @Post('info')
  async getCompanyFilesData() {
    
  }
  */
}
