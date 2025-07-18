import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMovementDto } from './dto/create-movement.dto';
import { UpdateMovementDto } from './dto/update-movement.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Segment } from 'src/segments/entities/segment.entity';
import { Repository } from 'typeorm';
import { Movement } from './entities/movement.entity';
import { MovementFilterDto } from './dto/movement-filter.dto';
import { PaginatedMovementsDto } from './dto/paginated-movements.dto';
import { MovementReportDto } from './dto/movement-report.dto';
import { AccountingAccount } from 'src/accounting-accounts/entities/accounting-account.entity';

@Injectable()
export class MovementsService {
  constructor(
    @InjectRepository(Movement)
    private readonly repo: Repository<Movement>,
    @InjectRepository(Segment)
    private readonly segmentsRepo: Repository<Segment>,
    @InjectRepository(AccountingAccount)
    private readonly accountsRepo: Repository<AccountingAccount>,
  ) {}

  async create(dto: CreateMovementDto) {
    const segment = await this.segmentsRepo.findOneBy({
      segment_id: dto.segment_id,
    });
    if (!segment) {
      throw new BadRequestException(
        `No existe ningun segmento con el id "${dto.segment_id}"`,
      );
    }
    const account = await this.accountsRepo.findOneBy({
      accounting_account_id: dto.accounting_account_id,
    });
    if (!account) {
      throw new BadRequestException(
        `No existe ninguna cuenta contable con el id "${dto.accounting_account_id}"`,
      );
    }
    const movement = this.repo.create(dto);
    return this.repo.save(movement);
  }

  findAll() {
    return this.repo.find();
  }

  async getMovements(
    filter: MovementFilterDto,
  ): Promise<PaginatedMovementsDto> {
    const {
      company_id,
      accounting_account_id,
      segment_id,
      concept,
      supplier,
      start_date,
      end_date,
      page,
      limit,
    } = filter;

    const qb = this.repo
      .createQueryBuilder('m')
      .innerJoin('m.segment', 's')
      .innerJoin('m.accounting_account', 'aa')
      .innerJoin('aa.company', 'c')
      .select([
        'm.movement_id AS movement_id',
        'c.company_name AS company_name',
        'aa.acount_code AS acount_code',
        'aa.name AS account_name',
        's.code AS segment_code',
        'm.date AS date',
        'm.number AS number',
        'm.supplier AS supplier',
        'm.concept AS concept',
        'm.reference AS reference',
        'm.charge AS charge',
      ]);

    qb.andWhere('m.date BETWEEN :start_date AND :end_date', {
      start_date,
      end_date,
    });

    if (company_id) {
      qb.andWhere('c.company_id = :company_id', { company_id });
    }

    if (accounting_account_id) {
      qb.andWhere('aa.accounting_account_id = :accounting_account_id', {
        accounting_account_id,
      });
    }

    if (segment_id) {
      qb.andWhere('s.segment_id = :segment_id', { segment_id });
    }

    if (concept) {
      qb.andWhere('m.concept = :concept', { concept });
    }

    if (supplier) {
      qb.andWhere('m.supplier = :supplier', { supplier });
    }

    qb.orderBy('m.date', 'ASC')
      .offset((page - 1) * limit)
      .limit(limit);

    const [data, total] = await Promise.all([
      qb.getRawMany<MovementReportDto>(),
      qb.getCount(),
    ]);

    return {
      data,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    };
  }

  async getDistinctSuppliers(companyId: number): Promise<string[]> {
    const result: { supplier: string }[] = await this.repo
      .createQueryBuilder('m')
      .innerJoin('m.segment', 's')
      .where('m.supplier IS NOT NULL')
      .andWhere('s.company_id = :companyId', { companyId })
      .select('DISTINCT m.supplier', 'supplier')
      .orderBy('m.supplier', 'ASC')
      .getRawMany();

    return result.map((r) => r.supplier);
  }

  async countMovementsByDate(companyId: number) {
    const qb = this.repo
      .createQueryBuilder('m')
      .innerJoin('m.segment', 's')
      .innerJoin('m.accounting_account', 'aa')
      .innerJoin('aa.company', 'c')
      .where('c.company_id = :companyId', { companyId })
      .select(['m.date AS date', 'COUNT(m.movement_id) AS count'])
      .groupBy('m.date')
      .orderBy('m.date', 'ASC');

    const result = await qb.getRawMany<{ date: string; count: string }>();
    return result.map((r) => ({
      date: r.date,
      count: Number(r.count),
    }));
  }

  async findOne(id: number) {
    const movement = await this.repo.findOneBy({
      movement_id: id,
    });
    if (!movement) {
      throw new NotFoundException(
        `No se encontro un movimiento con el id "${id}"`,
      );
    }
    return movement;
  }

  async update(id: number, dto: UpdateMovementDto) {
    const movement = await this.repo.findOneBy({
      movement_id: id,
    });
    if (!movement) {
      throw new BadRequestException(
        `No existe ningun movimiento con el id "${id}"`,
      );
    }

    const segment = await this.segmentsRepo.findOneBy({
      segment_id: dto.segment_id,
    });
    if (!segment) {
      throw new BadRequestException(
        `No existe ningun segmento con el id "${dto.segment_id}"`,
      );
    }

    // Aplicar los cambios al movimiento existente
    const updatedMovement = this.repo.merge(movement, dto);
    return this.repo.save(updatedMovement);
  }

  async remove(id: number) {
    const movement = await this.repo.findOneBy({
      movement_id: id,
    });
    if (!movement) {
      throw new NotFoundException(
        `No se encontro un movimiento con el id "${id}"`,
      );
    }
    return this.repo.delete(id);
  }
}
