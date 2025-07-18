import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Movement } from '../../movements/entities/movement.entity';
import { Company } from 'src/companies/entities/company.entity';
import { AccountingAccount } from 'src/accounting-accounts/entities/accounting-account.entity';

@Entity('segments')
export class Segment {
  @PrimaryGeneratedColumn()
  segment_id: number;

  @Column()
  company_id: number;

  @Column({ nullable: false })
  code: string;

  @Column({ nullable: true })
  name: string;

  @CreateDateColumn({
    type: 'date',
  })
  date: string;

  @Column({ nullable: true })
  farm_name: string;

  @ManyToOne(() => Company, (company) => company.segments)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @OneToMany(() => Movement, (movement) => movement.segment)
  movements: Movement[];

  @ManyToMany(() => AccountingAccount, (aa) => aa.segments)
  @JoinTable({
    name: 'accounting_accounts_segments', // tabla intermedia
    joinColumn: { name: 'segment_id', referencedColumnName: 'segment_id' },
    inverseJoinColumn: {
      name: 'accounting_account_id',
      referencedColumnName: 'accounting_account_id',
    },
  })
  accounting_accounts: AccountingAccount[];
}
