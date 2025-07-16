import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Company } from '../../companies/entities/company.entity';
import { Segment } from 'src/segments/entities/segment.entity';

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
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @OneToMany(() => Segment, (segment) => segment.accounting_account, {
    cascade: true,
  })
  segments: Segment[];
}
