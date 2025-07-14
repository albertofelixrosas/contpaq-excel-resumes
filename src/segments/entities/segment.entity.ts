import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Movement } from '../../movements/entities/movement.entity';

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

  @OneToMany(() => Movement, (movement) => movement.segment)
  movements: Movement[];
}
