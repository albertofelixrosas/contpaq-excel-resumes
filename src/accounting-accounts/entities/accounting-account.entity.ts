import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { Company } from '../../companies/entities/company.entity';
import { Segment } from 'src/segments/entities/segment.entity';
import { Movement } from 'src/movements/entities/movement.entity';

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

  @ManyToMany(() => Segment, (segment) => segment.accounting_accounts)
  segments: Segment[];

  @OneToMany(() => Movement, (m) => m.accounting_account)
  movements: Movement[];
}
