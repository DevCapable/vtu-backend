import { Injectable } from '@nestjs/common';
import { Document } from '../entities/document.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository, SelectQueryBuilder } from 'typeorm';
import { BaseRepository } from '@app/core/base/base.repository';
import { DocumentType } from '@app/document/enum/document.enum';

@Injectable()
export class DocumentRepository extends BaseRepository<Document> {
  public searchable = ['name'];
  public fillable = [
    'name',
    'slug',
    'type',
    'isRequired',
    'allowedFormats',
    'description',
    'uuid',
    'order',
  ];

  constructor(
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
  ) {
    super(documentRepository);
  }

  _findAll(
    queryBuilder: SelectQueryBuilder<Document>,
    options: Record<string, any>,
  ) {
    const { type, ids } = options;

    if (type) {
      queryBuilder.andWhere('entity.type = :type', { type: type });
    }

    if (ids) {
      const idArray = ids.split(',').map((id: string) => Number(id));
      queryBuilder.andWhere('entity.id IN (:...ids)', { ids: idArray });
    }

    return queryBuilder;
  }

  async findAllByType(
    type: DocumentType | DocumentType[],
  ): Promise<Document[] | undefined> {
    if (!Array.isArray(type)) type = [type];
    return this.documentRepository.find({
      where: {
        type: In(type),
      },
      order: {
        order: 'asc',
      },
    });
  }
}
