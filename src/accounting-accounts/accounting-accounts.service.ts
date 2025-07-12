import { Injectable } from '@nestjs/common';
import { CreateAccountingAccountDto } from './dto/create-accounting-account.dto';
import { UpdateAccountingAccountDto } from './dto/update-accounting-account.dto';

@Injectable()
export class AccountingAccountsService {
  create(createAccountingAccountDto: CreateAccountingAccountDto) {
    return 'This action adds a new accountingAccount';
  }

  findAll() {
    return `This action returns all accountingAccounts`;
  }

  findOne(id: number) {
    return `This action returns a #${id} accountingAccount`;
  }

  update(id: number, updateAccountingAccountDto: UpdateAccountingAccountDto) {
    return `This action updates a #${id} accountingAccount`;
  }

  remove(id: number) {
    return `This action removes a #${id} accountingAccount`;
  }
}
