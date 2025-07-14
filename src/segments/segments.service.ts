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

  findAll() {
    return this.repo.find();
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

  async update(id: number, dto: UpdateSegmentDto) {
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
