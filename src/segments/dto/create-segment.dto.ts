import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsPositive,
  IsInt,
  IsDateString,
} from 'class-validator';

export class CreateSegmentDto {
  @ApiProperty({ description: 'Código del segmento', example: '024 APK2-41.1' })
  @IsNotEmpty()
  @IsString()
  code: string;

  @ApiProperty({
    description:
      'Empresa a la que pertenece el segmento (id dentro de este sistema)',
    example: '8',
  })
  @IsInt()
  @IsPositive()
  company_id: number;

  @ApiPropertyOptional({
    description: 'Nombre del segmento',
    example: 'Segmento Norte',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: 'Fecha del segmento',
    example: '2024-01-01',
  })
  @IsDateString()
  date?: string;

  @ApiPropertyOptional({
    description: 'Nombre de la granja',
    example: 'Granja Los Pinos',
  })
  @IsString()
  @IsOptional()
  farm_name?: string;
}
