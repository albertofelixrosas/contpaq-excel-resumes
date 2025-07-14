import { ApiProperty } from '@nestjs/swagger';

export class CreateMovementDto {
  @ApiProperty({
    description:
      'El id de la cuenta contable (un ejemplo de como luce en el excel es "132-000-000-000-00")',
    example: '7',
  })
  acount_id: number;

  @ApiProperty({
    description: 'Fecha del movimiento',
    example: '02/Jun/2025',
  })
  date: string;

  @ApiProperty({
    description:
      'Puede repetirse, se trata del numero de la factura u otro tipo de pago',
    example: '377',
  })
  number: number;

  @ApiProperty({
    description: 'Concepto por el cual se hizo el pago',
    example: 'INSUMOS AGROPECUARIOS Y SERVICIOS VETERINARIOS',
  })
  concept: string;

  @ApiProperty({
    description: 'La referencia a la factura, cheque u otro',
    example: 'F/39850',
  })
  reference: string;

  @ApiProperty({
    description: 'La cantidad de dinero del movimiento',
    example: '1723.51',
  })
  charge: number;
}
