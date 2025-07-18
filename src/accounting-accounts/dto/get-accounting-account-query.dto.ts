import { Type } from 'class-transformer';
import { IsOptional, IsInt } from 'class-validator';

export class GetAccountingAccountsQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  company_id?: number;
}
