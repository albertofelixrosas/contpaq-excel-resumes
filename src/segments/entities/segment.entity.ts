import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Movement } from '../../movements/entities/movement.entity';

@Entity('segments')
export class Segment {
  @PrimaryGeneratedColumn()
  segment_id: number;

  @Column({ nullable: false })
  code: string;

  @Column({ nullable: true })
  name: string;

  @Column({ type: 'date', nullable: true })
  date: string;

  @Column({ nullable: true })
  farm_name: string;

  @OneToMany(() => Movement, (movement) => movement.segment)
  movements: Movement[];
}
