import { Type } from 'class-transformer';
import { IsOptional, IsInt } from 'class-validator';

export class GetSegmentsQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  company_id?: number;
}
