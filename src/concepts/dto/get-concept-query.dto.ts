import { Type } from 'class-transformer';
import { IsOptional, IsInt } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetConceptQueryDto {
  @ApiPropertyOptional({
    description: 'ID de la empresa para filtrar los conceptos',
    example: 2,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  company_id?: number;
}
