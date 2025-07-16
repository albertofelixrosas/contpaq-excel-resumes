import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Movement } from '../../movements/entities/movement.entity';
import { AccountingAccount } from 'src/accounting-accounts/entities/accounting-account.entity';

@Entity('segments')
export class Segment {
  @PrimaryGeneratedColumn()
  segment_id: number;

  @Column()
  accounting_account_id: number;

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

  @ManyToOne(() => AccountingAccount, (aa) => aa.segments)
  @JoinColumn({ name: 'accounting_account_id' })
  accounting_account: AccountingAccount;

  @OneToMany(() => Movement, (movement) => movement.segment)
  movements: Movement[];
}
