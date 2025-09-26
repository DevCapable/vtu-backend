import {
  DeepPartial,
  ObjectLiteral,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import {
  buildFillable,
  buildRelations,
  buildRelationsObj,
  buildSearchQueryBuilder,
} from '../util';

export abstract class BaseRepository<T extends ObjectLiteral> {
  public fillable: any[] = [];
  public searchable: string[] = [];
  public relations: string[] = [];

  protected constructor(repository: Repository<T>) {
    this._repository = repository;
  }

  private _repository: Repository<T>;

  protected get repository(): Repository<T> {
    return this._repository;
  }

  async create(entity: DeepPartial<T>): Promise<T> {
    const payload = buildFillable(entity, this.fillable);
    return this.save(payload);
  }

  async createRenewal(entity: DeepPartial<T>): Promise<any> {
    return this.create(entity);
  }

  async save(entity: T | DeepPartial<T>): Promise<T> {
    const newEntity = this.repository.create(entity);
    return this.repository.save(newEntity);
  }

  async findOne(id, relations: string[] = []): Promise<T | null> {
    relations = relations.length ? relations : this.relations;
    const queryBuilder: SelectQueryBuilder<T> =
      this.repository.createQueryBuilder('entity');
    if (typeof id === 'number') {
      queryBuilder.where('entity.id = :id', { id });
    } else if (typeof id === 'object') {
      Object.entries(id).forEach(([key, value]) => {
        queryBuilder.andWhere(`entity.${key} = :${key}`, { [key]: value });
      });
    }

    buildRelations(queryBuilder, relations);

    return queryBuilder.getOne();
  }

  async findById(id: number | string, relations: string[] = []) {
    relations = relations.length ? relations : this.relations;
    let options = {};

    options['where'] = { id };

    if (relations.length) {
      options = {
        ...options,
        relations: buildRelationsObj(relations),
      };
    }

    return await this.repository.findOne(options);
  }

  async findAllByIn(
    where: string,
    array: any[] = [],
    relations: string[] = [],
  ) {
    relations = relations.length ? relations : this.relations;
    let queryBuilder = this.repository.createQueryBuilder('entity');

    queryBuilder = queryBuilder.where(`entity.${where} IN (:...values)`, {
      values: array,
    });
    if (relations.length > 0) {
      buildRelations(queryBuilder, relations);
    }
    return queryBuilder.getMany();
  }

  async update(id: number, data: any): Promise<T | null> {
    const payload = buildFillable(data, this.fillable);
    await this.repository.update(id, payload);
    return this.findOne(id);
  }

  _findAll(
    queryBuilder: SelectQueryBuilder<T>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    options: Record<string, any>,
  ): SelectQueryBuilder<T> {
    return queryBuilder;
  }

  async findAll(
    filterOptions: {
      sortKey?: string;
      sortDir?: 'ASC' | 'DESC';
      [key: string]: any;
    } = {},
    paginationOptions: { skip?: number; limit?: number } = {},
    relations: string[] = [],
  ): Promise<[T[], number]> {
    const { sortKey, sortDir, ...searchOptions } = filterOptions;
    const { skip, limit } = paginationOptions;
    let queryBuilder = this.repository.createQueryBuilder('entity');

    // Use provided relations or fallback to default relations
    const usedRelations = relations.length ? relations : this.relations;

    // Dynamically add leftJoinAndSelect for each relation
    buildRelations(queryBuilder, usedRelations);

    if (limit) {
      queryBuilder.take(limit);
    }

    if (skip) {
      queryBuilder.skip(skip);
    }

    if (sortKey) {
      queryBuilder.orderBy(`entity.${sortKey}`, sortDir || 'ASC');
    }

    if (searchOptions.userId) {
      queryBuilder.andWhere('entity.userId = :userId', {
        userId: searchOptions.userId,
      });
    }

    // Search
    buildSearchQueryBuilder(searchOptions, this.searchable, queryBuilder);

    //  Add custom query builder
    queryBuilder = this._findAll(queryBuilder, filterOptions);

    // Execute the query and fetch the results
    const [data, totalCount] = await Promise.all([
      queryBuilder.getMany(),
      queryBuilder.getCount(),
    ]);
    return [data, totalCount];
  }

  async count(where): Promise<number> {
    return this.repository.count({
      where,
    });
  }

  async countBy(where): Promise<any> {
    const queryBuilder = this.repository.createQueryBuilder('entity');
    queryBuilder.where(where);
    return queryBuilder.getCount();
  }

  async findFirst(
    where: any,
    relations: string[] = [],
  ): Promise<T | undefined | null> {
    relations = relations.length ? relations : this.relations;
    const buildRelations = buildRelationsObj(relations);

    const entity = await this.repository.findOne({
      where,
      relations: buildRelations as any,
    });
    return entity;
  }

  async findFirstBy(
    where: any,
    relations: string[] = [],
  ): Promise<T | undefined | null> {
    relations = relations.length ? relations : this.relations;
    const buildRelations = buildRelationsObj(relations);
    const entity = await this.repository.findOne({
      where,
      relations: buildRelations as any,
    });
    return entity;
  }

  async findAllBy(
    where: any,
    relations: string[] = [],
    order: any = { createdAt: 'DESC' },
  ): Promise<T[]> {
    const entities = await this.repository.find({
      where,
      relations,
      order,
    });
    return entities;
  }

  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  async delete(id: number | string | any): Promise<T | null> {
    const queryBuilder = this.repository.createQueryBuilder('entity');
    const entity = queryBuilder.where('entity.id = :id', { id }).getOne();
    await this.repository.delete(id);
    return entity;
  }

  async deleteMultiple(id: { id: { in: number[] } }): Promise<T | null> {
    const queryBuilder = this.repository.createQueryBuilder('entity');
    queryBuilder.where('entity.id = :id', { id });
    await this.repository.delete(id as unknown as number);
    return queryBuilder.getOne();
  }

  async deleteMany(ids: number[] | string[]): Promise<any> {
    await this.repository.delete(ids);
  }

  async findWithoutApplication(
    accountId: number,
    requestIds?: number[],
  ): Promise<T[]> {
    const query = this.repository
      .createQueryBuilder('entity')
      .where('entity.applicationId IS NULL')
      .andWhere('entity.accountId = :accountId', {
        accountId,
      });

    if (requestIds && requestIds.length) {
      query.andWhere('entity.id IN (:...requestIds)', {
        requestIds,
      });
    }

    return query.getMany();
  }

  async getLatest(
    conditions: Record<string, any> = {},
    relations: string[] = [],
  ): Promise<T | null> {
    relations = relations.length ? relations : this.relations;

    const queryBuilder: SelectQueryBuilder<T> =
      this.repository.createQueryBuilder('entity');

    // Apply conditions
    Object.entries(conditions).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        // If the condition value is an array, use IN clause
        queryBuilder.andWhere(`entity.${key} IN (:...${key})`, {
          [key]: value,
        });
      } else {
        queryBuilder.andWhere(`entity.${key} = :${key}`, { [key]: value });
      }
    });

    // Order by createdAt descending to get the latest
    queryBuilder.orderBy('entity.createdAt', 'DESC');

    // Include relations
    buildRelations(queryBuilder, relations);

    return queryBuilder.getOne();
  }
}
