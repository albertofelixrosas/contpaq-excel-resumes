import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSegmentDto } from './dto/create-segment.dto';
import { UpdateSegmentDto } from './dto/update-segment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Segment } from './entities/segment.entity';
import { GetSegmentsQueryDto } from './dto/get-segment-query.dto';
import { Company } from 'src/companies/entities/company.entity';

@Injectable()
export class SegmentsService {
  constructor(
    @InjectRepository(Segment)
    private readonly repo: Repository<Segment>,
    @InjectRepository(Company)
    private readonly companiesRepo: Repository<Company>,
  ) {}

  async create(dto: CreateSegmentDto) {
    const company = await this.companiesRepo.findOneBy({
      company_id: dto.company_id,
    });

    if (!company) {
      throw new BadRequestException(
        `No existe ninguna empresa con el id "${dto.company_id}"`,
      );
    }

    const segment = this.repo.create(dto);
    return this.repo.save(segment);
  }

  findAll(query: GetSegmentsQueryDto) {
    const qb = this.repo.createQueryBuilder('segment');

    if (query.company_id) {
      qb.innerJoin('segment.company', 'company').andWhere(
        'company.company_id = :company_id',
        {
          company_id: query.company_id,
        },
      );
    }

    return qb.getMany();
  }

  async findOne(id: number) {
    const segment = await this.repo.findOneBy({
      segment_id: id,
    });
    if (!segment) {
      throw new NotFoundException(
        `No se encontro un segmento con el id "${id}"`,
      );
    }
    return segment;
  }

  async findOrCreateByCode(companyId: number, code: string): Promise<Segment> {
    let segment = await this.repo.findOneBy({
      company_id: companyId,
      code,
    });

    if (!segment) {
      const dto: CreateSegmentDto = {
        company_id: companyId,
        code,
      };

      segment = await this.create(dto);
      return this.repo.save(segment);
    }

    return segment;
  }

  async update(id: number, dto: UpdateSegmentDto) {
    const segment = await this.repo.findOneBy({
      segment_id: id,
    });
    if (!segment) {
      throw new BadRequestException(
        `No existe ningun segmento con el id "${id}"`,
      );
    }

    const company = await this.companiesRepo.findOneBy({
      company_id: dto.company_id,
    });

    if (!company) {
      throw new BadRequestException(
        `No existe ninguna empresa con el id "${dto.company_id}"`,
      );
    }

    const updatedSegment = this.repo.merge(segment, dto);
    return this.repo.save(updatedSegment);
  }

  async remove(id: number) {
    const segment = await this.repo.findOneBy({
      segment_id: id,
    });
    if (!segment) {
      throw new NotFoundException(
        `No se encontro un segmento con el id "${id}"`,
      );
    }
    return this.repo.delete(id);
  }
}
