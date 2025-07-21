import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Concept } from './entities/concept.entity';
import { CreateConceptDto } from './dto/create-concept.dto';
import { UpdateConceptDto } from './dto/update-concept.dto';
import { GetConceptQueryDto } from './dto/get-concept-query.dto';

@Injectable()
export class ConceptsService {
  constructor(
    @InjectRepository(Concept)
    private readonly conceptRepo: Repository<Concept>,
  ) {}

  /**
   * Crear un nuevo concepto
   */
  async create(dto: CreateConceptDto): Promise<Concept> {
    const exists = await this.conceptRepo.findOne({
      where: {
        name: dto.name,
        company_id: dto.company_id,
      },
    });

    if (exists) {
      throw new BadRequestException(
        `Ya existe un concepto con el nombre '${dto.name}' para la empresa con ID ${dto.company_id}`,
      );
    }

    const concept = this.conceptRepo.create(dto);
    return this.conceptRepo.save(concept);
  }

  /**
   * Obtener todos los conceptos, opcionalmente filtrados por company_id
   */
  async findAll(query: GetConceptQueryDto): Promise<Concept[]> {
    const qb = this.conceptRepo.createQueryBuilder('concept');

    if (query.company_id) {
      qb.where('concept.company_id = :company_id', {
        company_id: query.company_id,
      });
    }

    return qb.getMany();
  }

  /**
   * Obtener un concepto por su ID
   */
  async findOne(concept_id: number): Promise<Concept> {
    const concept = await this.conceptRepo.findOne({ where: { concept_id } });
    if (!concept) {
      throw new NotFoundException(
        `Concepto con ID ${concept_id} no encontrado`,
      );
    }
    return concept;
  }

  /**
   * Actualizar un concepto
   */
  async update(concept_id: number, dto: UpdateConceptDto): Promise<Concept> {
    const concept = await this.findOne(concept_id);

    // Verificar que pertenece a la empresa indicada
    if (concept.company_id !== dto.company_id) {
      throw new BadRequestException(
        `El concepto no pertenece a la empresa con ID ${dto.company_id}`,
      );
    }

    // Verificar que el nuevo nombre no se repita en esa empresa (excluyendo el actual)
    const duplicate = await this.conceptRepo.findOne({
      where: {
        name: dto.name,
        company_id: dto.company_id,
      },
    });

    if (duplicate && duplicate.concept_id !== concept_id) {
      throw new BadRequestException(
        `Ya existe otro concepto con el nombre '${dto.name}' para la empresa con ID ${dto.company_id}`,
      );
    }

    concept.name = dto.name;

    return this.conceptRepo.save(concept);
  }

  /**
   * Eliminar un concepto
   */
  async remove(concept_id: number): Promise<void> {
    const concept = await this.findOne(concept_id);
    await this.conceptRepo.remove(concept);
  }
}
