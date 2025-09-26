import { In, ObjectLiteral, Repository } from 'typeorm';
import { buildFillable, buildRelationsObj, newbuildSearchQuery } from '../util';

export abstract class BaseRepository<T extends ObjectLiteral> {
  public fillable: string[] = [];
  public searchable: string[] = [];
  public relations: string[] = [];

  protected constructor(repository: Repository<T>) {
    this._repository = repository;
  }

  private _repository: Repository<T>;

  get repository(): Repository<T> {
    return this._repository;
  }

  async create(entity): Promise<any> {
    const newEntity = this.repository.create(entity);
    return this.repository.save(newEntity);
  }

  async save(entity): Promise<T> {
    const savedEntity = await this.repository.save(entity);
    return savedEntity;
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
    const queryOptions = {};
    const { sortKey, sortDir, ...searchOptions } = filterOptions || {};
    const { skip, limit } = paginationOptions || {};
    relations = relations.length ? relations : this.relations;

    if (limit) {
      queryOptions['take'] = Number(limit);
    }

    if (skip) {
      queryOptions['skip'] = Number(skip);
    }

    if (sortKey) {
      queryOptions['order'] = {
        [sortKey]: sortDir ? sortDir : 'ASC',
      };
    }

    queryOptions['relations'] = buildRelationsObj(relations);

    const buildWhere = newbuildSearchQuery(searchOptions, this.searchable);

    if (searchOptions) {
      queryOptions['where'] = buildWhere;
    }

    return await Promise.all([
      this.repository.find(queryOptions),
      this.repository.count(queryOptions),
    ]);
  }

  async findFirst(where, relations: string[] = []) {
    relations = relations.length ? relations : this.relations;
    let options = {};

    options['where'] = where;
    if (relations.length) {
      options = { ...options, relations: buildRelationsObj(relations) };
    }

    return this.repository.findOne(options);
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

  async findBySlug(slug: string, relations: string[] = []) {
    relations = relations.length ? relations : this.relations;
    let options = {};

    options['where'] = { slug };
    if (relations.length) {
      options = {
        ...options,
        relations: buildRelationsObj(relations),
      };
    }

    return await this.repository.findOne(options);
  }

  async findAllBy(where, relations: string[] = []) {
    relations = relations.length ? relations : this.relations;
    let options = {};

    options['where'] = where;
    if (relations.length) {
      options = {
        ...options,
        relations: buildRelationsObj(relations),
      };
    }

    return await this.repository.find(options);
  }

  async findAllByIn(whereField, array = [], relation = []) {
    const options = {};

    options['where'] = {
      [whereField]: In(array),
    };

    if (relation.length) {
      options['relation'] = buildRelationsObj(relation);
    }

    return this.repository.find(options);
  }

  async update(id: number, data: any): Promise<T | null> {
    const payload = buildFillable(data, this.fillable);
    await this.repository.update(id, payload);
    return this.findFirst(id);
  }

  async delete(id: number | string) {
    return this.repository.delete(id);
  }

  async count(where): Promise<number> {
    return this.repository.count({
      where: {
        ...where,
      },
    });
  }

  async countApproved() {
    let option;
    option['where'] = {
      status: 'APPROVED',
    };
    return this.repository.count(option);
  }
}
