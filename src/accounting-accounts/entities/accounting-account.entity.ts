import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Company } from '../../companies/entities/company.entity';

@Entity('accounting_accounts')
export class AccountingAccount {
  @PrimaryGeneratedColumn()
  accounting_account_id: number;

  @Column()
  company_id: number;

  @Column()
  acount_code: string;

  @Column()
  name: string;

  @ManyToOne(() => Company, (company) => company.accounting_accounts, {
    cascade: true,
  })
  company: Company;
}
