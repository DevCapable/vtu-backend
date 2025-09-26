import { BaseRepository } from '@app/core/base/base.repository';
import { Injectable } from '@nestjs/common';
import { Permission } from '../entities/permission.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { buildRelations } from '@app/core/util';
import { ExternalLinkOriginEnum } from '@app/iam/enum';

@Injectable()
export class PermissionRepository extends BaseRepository<Permission> {
  public relations = ['permissionGroup'];
  public fillable = [
    'roles',
    'action',
    'subject',
    'inverted',
    'conditions',
    'name',
    'reason',
    'permissionGroupId',
    'deletedAt',
    'uuid',
    'origin',
  ];

  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {
    super(permissionRepository);
  }

  async findAll(
    filterOptions: {
      sortKey?: string;
      sortDir?: 'ASC' | 'DESC';
      [key: string]: any;
    } = {},
    paginationOptions: { skip?: number; limit?: number } = {},
    user = null,
    permissionGroup = [],
    relations: string[] = [],
  ): Promise<[Permission[], number]> {
    const { sortKey, sortDir, special, type, origin } = filterOptions;
    const { skip, limit } = paginationOptions;

    const _type = type || user.account.type;
    const _special = parseInt(special, 10) || 0;
    const _origin = origin || ExternalLinkOriginEnum.NOGIC;

    const queryBuilder = this.repository.createQueryBuilder('entity');

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

    if (user && user.account && user.account.type) {
      const conditions: string[] = [];

      if (permissionGroup.length > 0) {
        for (let i = 0; i < permissionGroup.length; i++) {
          conditions.push(`permissionGroup.slug = :slug${i}`);
        }
      }

      const fullCondition = `(permissionGroup.type = :type${
        conditions.length > 0 ? ` OR ${conditions.join(' OR ')}` : ''
      })`;

      queryBuilder.andWhere(fullCondition, {
        type: _type,
        ...permissionGroup.reduce(
          (acc, slug, i) => ({ ...acc, [`slug${i}`]: slug }),
          {},
        ),
      });
    }

    queryBuilder.andWhere('entity.isSpecial = :isSpecial', {
      isSpecial: _special,
    });

    queryBuilder.andWhere('entity.origin = :origin', {
      origin: _origin,
    });

    return queryBuilder.getManyAndCount();
  }
}
