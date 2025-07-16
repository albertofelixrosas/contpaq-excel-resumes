import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSegmentDto } from './dto/create-segment.dto';
import { UpdateSegmentDto } from './dto/update-segment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountingAccount } from 'src/accounting-accounts/entities/accounting-account.entity';
import { Segment } from './entities/segment.entity';
import { GetSegmentsQueryDto } from './dto/get-segment-query.dto';

@Injectable()
export class SegmentsService {
  constructor(
    @InjectRepository(Segment)
    private readonly repo: Repository<Segment>,
    @InjectRepository(AccountingAccount)
    private readonly accountingAccountsRepo: Repository<AccountingAccount>,
  ) {}

  async create(dto: CreateSegmentDto) {
    const accountingAccount = await this.accountingAccountsRepo.findOneBy({
      accounting_account_id: dto.accounting_account_id,
    });

    if (!accountingAccount) {
      throw new BadRequestException(
        `No existe ninguna cuenta contable con el id "${dto.accounting_account_id}"`,
      );
    }

    const segment = this.repo.create(dto);
    return this.repo.save(segment);
  }

  findAll(query: GetSegmentsQueryDto) {
    const qb = this.repo.createQueryBuilder('segment');

    if (query.company_id) {
      qb.innerJoin('segment.accounting_account', 'account').andWhere(
        'account.company_id = :company_id',
        { company_id: query.company_id },
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

  async findOrCreateByCode(accountId: number, code: string): Promise<Segment> {
    let segment = await this.repo.findOneBy({
      accounting_account_id: accountId,
      code,
    });

    if (!segment) {
      const dto: CreateSegmentDto = {
        accounting_account_id: accountId,
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

    const accountingAccount = await this.accountingAccountsRepo.findOneBy({
      accounting_account_id: dto.accounting_account_id,
    });

    if (!accountingAccount) {
      throw new BadRequestException(
        `No existe ninguna cuenta contable con el id "${dto.accounting_account_id}"`,
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
