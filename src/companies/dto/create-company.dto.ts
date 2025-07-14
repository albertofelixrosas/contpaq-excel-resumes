import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCompanyDto {
  @ApiProperty({
    description: 'Razón social de la empresa',
    example: 'EMPRESAS S DOS SA DE CV 2015',
  })
  @IsNotEmpty()
  @IsString()
  company_name: string;

  @ApiProperty({
    description: 'Identificador unico de la empresa de hacienda',
    example: 'VECJ880326',
  })
  @IsNotEmpty()
  @IsString()
  rfc: string;
}
