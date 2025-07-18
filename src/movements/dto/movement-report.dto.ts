import { ApiProperty } from '@nestjs/swagger';

export class MovementReportDto {
  @ApiProperty()
  movement_id: number;

  @ApiProperty()
  company_name: string;

  @ApiProperty()
  acount_code: string;

  @ApiProperty()
  account_name: string;

  @ApiProperty()
  segment_code: string;

  @ApiProperty()
  date: string; // si prefieres Date, cámbialo

  @ApiProperty()
  number: number;

  @ApiProperty()
  supplier: string;

  @ApiProperty()
  concept: string;

  @ApiProperty()
  reference: string;

  @ApiProperty()
  charge: number;
}
