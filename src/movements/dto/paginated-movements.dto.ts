import { ApiProperty } from '@nestjs/swagger';
import { MovementReportDto } from './movement-report.dto';

export class PaginatedMovementsDto {
  @ApiProperty({ type: [MovementReportDto] })
  data: MovementReportDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  pages: number;
}
