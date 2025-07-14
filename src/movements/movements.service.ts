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

@Injectable()
export class MovementsService {
  constructor(
    @InjectRepository(Movement)
    private readonly repo: Repository<Movement>,
    @InjectRepository(Segment)
    private readonly segmentsRepo: Repository<Segment>,
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
    const movement = this.repo.create(dto);
    return this.repo.save(movement);
  }

  findAll() {
    return this.repo.find();
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
