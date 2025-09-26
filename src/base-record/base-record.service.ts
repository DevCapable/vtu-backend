import { Injectable } from '@nestjs/common';
import { BaseRecordRepository } from './base-record.repository';
import { v4 as uuidv4 } from 'uuid';
import { CustomBadRequestException } from '@app/core/error';

@Injectable()
export class BaseRecordService {
  constructor(private readonly baseRecordRepository: BaseRecordRepository) {}
  async findAll(filterOptions, paginationOptions) {
    const [data, totalCount] = await this.baseRecordRepository.findAll(
      filterOptions,
      paginationOptions,
    );
    return { data, totalCount };
  }

  async findOrCreate(data): Promise<any> {
    if (data && data.name) {
      const baseRecordData = {
        ...data,
        name: data.name.toUpperCase(),
      };

      return this.baseRecordRepository.findOrCreate(baseRecordData);
    } else {
      throw new CustomBadRequestException(
        'Invalid data object or missing "name" property for find or create for base record',
      );
    }
  }

  async create(data) {
    const baseRecordData = {
      ...data,
      uuid: uuidv4(),
      name: data.name.toUpperCase(),
    };
    return this.baseRecordRepository.create(baseRecordData);
  }

  async findOne(id: number) {
    return this.baseRecordRepository.findById(id);
  }

  async update(id: number, data) {
    const baseRecordData = {
      ...data,
      name: data.name.toUpperCase(),
    };
    return this.baseRecordRepository.update(id, baseRecordData);
  }

  async delete(id: number) {
    return this.baseRecordRepository.delete(id);
  }
}
