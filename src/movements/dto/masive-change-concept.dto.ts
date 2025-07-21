import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class MasiveChangeConceptDto {
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

  @ApiPropertyOptional({ description: 'Nombre del concepto' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  concept?: string;

  @ApiPropertyOptional({ description: 'Nombre del provedor' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  supplier?: string;

  @ApiProperty({
    description: 'Nombre del concepto que será el nuevo valor',
  })
  @IsString()
  @IsNotEmpty()
  new_concept: string;
}
