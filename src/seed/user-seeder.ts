import { Injectable } from '@nestjs/common';
import { SeederInterface } from './seeder.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Account } from '../account/entities/account.entity';
import { Admin } from '../account/entities/admin.entity';
import { Customer } from '../account/entities/customer.entity';
// import { BaseRecord } from '../base-record/entities/base-record.entity';
import { generateRandomCode } from '../core/util';
import { AccountTypeEnum } from '../account/enums';
// import { BcryptService } from '@app/user/hashing/bcrypt.service';
import { Role } from '@app/role/entities/role.entity';
import { v4 as uuidv4 } from 'uuid';
import { RolesEnum } from '@app/role/enums';
// import { LoggerService } from '@app/logger';
import { StringHelper } from '@app/core/helpers';
import { BcryptService } from '@app/users/hashing/bcrypt.service';
import { User } from '@app/users/entities/user.entity';
import { LoggerService } from '@app/logger';
import { BaseRecord } from '@app/base-record/entities/base-record.entity';

const hashService = new BcryptService();

@Injectable()
export class UserSeeder implements SeederInterface {
  constructor(
    @InjectRepository(User)
    private readonly user: Repository<User>,
    @InjectRepository(Account)
    private readonly account: Repository<Account>,
    @InjectRepository(Admin)
    private readonly agency: Repository<Admin>,
    // @InjectRepository(Operator)
    // private readonly operator: Repository<Operator>,
    // @InjectRepository(Company)
    // private readonly company: Repository<Company>,
    @InjectRepository(Customer)
    private readonly customer: Repository<Customer>,
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

    if (entityManager) {
      const account = await entityManager.save(Account, userData);
      const accountData = {
        ...userData,
        accountId: account.id,
        uuid: uuidv4(),
      };
      switch (data.accountType) {
        case AccountTypeEnum.CUSTOMER: {
          const customer = await entityManager.save(Customer, accountData);
          userData.customer = customer;
          break;
        }
        case AccountTypeEnum.ADMIN: {
          const agency = await entityManager.save(Admin, accountData);
          userData.agency = agency;
          break;
        }
      }
      return account;
    }
  }

  async createCustomerAccount() {
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
      email: 'customer@gmail.com',
    };

    const accountData = {
      firstName: userData.firstName,
      lastName: userData.lastName,
      countryId: country?.id,
      nationalityId: nationality?.id,
      dob: '1888-04-24',
      gender: 'MALE',
      phoneNumber: '0099e8e8e7',
    };

    return this.createAccount(AccountTypeEnum.CUSTOMER, userData, accountData);
  }

  async createAdminAccount() {
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
      // position: Position.PO,
      // workflowGroups: [],
    };

    const userData = {
      firstName: accountData.firstName,
      lastName: accountData.lastName,
      email: accountData.email,
      roles: [role],
    };

    return await this.createAccount(
      AccountTypeEnum.ADMIN,
      userData,
      accountData,
    );
  }

  async seed() {
    try {
      await this.createAdminAccount();
      await this.createCustomerAccount();
      // await this.createCompanyAccount();
      // await this.createOperatorAccount();
    } catch (e) {
      this.loggerService.error(e);
    }
  }
}
