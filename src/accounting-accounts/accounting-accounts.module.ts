import { Module } from '@nestjs/common';
import { AccountingAccountsService } from './accounting-accounts.service';
import { AccountingAccountsController } from './accounting-accounts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from 'src/companies/entities/company.entity';
import { AccountingAccount } from './entities/accounting-account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Company, AccountingAccount])],
  controllers: [AccountingAccountsController],
  providers: [AccountingAccountsService],
  exports: [AccountingAccountsService],
})
export class AccountingAccountsModule {}
