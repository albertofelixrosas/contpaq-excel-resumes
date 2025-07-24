import { IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class GetAnnualReportQueryDto {
  @Type(() => Number)
  @IsInt()
  @Min(1900)
  year: number;

  @Type(() => Number)
  @IsInt()
  company_id: number;
}
