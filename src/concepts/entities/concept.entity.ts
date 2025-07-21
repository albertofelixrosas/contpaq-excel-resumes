import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Company } from '../../companies/entities/company.entity';

@Entity({ name: 'concepts' })
export class Concept {
  @PrimaryGeneratedColumn()
  concept_id: number;

  @Column()
  company_id: number;

  @Column()
  name: string;

  @ManyToOne(() => Company, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'company_id' })
  company: Company;
}
