import { BaseRepository } from '@app/core/base/base.repository';
import {
  CustomInternalServerException,
  CustomNotFoundException,
} from '@app/core/error';
import { StringHelper } from '@app/core/helpers';
// import { LoggerService } from '@app/logger';
// import { ShareholderRepository } from '@app/shareholder/shareholder.repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, EntityManager, Repository } from 'typeorm';
import { camelCase } from 'typeorm/util/StringUtils';
import { v4 as uuidv4 } from 'uuid';
import {
  buildFillable,
  buildRelationsObj,
  buildSearchQueryBuilder,
  generateCryptoString,
  pick,
} from '../core/util';
import { accountTypeMapping } from './account-type.mapping';
import { Account } from './entities/account.entity';
import { Admin } from './entities/admin.entity';
import { Customer } from './entities/customer.entity';
import { AccountTypeEnum } from './enums';
import { generateCompetency } from './utils';

@Injectable()
export class AccountRepository extends BaseRepository<Account> {
  public searchable: string[] = ['type'];
  public relations: string[] = ['individual'];
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(Customer)
    private readonly individualRepository: Repository<Customer>,
    @InjectRepository(Admin)
    private readonly agencyRepository: Repository<Admin>,

    // private readonly loggerService: LoggerService,
  ) {
    super(accountRepository);
  }

  async create(data, entityManager?: EntityManager): Promise<any> {
    const nogicNumber = await generateCryptoString(12);

    const userData = {
      ...data,
      nogicNumber,
      type: data.accountType,
    };

    let account;
    new Date().getFullYear().toString().slice(-2);
    if (entityManager)
      switch (data.accountType) {
        case AccountTypeEnum.CUSTOMER: {
          account = await entityManager.save(Account, {
            ...userData,
            uuid: uuidv4(),
          });
          const currentYear = new Date().getFullYear();
          const competencyId = generateCompetency(userData.gender, currentYear);
          await entityManager.save(
            Customer,
            buildFillable(
              {
                ...userData,
                accountId: account.id,
                uuid: uuidv4(),
                competencyId,
              },
              accountTypeMapping.CUSTOMER.fillable,
            ),
          );
          break;
        }
        case AccountTypeEnum.ADMIN:
          account = await entityManager.save(Account, {
            ...userData,
            uuid: uuidv4(),
          });
          await entityManager.save(
            Admin,
            buildFillable(
              {
                ...userData,
                workflowGroups: userData.workflowGroups
                  ? StringHelper.stringify(userData.workflowGroups)
                  : '',
                accountId: account.id,
                uuid: uuidv4(),
              },
              accountTypeMapping.ADMIN.fillable,
            ),
          );
          break;
      }
    return account;
  }

  async findAll(filterOptions, paginationOptions): Promise<any> {
    const { sortKey, sortDir, type, ids, active, ...searchOptions } =
      filterOptions;
    const { skip, limit } = paginationOptions;
    const types = type.split(',');
    const searchableFields = new Set<string>();

    for (const validType of types) {
      const mapping =
        accountTypeMapping[validType as keyof typeof AccountTypeEnum];
      if (mapping?.searchable) {
        mapping.searchable.forEach((field) => searchableFields.add(field));
      }
    }

    const searchable = Array.from(searchableFields);

    const queryBuilder = this.repository.createQueryBuilder('account');

    if (limit) {
      queryBuilder.take(limit);
    }
    if (skip) {
      queryBuilder.skip(skip);
    }
    if (sortKey) {
      queryBuilder.orderBy(`account.${sortKey}`, sortDir || 'ASC');
    }

    queryBuilder.where('account.type IN (:...types)', { types });
    queryBuilder.leftJoinAndSelect('account.users', 'users');
    queryBuilder.leftJoinAndSelect('users.roles', 'roles');

    types.forEach((validType) => {
      queryBuilder.leftJoinAndSelect(
        `account.${camelCase(validType.toLowerCase())}`,
        validType.toLowerCase(),
      );
    });

    if (ids) {
      const idArray = ids.split(',').map((id) => parseInt(id.trim(), 10));
      queryBuilder.andWhere('account.id IN (:...idArray)', { idArray });
    }

    if (active !== undefined) {
      const activeValue = active === 'false' || active === false ? 0 : 1;
      queryBuilder.andWhere('account.active = :activeValue', { activeValue });
    }

    if (searchOptions.search) {
      searchOptions.search = searchOptions.search.trim();
    }
    buildSearchQueryBuilder(searchOptions, searchable, queryBuilder);

    const [entities, count] = await queryBuilder.getManyAndCount();
    return [entities, count];
  }

  async findById(id: number, relations: string[] = []) {
    relations = relations.length ? relations : this.relations;

    const account = await this.repository.findOne({
      where: { id },
      relations: {
        ...buildRelationsObj(relations),
        users: {
          roles: true,
          accounts: {
            customer: {
              // state: true,
              // nationality: true,
              // lga: true,
              // country: true,
            },
            admin: true,
          },
        },
      },
    });
    return account;
  }

  async findCompaniesByIdentifiers(
    identifiers: { email: string; name: string; nogicUniqueId?: string }[],
  ) {
    const names = identifiers.map((i) => i.name.toLowerCase());
    const nogicUniqueIds = identifiers
      .map((i) => i.nogicUniqueId?.toLowerCase())
      .filter((id) => !!id);

    const qb = this.accountRepository
      .createQueryBuilder('account')
      .leftJoinAndSelect('account.company', 'company')
      .leftJoinAndSelect('account.operator', 'operator');

    const conditions: string[] = [];

    const likeNameConditions = names.map(
      (_, i) =>
        `(LOWER(company.name) LIKE :companyName${i} OR LOWER(operator.name) LIKE :operatorName${i})`,
    );

    if (likeNameConditions.length > 0) {
      conditions.push(likeNameConditions.join(' OR '));
    }

    if (nogicUniqueIds.length > 0) {
      conditions.push(`LOWER(account.nogicNumber) IN (:...nogicUniqueIds)`);
    }

    if (conditions.length > 0) {
      qb.where(conditions.join(' OR '));
    }

    const nameLikeParams = names.reduce(
      (acc, name, i) => {
        const truncatedName = name.split(' ').slice(0, 2).join(' ');
        acc[`companyName${i}`] = `%${truncatedName}%`;
        acc[`operatorName${i}`] = `%${truncatedName}%`;
        return acc;
      },
      {} as Record<string, string>,
    );
    qb.setParameters({ ...nameLikeParams, nogicUniqueIds });

    return qb.getMany();
  }

  async checkEmailExist(email: string): Promise<boolean> {
    const lowerEmail = email.toLowerCase();

    const qb = this.accountRepository
      .createQueryBuilder('account')
      .leftJoin('account.company', 'company')
      .leftJoin('account.operator', 'operator')
      .where(
        'LOWER(company.email) = :companyEmail OR LOWER(operator.email) = :operatorEmail',
        { companyEmail: lowerEmail, operatorEmail: lowerEmail },
      );

    const exists = await qb.getOne();
    return !!exists;
  }
  async findIndividualAccount(search?: string) {
    const queryBuilder = this.accountRepository
      .createQueryBuilder('account')
      .leftJoinAndSelect('account.users', 'users')
      .leftJoinAndSelect('account.individual', 'individual')
      .leftJoinAndSelect('individual.lga', 'lga')
      .leftJoinAndSelect('individual.nationality', 'nationality')
      .leftJoinAndSelect('individual.state', 'state')
      .leftJoinAndSelect('individual.country', 'country')
      .where('account.type = :accountType', {
        accountType: AccountTypeEnum.CUSTOMER,
      });

    if (search) {
      const searchNumber = Number(search);
      if (!isNaN(searchNumber)) {
        queryBuilder.andWhere('entity.employeeNumber LIKE :searchNumber', {
          searchNumber: `%${searchNumber}%`,
        });
      } else {
        const searchKeyword = `%${search.toUpperCase()}%`;
        queryBuilder.andWhere(
          new Brackets((qb) => {
            qb.orWhere('UPPER(individual.firstName) LIKE :firstName', {
              firstName: searchKeyword,
            })
              .orWhere('UPPER(individual.lastName) LIKE :lastName', {
                lastName: searchKeyword,
              })
              .orWhere('UPPER(users.email) LIKE :email', {
                email: searchKeyword,
              });
          }),
        );
      }
    }

    return await queryBuilder.getMany();
  }

  async findAccountTypeData(accountId: number, accountType: AccountTypeEnum) {
    const options = { where: { accountId } };
    const relations = accountTypeMapping[accountType].relations;

    if (relations.length) {
      options['relations'] = relations;
    }

    const repository = this.getRepositoryForAccountType(accountType);

    return await repository.findOne({
      ...options,
    });
  }

  // async findShareholdersTotalShares(accountId: number) {
  //   return await this.shareholderRepository.findShareHoldersTotalShare(
  //     accountId,
  //   );
  // }

  async update(id: number, data): Promise<any> {
    const account = await this.accountRepository.findOne({
      where: { id },
      relations: ['users'],
    });

    if (!account) {
      throw new CustomNotFoundException(`Account with id ${id} not found`);
    }

    const accountTypeRelation = AccountTypeEnum[account.type];
    // this.loggerService.log(accountTypeRelation);
    let existingEntity;
    let repository;
    let fillableFields;

    switch (accountTypeRelation) {
      case AccountTypeEnum.CUSTOMER:
        repository = this.individualRepository;
        fillableFields = accountTypeMapping[account.type].fillable;
        existingEntity = await repository.findOne({
          where: { accountId: account.id },
        });
        break;
      case AccountTypeEnum.ADMIN:
        repository = this.agencyRepository;
        fillableFields = accountTypeMapping[account.type].fillable;
        existingEntity = await repository.findOne({
          where: { accountId: account.id },
        });
        break;
      default:
        throw new CustomInternalServerException(
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          `Unsupported account type: ${accountTypeRelation}`,
        );
    }

    if (!existingEntity) {
      throw new CustomNotFoundException(
        `${accountTypeRelation} with account id ${account.id} not found`,
      );
    }

    const updatedData = {
      ...pick(data, fillableFields),
    };

    await repository.update({ accountId: account.id }, updatedData);
    return account;
  }

  private getRepositoryForAccountType(accountType: AccountTypeEnum) {
    switch (accountType) {
      case AccountTypeEnum.CUSTOMER:
        return this.individualRepository;
      case AccountTypeEnum.ADMIN:
        return this.agencyRepository;

      default:
        throw new CustomInternalServerException(
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          `Unsupported account type: ${accountType}`,
        );
    }
  }
}
