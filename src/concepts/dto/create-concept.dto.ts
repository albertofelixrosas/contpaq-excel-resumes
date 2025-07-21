import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateConceptDto {
  @ApiProperty({
    description: 'Nombre del concepto',
    example: 'OBRA CIVIL',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'ID de la empresa al que pertenece el concepto',
    example: 2,
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  company_id: number;
}
