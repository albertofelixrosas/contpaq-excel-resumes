import {
  IsOptional,
  IsInt,
  IsDateString,
  Min,
  IsString,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class MovementFilterDto {
  @ApiProperty({ description: 'ID de la empresa' })
  @Type(() => Number)
  @IsInt()
  company_id: number;

  @ApiPropertyOptional({ description: 'ID de la cuenta contable' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  accounting_account_id?: number;

  @ApiPropertyOptional({ description: 'ID del segmento' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  segment_id?: number;

  @ApiProperty({ description: 'Fecha inicial (YYYY-MM-DD)' })
  @IsDateString()
  start_date: string;

  @ApiProperty({ description: 'Fecha final (YYYY-MM-DD)' })
  @IsDateString()
  end_date: string;

  @ApiPropertyOptional({ description: 'Nombre del concepto' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  concept?: string;

  @ApiPropertyOptional({ description: 'Página' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number;

  @ApiPropertyOptional({ description: 'Resultados por página' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit: number;
}
