import { BaseRecord } from './entities/base-record.entity';
import { Injectable } from '@nestjs/common';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { buildFillable } from '../core/util';
import { BaseRepository } from '@app/core/base/base.repository';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class BaseRecordRepository extends BaseRepository<BaseRecord> {
  public searchable = ['name'];

  constructor(
    @InjectRepository(BaseRecord)
    private readonly baseRecordRepository: Repository<BaseRecord>,
  ) {
    super(baseRecordRepository);
  }

  _findAll(
    queryBuilder: SelectQueryBuilder<BaseRecord>,
    options: Record<string, any>,
  ): SelectQueryBuilder<BaseRecord> {
    if (options.type) {
      if (Array.isArray(options.type)) {
        queryBuilder.andWhere('entity.type IN (:...types)', {
          types: options.type,
        });
      } else {
        queryBuilder.andWhere('entity.type = :type', { type: options.type });
      }
    }

    if (options.parentId) {
      queryBuilder.andWhere('entity.parentId = :parentId', {
        parentId: parseInt(options.parentId),
      });
    }

    if (options.id) {
      queryBuilder.andWhere('entity.id = :id', { id: parseInt(options.id) });
    }

    // queryBuilder.leftJoinAndSelect('entity.parent', 'parent');

    return queryBuilder;
  }

  async findOrCreate(data: any): Promise<BaseRecord> {
    const existingRecord = await this.baseRecordRepository.findOne({
      where: {
        name: data.name,
        type: data.type,
      },
    });

    if (existingRecord) {
      return existingRecord;
    }

    const newRecord = this.baseRecordRepository.create(
      buildFillable({ ...data, uuid: uuidv4() }, this.fillable),
    );

    const entity = (await this.baseRecordRepository.save(newRecord)) as any;

    return this.findOne(entity.id);
  }
}
