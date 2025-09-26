import { Injectable } from '@nestjs/common';
import { SeederInterface } from './seeder.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { EntityManager, Repository } from 'typeorm';
import { Account } from '../account/entities/account.entity';
import { Agency, Position } from '../account/entities/agency.entity';
import { Operator } from '../account/entities/operator.entity';
import { Company } from '../account/entities/company.entity';
import { Individual } from '../account/entities/individual.entity';
import { BaseRecord } from '../base-record/entities/base-record.entity';
import { generateRandomCode } from '../core/util';
import { AccountTypeEnum } from '../account/enums';
import { BcryptService } from '@app/user/hashing/bcrypt.service';
import { Role } from '@app/role/entities/role.entity';
import { v4 as uuidv4 } from 'uuid';
import { RolesEnum } from '@app/role/enums';
import { LoggerService } from '@app/logger';
import { StringHelper } from '@app/core/helpers';

const hashService = new BcryptService();

@Injectable()
export class UserSeeder implements SeederInterface {
  constructor(
    @InjectRepository(User)
    private readonly user: Repository<User>,
    @InjectRepository(Account)
    private readonly account: Repository<Account>,
    @InjectRepository(Agency)
    private readonly agency: Repository<Agency>,
    @InjectRepository(Operator)
    private readonly operator: Repository<Operator>,
    @InjectRepository(Company)
    private readonly company: Repository<Company>,
    @InjectRepository(Individual)
    private readonly individual: Repository<Individual>,
    @InjectRepository(BaseRecord)
    private readonly baseRecord: Repository<BaseRecord>,
    @InjectRepository(Role)
    private readonly role: Repository<Role>,
    private readonly entityManager: EntityManager,
    private readonly loggerService: LoggerService,
  ) {}

  async createAccount(accountType, userData, accountData) {
    const uniqueUser = await this.user.findOne({
      where: {
        email: userData.email,
      },
    });

    if (uniqueUser) {
      return;
    }

    await this.entityManager.transaction(async (manager: EntityManager) => {
      const user = await manager.save(User, {
        ...userData,
        password: await hashService.hash('password'),
        nogicNumber: generateRandomCode(8),
        isActivated: true,
        uuid: uuidv4(),
      });
      await this.create(
        { ...accountData, accountType, users: [user] },
        manager,
      );
    });
  }

  async create(data, entityManager?: EntityManager): Promise<any> {
    const nogicNumber = generateRandomCode(8);

    const userData = {
      ...data,
      nogicNumber,
      type: data.accountType,
      uuid: uuidv4(),
    };

    const account = await entityManager.save(Account, userData);
    const accountData = {
      ...userData,
      accountId: account.id,
      uuid: uuidv4(),
    };
    switch (data.accountType) {
      case AccountTypeEnum.INDIVIDUAL:
        const individual = await entityManager.save(Individual, accountData);
        userData.individual = individual;
        break;
      case AccountTypeEnum.COMPANY:
        const company = await entityManager.save(Company, accountData);
        userData.company = company;
        break;
      case AccountTypeEnum.OPERATOR:
        const operator = await entityManager.save(Operator, accountData);
        userData.operator = operator;
        break;
      case AccountTypeEnum.AGENCY:
        const agency = await entityManager.save(Agency, accountData);
        userData.agency = agency;
        break;
    }
    return account;
  }

  async createIndividualAccount() {
    const country = await this.baseRecord.findOne({
      where: {
        slug: 'nigeria',
      },
    });
    const nationality = await this.baseRecord.findOne({
      where: {
        slug: 'nigerian',
      },
    });
    const userData = {
      firstName: 'JOHN',
      lastName: 'SMITH',
      email: 'individual@gmail.com',
    };

    const accountData = {
      firstName: userData.firstName,
      lastName: userData.lastName,
      countryId: country.id,
      nationalityId: nationality.id,
      dob: '1888-04-24',
      gender: 'MALE',
      phoneNumber: '0099e8e8e7',
    };

    return this.createAccount(
      AccountTypeEnum.INDIVIDUAL,
      userData,
      accountData,
    );
  }

  async createAgencyAccount() {
    const role = await this.role.findOne({
      where: {
        slug: RolesEnum.SUPER_ADMIN,
      },
    });
    const accountData = {
      firstName: 'SUPER',
      lastName: 'ADMIN',
      email: 'super_admin@nogicjqs.gov.ng',
      phoneNumber: '0099e8e8e7',
      position: Position.PO,
      // workflowGroups: [],
    };

    const userData = {
      firstName: accountData.firstName,
      lastName: accountData.lastName,
      email: accountData.email,
      roles: [role],
    };

    return await this.createAccount(
      AccountTypeEnum.AGENCY,
      userData,
      accountData,
    );
  }

  async createCompanyAccount() {
    const businessCategory = await this.baseRecord.findOne({
      where: {
        slug: StringHelper.slugify('Business Name [BUSN]'),
      },
    });
    const role = await this.role.findOne({
      where: {
        slug: RolesEnum.SUPER_ADMIN,
      },
    });
    const accountData = {
      address: 'Surulere, Aguda',
      businessCategoryId: businessCategory.id,
      email: 'company@vas.com',
      name: 'VASCON SOLUTIONS',
      phoneNumber: '0838393837',
      rcNumber: '3837373',
    };

    const userData = {
      firstName: accountData.name,
      lastName: accountData.rcNumber,
      email: accountData.email,
      roles: [role],
    };

    return await this.createAccount(
      AccountTypeEnum.COMPANY,
      userData,
      accountData,
    );
  }

  async createOperatorAccount() {
    const category = await this.baseRecord.findOne({
      where: {
        slug: StringHelper.slugify('International Oil Companies'),
      },
    });
    const businessCategory = await this.baseRecord.findOne({
      where: {
        slug: StringHelper.slugify('Private Limited Company (LTD)'),
      },
    });
    const role = await this.role.findOne({
      where: {
        name: 'Super Admin',
      },
    });
    const accountData = {
      categoryId: category.id,
      address: 'Surulere, Aguda',
      businessCategoryId: businessCategory.id,
      email: 'operator@vas.com',
      name: 'VASCON OPERATOR SOLUTIONS',
      phoneNumber: '0838393837',
      rcNumber: '3837373',
    };

    const userData = {
      firstName: accountData.name,
      lastName: accountData.rcNumber,
      email: accountData.email,
      roles: [role],
    };

    return await this.createAccount(
      AccountTypeEnum.OPERATOR,
      userData,
      accountData,
    );
  }

  async seed() {
    try {
      // await this.createAgencyAccount();
      // await this.createIndividualAccount();
      // await this.createCompanyAccount();
      // await this.createOperatorAccount();
    } catch (e) {
      this.loggerService.error(e);
    }
  }
}
