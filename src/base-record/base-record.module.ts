import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BaseRecord } from './entities/base-record.entity';
import { BaseRecordController } from './base-record.controller';
import { BaseRecordService } from './base-record.service';
import { BaseRecordRepository } from './base-record.repository';

@Module({
  imports: [TypeOrmModule.forFeature([BaseRecord])],
  controllers: [BaseRecordController],
  providers: [BaseRecordService, BaseRecordRepository],
  exports: [BaseRecordService, BaseRecordRepository],
})
export class BaseRecordModule {}
