import { DeepPartial } from 'typeorm';
import { BaseRepository } from './new-base.repository';

export abstract class BaseService<T> {
  constructor(private readonly baseRepository: BaseRepository<T>) {}

  async findOne(id: number): Promise<T> {
    return this.baseRepository.findById(id);
  }

  async findAll(
    filterOptions: {
      sortKey?: string;
      sortDir?: 'ASC' | 'DESC';
      [key: string]: any;
    } = {},
    paginationOptions: { skip?: number; limit?: number } = {},
    relations: string[] = [],
  ) {
    const [data, totalCount] = await this.baseRepository.findAll(
      filterOptions,
      paginationOptions,
      relations,
    );

    return { data, totalCount };
  }

  async create(entity: DeepPartial<T>) {
    return this.baseRepository.create(entity);
  }

  update(id, entity: T): Promise<T> {
    return this.baseRepository.update(id, entity);
  }

  delete(id: number) {
    return this.baseRepository.delete(id);
  }
}
