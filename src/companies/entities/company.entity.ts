import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { AccountingAccount } from '../../accounting-accounts/entities/accounting-account.entity';
import { Segment } from 'src/segments/entities/segment.entity';

@Entity('companies')
export class Company {
  @PrimaryGeneratedColumn()
  company_id: number;

  @Column({ nullable: false })
  company_name: string;

  @Column({ nullable: false })
  rfc: string;

  @CreateDateColumn({
    type: 'timestamp',
  })
  created_at: string;

  @OneToMany(
    () => AccountingAccount,
    (accounting_account) => accounting_account.company,
  )
  accounting_accounts: AccountingAccount[];

  @OneToMany(() => Segment, (segment) => segment.company)
  segments: Segment[];
}
