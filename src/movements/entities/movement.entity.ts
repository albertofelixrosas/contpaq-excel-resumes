import { AccountingAccount } from 'src/accounting-accounts/entities/accounting-account.entity';
import { Segment } from '../../segments/entities/segment.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';

@Entity('movements')
export class Movement {
  @PrimaryGeneratedColumn()
  movement_id: number;

  @Column()
  segment_id: number;

  @Column()
  accounting_account_id: number;

  @Column({ type: 'date' })
  date: Date;

  @Column()
  number: number;

  @Column()
  supplier: string;

  @Column()
  concept: string;

  @Column()
  reference: string;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true })
  charge: number | null;

  @CreateDateColumn({
    type: 'timestamp',
  })
  imported_at: string;

  @ManyToOne(() => Segment, (segment) => segment.movements, {
    cascade: true,
  })
  @JoinColumn({ name: 'segment_id' })
  segment: Segment;

  @ManyToOne(() => AccountingAccount)
  @JoinColumn({ name: 'accounting_account_id' })
  accounting_account: AccountingAccount;
}
