import { Module } from '@nestjs/common';
import { MovementsService } from './movements.service';
import { MovementsController } from './movements.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movement } from './entities/movement.entity';
import { Segment } from 'src/segments/entities/segment.entity';
import { AccountingAccount } from 'src/accounting-accounts/entities/accounting-account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Movement, Segment, AccountingAccount])],
  controllers: [MovementsController],
  providers: [MovementsService],
  exports: [MovementsService],
})
export class MovementsModule {}
