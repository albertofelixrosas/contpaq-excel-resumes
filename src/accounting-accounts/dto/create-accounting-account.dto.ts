import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt, IsPositive } from 'class-validator';

export class CreateAccountingAccountDto {
  @ApiProperty({
    description: 'El id de la empresa dentro de este sistema',
    example: '5',
  })
  @IsInt()
  @IsPositive()
  company_id: number;

  @ApiProperty({
    description: 'El identificador de la cuenta proporcionado por CONTPAQi',
    example: '132-000-000-000-00',
  })
  @IsString()
  @IsNotEmpty()
  acount_code: string;

  @ApiProperty({
    description: 'El nombre de la cuenta contable',
    example: 'OBRA CIVIL',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
