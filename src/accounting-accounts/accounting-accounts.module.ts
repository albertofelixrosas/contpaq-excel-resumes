import { Module } from '@nestjs/common';
import { AccountingAccountsService } from './accounting-accounts.service';
import { AccountingAccountsController } from './accounting-accounts.controller';

@Module({
  controllers: [AccountingAccountsController],
  providers: [AccountingAccountsService],
})
export class AccountingAccountsModule {}
