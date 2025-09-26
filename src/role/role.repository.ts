import { BaseRepository } from '@app/core/base/base.repository';
import { Injectable } from '@nestjs/common';
import { Role } from './entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, EntityManager, In, Repository } from 'typeorm';
import { buildRelations, buildSearchQueryBuilder } from '@app/core/util';
import { AccountTypeEnum } from '@app/account/enums';
import { Permission } from '@app/permission/entities/permission.entity';
import { RolesEnum } from './enums';
// import { LoggerService } from '@app/logger';
// import { User } from '@app/user/entities/user.entity';
import { CurrentUserData } from '@app/iam/interfaces';
import { User } from '@app/users/entities/user.entity';

@Injectable()
export class RoleRepository extends BaseRepository<Role> {
  public fillable = [
    'name',
    'description',
    'accountId',
    'permissions',
    'users',
    'uuid',
    'origin',
    'special',
  ];

  public relations = ['permissions'];

  public searchable = ['name', 'origin'];

  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly entityManager: EntityManager,
    // private readonly loggerService: LoggerService,
  ) {
    super(roleRepository);
  }

  async create(data: DeepPartial<Role>): Promise<any> {
    const newEntity = await this._prepareEntity(data);
    return this.roleRepository.save(newEntity);
  }

  async update(id: number, data: DeepPartial<Role>): Promise<Role | null> {
    const entity = await this._prepareEntity(data, id);

    await this.roleRepository.save(entity);

    return this.findOne(id);
  }

  async _prepareEntity(data: any, id: number | null = null) {
    let permissions: Permission[] = [];

    if (data.permissions) {
      permissions = await this.entityManager.findBy(Permission, {
        id: In(data.permissions),
      });
    }

    const payload: any = {
      ...data,
      ...(permissions.length ? { permissions } : {}),
    };

    if (id) {
      payload.id = id;
    }

    return this.roleRepository.create(payload);
  }

  async findAll(
    filterOptions: {
      sortKey?: string;
      sortDir?: 'ASC' | 'DESC';
      [key: string]: any;
    } = {},
    paginationOptions: { skip?: number; limit?: number } = {},
    user: any = null,
    relations: string[] = [],
  ): Promise<[Role[], number]> {
    const { sortKey, sortDir, ...searchOptions } = filterOptions;
    const { skip, limit } = paginationOptions;

    const queryBuilder = this.repository.createQueryBuilder('entity');

    buildRelations(queryBuilder, relations);

    if (limit) queryBuilder.take(limit);

    if (skip) queryBuilder.skip(skip);

    if (sortKey) queryBuilder.orderBy(`entity.${sortKey}`, sortDir || 'ASC');

    buildSearchQueryBuilder(searchOptions, this.searchable, queryBuilder);

    queryBuilder.loadRelationCountAndMap('entity.userCount', 'entity.users');

    if (user?.account?.type !== AccountTypeEnum.ADMIN) {
      queryBuilder.orWhere('entity.slug = :slug', {
        slug: RolesEnum.SUPER_ADMIN,
      });
    }

    const [entities, totalCount] = await queryBuilder.getManyAndCount();

    const transformedEntities = await Promise.all(
      entities.map(async (entity) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
        if (entity.slug == RolesEnum.SUPER_ADMIN) {
          const superAdminUserCount = await this.getSuperAdminUserCount(user);
          return {
            ...entity,
            userCount: superAdminUserCount,
          };
        }

        return entity;
      }),
    );

    return [transformedEntities, totalCount];
  }

  async findAllByAccount(
    filterOptions: {
      sortKey?: string;
      sortDir?: 'ASC' | 'DESC';
      [key: string]: any;
    } = {},
    paginationOptions: { skip?: number; limit?: number } = {},
    user = null,
    relations: string[] = [],
  ) {
    const { sortKey, sortDir, account, search, ...searchOptions } =
      filterOptions;
    const { skip, limit } = paginationOptions;

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

    // buildSearchQueryBuilder(searchOptions, this.searchable, queryBuilder);
    const buildWhere = {};
    buildWhere['accountId'] = account ? +account : null;

    // Dynamically add WHERE conditions based on buildWhere
    Object.entries(buildWhere).forEach(([key, value]) => {
      if (value === null) {
        queryBuilder.andWhere(`entity.${key} IS NULL`);
      } else {
        queryBuilder.andWhere(`entity.${key} = :${key}`, { [key]: value });
      }
    });

    if (search) {
      queryBuilder.where(`entity.name LIKE :name`, {
        name: search,
      });
    }

    // Execute the query and fetch the results
    try {
      let entities: any[];
      let totalCount: number;

      if (account) {
        const defaultRole = await this.repository
          .createQueryBuilder('entity')
          .where({ slug: RolesEnum.SUPER_ADMIN })
          .getOne();

        const [normalObjects, normalCount] = await Promise.all([
          queryBuilder.getMany(),
          queryBuilder.getCount(),
        ]);

        entities = [defaultRole, ...normalObjects];
        totalCount = normalCount + 1;
      } else {
        [entities, totalCount] = await queryBuilder.getManyAndCount();
      }

      return [entities, totalCount];
    } catch (error) {
      // this.loggerService.error('Error executing SQL query:', error);
      throw error;
    }
  }

  async findAllUsers(
    filterOptions: {
      sortKey?: string;
      sortDir?: 'ASC' | 'DESC';
      [key: string]: any;
    } = {},
    paginationOptions: { skip?: number; limit?: number } = {},
    roleId: number,
    currentUser: CurrentUserData,
  ): Promise<[User[], number]> {
    const { sortKey, sortDir } = filterOptions;
    const { skip, limit } = paginationOptions;

    const queryBuilder = this.entityManager
      .getRepository(User)
      .createQueryBuilder('entity')
      .leftJoinAndSelect('entity.roles', 'role')
      .where('role.id = :roleId', { roleId });

    if (currentUser?.account?.type === AccountTypeEnum.ADMIN) {
      queryBuilder.innerJoin(
        'entity.accounts',
        'account',
        'account.type = :accountType',
        {
          accountType: 'ADMIN',
        },
      );
    } else {
      queryBuilder.innerJoin(
        'entity.accounts',
        'account',
        'account.id = :accountId',
        {
          accountId: currentUser.account.id,
        },
      );
    }

    if (limit) queryBuilder.take(limit);

    if (skip) queryBuilder.skip(skip);

    if (sortKey) queryBuilder.orderBy(`entity.${sortKey}`, sortDir || 'ASC');

    // Execute the query
    const [users, totalCount] = await queryBuilder.getManyAndCount();

    return [users, totalCount];
  }

  async getSuperAdminUserCount(user: CurrentUserData | null): Promise<number> {
    let queryConditionFn = (qb) =>
      qb.innerJoin('users.accounts', 'account', 'account.id = :accountId', {
        accountId: user?.account?.id,
      });

    if (user?.account?.type === AccountTypeEnum.ADMIN) {
      queryConditionFn = (qb) =>
        qb.innerJoin(
          'users.accounts',
          'account',
          'account.type = :accountType',
          {
            accountType: AccountTypeEnum.ADMIN,
          },
        );
    }

    const role = await this.repository
      .createQueryBuilder('entity')
      .loadRelationCountAndMap(
        'entity.userCount',
        'entity.users',
        'users',
        queryConditionFn,
      )
      .where({ slug: RolesEnum.SUPER_ADMIN })
      .getOne();

    if (role) return role.userCount;
    return 0;
  }
}
