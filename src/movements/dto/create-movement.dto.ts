import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateMovementDto {
  @ApiProperty({
    description:
      'El id del segmento (un ejemplo de como luce en el excel es "023 APK2-41")',
    example: '7',
  })
  @IsPositive()
  @IsInt()
  segment_id: number;

  @ApiProperty({
    description:
      'El id de la cuenta contable (un ejemplo de como luce en el excel es "023 APK2-41")',
    example: '7',
  })
  @IsPositive()
  @IsInt()
  accounting_account_id: number;

  @ApiProperty({
    description: 'Fecha del movimiento',
    example: '2025-07-31',
  })
  @IsNotEmpty()
  @IsString()
  @IsDateString()
  date: string;

  @ApiProperty({
    description:
      'Puede repetirse, se trata del numero de la factura u otro tipo de pago',
    example: '377',
  })
  @IsPositive()
  @IsInt()
  number: number;

  @ApiProperty({
    description: 'Origen del pago, a veces quien fue el responsable del pago',
    example: 'JHONSTON BELTRAN GLADYS',
  })
  @IsNotEmpty()
  @IsString()
  supplier: string;

  @ApiProperty({
    description: 'Concepto por el cual se hizo el pago',
    example: 'SUELDOS Y SALARIOS',
  })
  @IsNotEmpty()
  @IsString()
  concept: string;

  @ApiProperty({
    description: 'La referencia a la factura, cheque u otro',
    example: 'F/39850',
  })
  @IsNotEmpty()
  @IsString()
  reference: string;

  @ApiProperty({
    description: 'La cantidad de dinero del movimiento',
    example: '1723.51',
  })
  @IsNumber({
    maxDecimalPlaces: 2,
  })
  charge: number | null;
}
