import { Module } from '@nestjs/common';
import { MovementsService } from './movements.service';
import { MovementsController } from './movements.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movement } from './entities/movement.entity';
import { Segment } from 'src/segments/entities/segment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Movement, Segment])],
  controllers: [MovementsController],
  providers: [MovementsService],
})
export class MovementsModule {}
