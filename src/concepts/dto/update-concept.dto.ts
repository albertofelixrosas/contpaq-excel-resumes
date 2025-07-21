import { IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateConceptDto {
  @ApiProperty({
    description: 'ID de la empresa a la que pertenece el concepto',
    example: 1,
  })
  @IsPositive()
  @IsInt()
  company_id: number;

  @ApiProperty({
    description: 'Nuevo nombre del concepto',
    example: 'MANTENIMIENTO',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
