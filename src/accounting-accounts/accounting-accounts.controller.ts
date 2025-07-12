import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AccountingAccountsService } from './accounting-accounts.service';
import { CreateAccountingAccountDto } from './dto/create-accounting-account.dto';
import { UpdateAccountingAccountDto } from './dto/update-accounting-account.dto';

@Controller('accounting-accounts')
export class AccountingAccountsController {
  constructor(private readonly accountingAccountsService: AccountingAccountsService) {}

  @Post()
  create(@Body() createAccountingAccountDto: CreateAccountingAccountDto) {
    return this.accountingAccountsService.create(createAccountingAccountDto);
  }

  @Get()
  findAll() {
    return this.accountingAccountsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.accountingAccountsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAccountingAccountDto: UpdateAccountingAccountDto) {
    return this.accountingAccountsService.update(+id, updateAccountingAccountDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.accountingAccountsService.remove(+id);
  }
}
