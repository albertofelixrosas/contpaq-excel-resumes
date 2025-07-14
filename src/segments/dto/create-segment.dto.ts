import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSegmentDto {
  @ApiProperty({ description: 'Código del segmento', example: '024 APK2-41.1' })
  code: string;

  @ApiPropertyOptional({
    description: 'Nombre del segmento',
    example: 'Segmento Norte',
  })
  name?: string;

  @ApiPropertyOptional({
    description: 'Fecha del segmento',
    example: '2024-01-01',
  })
  date?: string;

  @ApiPropertyOptional({
    description: 'Nombre de la granja',
    example: 'Granja Los Pinos',
  })
  farm_name?: string;
}
