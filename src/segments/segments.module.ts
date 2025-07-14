import { Module } from '@nestjs/common';
import { SegmentsService } from './segments.service';
import { SegmentsController } from './segments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Segment } from './entities/segment.entity';
import { AccountingAccount } from 'src/accounting-accounts/entities/accounting-account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Segment, AccountingAccount])],
  controllers: [SegmentsController],
  providers: [SegmentsService],
  exports: [SegmentsService],
})
export class SegmentsModule {}
