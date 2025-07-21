import { Module } from '@nestjs/common';
import { ConceptsService } from './concepts.service';
import { ConceptsController } from './concepts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Concept } from './entities/concept.entity';
import { Company } from 'src/companies/entities/company.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Concept, Company])],
  controllers: [ConceptsController],
  providers: [ConceptsService],
})
export class ConceptsModule {}
