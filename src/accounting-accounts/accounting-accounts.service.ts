import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAccountingAccountDto } from './dto/create-accounting-account.dto';
import { UpdateAccountingAccountDto } from './dto/update-accounting-account.dto';
import { AccountingAccount } from './entities/accounting-account.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from 'src/companies/entities/company.entity';

@Injectable()
export class AccountingAccountsService {
  constructor(
    @InjectRepository(AccountingAccount)
    private readonly repo: Repository<AccountingAccount>,
    @InjectRepository(Company)
    private readonly companiesRepo: Repository<Company>,
  ) {}

  async create(dto: CreateAccountingAccountDto) {
    const company = await this.companiesRepo.findOneBy({
      company_id: dto.company_id,
    });

    if (!company) {
      throw new BadRequestException(
        `No existe ninguna empresa con el id "${dto.company_id}"`,
      );
    }

    const accountingAccount = this.repo.create(dto);
    return this.repo.save(accountingAccount);
  }

  findAll() {
    return this.repo.find();
  }

  async findOne(id: number) {
    const accountingAccount = await this.repo.findOneBy({
      accounting_account_id: id,
    });
    if (!accountingAccount) {
      throw new NotFoundException(
        `No se encontro una cuenta contable con el id "${id}"`,
      );
    }
    return accountingAccount;
  }

  async findOrCreateByCodeAndName(
    companyId: number,
    code: string,
    name: string,
  ): Promise<AccountingAccount> {
    let account = await this.repo.findOneBy({
      acount_code: code,
      company_id: companyId,
    });

    if (!account) {
      const dto: CreateAccountingAccountDto = {
        company_id: companyId,
        name,
        acount_code: code,
      };

      account = await this.create(dto);
      return this.repo.save(account);
    }

    return account;
  }

  async update(id: number, dto: UpdateAccountingAccountDto) {
    const accountingAccount = await this.repo.findOneBy({
      accounting_account_id: id,
    });

    if (!accountingAccount) {
      throw new BadRequestException(
        `No existe ninguna cuenta contable con el id "${id}"`,
      );
    }

    const company = await this.companiesRepo.findOneBy({
      company_id: dto.company_id,
    });

    if (!company) {
      throw new BadRequestException(
        `No existe ninguna empresa con el id "${dto.company_id}"`,
      );
    }

    const updatedAccountingAccount = this.repo.merge(accountingAccount, dto);
    return this.repo.save(updatedAccountingAccount);
  }

  async remove(id: number) {
    const accountingAccount = await this.repo.findOneBy({
      accounting_account_id: id,
    });
    if (!accountingAccount) {
      throw new NotFoundException(
        `No se encontro una cuenta contable con el id "${id}"`,
      );
    }
    return this.repo.delete(id);
  }
}
