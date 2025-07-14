import { Segment } from '../../segments/entities/segment.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('movements')
export class Movement {
  @PrimaryGeneratedColumn()
  movement_id: number;

  @Column()
  acount_id: number;

  @Column({ type: 'date' })
  date: Date;

  @Column()
  number: number;

  @Column()
  concept: string;

  @Column()
  reference: string;

  @Column()
  charge: number;

  @CreateDateColumn({
    type: 'timestamp',
  })
  imported_at: string;

  @ManyToOne(() => Segment, (segment) => segment.movements, {
    cascade: true,
  })
  segment: Segment;
}
