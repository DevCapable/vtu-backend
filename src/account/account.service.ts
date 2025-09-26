import { Injectable } from '@nestjs/common';
import { AccountRepository } from './account.repository';

import {
  CustomBadRequestException,
  CustomValidationException,
} from '@app/core/error';
import { pick } from '@app/core/util';
import { DocumentService } from '@app/document/document.service';
import { RolesEnum } from '@app/role/enums';
import { RoleRepository } from '@app/role/role.repository';
import { EntityManager, Like } from 'typeorm';
import { camelCase } from 'typeorm/util/StringUtils';
import { Account } from './entities/account.entity';
import { AccountTypeEnum } from './enums';
import { AccountEvent } from './events/account.event';
import { UsersService } from '@app/users/users.service';

const FILEABLE_TYPE = 'PROFILE-PICTURE';
const DEFAULT_LAST_NAME = 'ADMIN';

@Injectable()
export class AccountService {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly userService: UsersService,
    private readonly entityManager: EntityManager,
    private readonly roleRepository: RoleRepository,
    private readonly documentService: DocumentService,
    private readonly accountEvent: AccountEvent,
  ) {}

  async findAll(filterOptions, paginationOptions) {
    const types = filterOptions.type?.split(',');
    if (
      types.length &&
      types.every((type) => Object.keys(AccountTypeEnum).includes(type))
    ) {
      const [data, totalCount] = await this.accountRepository.findAll(
        filterOptions,
        paginationOptions,
      );

      const transformedData = await Promise.all(
        data.map(async (item: any) => {
          const documentFiles = await this.documentService.findFilesByFileable(
            item.id,
            FILEABLE_TYPE,
          );

          const transformedItem = item;

          return {
            ...transformedItem,
            profilePicture: documentFiles[0] || null,
          };
        }),
      );
      return { data: transformedData, totalCount };
    }

    throw new CustomValidationException({
      type: ['Account type is required'],
    });
  }

  async create(data: any) {
    try {
      let userData;
      const accountData = {
        ...data,
        email: data.email?.toLowerCase()?.trim(),
        workflowGroups: data.workflowGroups || [],
      };

      accountData['firstName'] = data.firstName.toUpperCase();
      accountData['lastName'] = data.lastName.toUpperCase();
      userData = { ...accountData, isPasswordReset: false };

      if (accountData.stateId === 0) {
        delete accountData.stateId;
      }
      if (accountData.lgaId === 0) {
        delete accountData.lgaId;
      }
      let user;
      let account;

      await this.entityManager.transaction(
        async (entityManager: EntityManager) => {
          user = await this.userService.create(userData, entityManager);
          account = await this.accountRepository.create(
            {
              ...accountData,
              users: [user],
            },
            entityManager,
          );
        },
      );

      if (user.id && account.id) {
        const verificationData = await this.userService.generateToken(user.id);
        this.sendNotification(accountData.accountType, {
          token: verificationData.token,
          user,
        });
      }
    } catch (error) {
      throw new CustomBadRequestException(
        'Error encountered please check ' + error,
      );
    }
  }

  async findCompaniesByIdentifiers(
    identifiers: { email: string; name: string; nogicUniqueId?: string }[],
  ) {
    return this.accountRepository.findCompaniesByIdentifiers(identifiers);
  }

  sendNotification(accountType, payload: any) {
    switch (accountType.toUpperCase()) {
      case AccountTypeEnum.ADMIN:
        this.accountEvent.agencyWelcome(payload);
        break;
      default:
        this.accountEvent.individualWelcome(payload);
        setTimeout(() => {
          this.accountEvent.individualActivation(payload);
        }, 2000);
    }
  }

  async findOne(id: number) {
    const account = await this.accountRepository.findById(id);
    if (account) {
      const accountTypeData: any =
        await this.accountRepository.findAccountTypeData(
          account.id as number,
          account.type,
        );

      const documentFiles = await this.documentService.findFilesByFileable(
        account.id as number,
        FILEABLE_TYPE,
      );

      const accountWithType = {
        ...{ ...account, profilePicture: documentFiles[0] },
        [camelCase(account.type.toLowerCase())]: {
          ...accountTypeData,
          rcNumber: accountTypeData.isOffshore
            ? 'N/A'
            : accountTypeData.rcNumber,
        },
      };

      accountWithType['name'] = this._getAccountName(accountWithType);

      return accountWithType;
    }
  }

  async update(id: number, data) {
    const { profilePicture, isOffshore, active, ...profileData } = data;

    const account = await this.accountRepository.update(id, {
      ...profileData,
      accountId: id,
      isOffshore: isOffshore === 'YES',
    });

    const userData = pick(data, [
      'firstName',
      'lastName',
      'email',
      'phone',
      'roles',
    ]) as any;

    if (profilePicture) {
      await this.documentService.deleteDocumentFileByFileable(
        id,
        FILEABLE_TYPE,
      );
      await this.documentService.createDocumentFile(
        [profilePicture],
        id,
        FILEABLE_TYPE,
      );
    }

    // super admin user  for the company
    let superUser = account?.users?.[0];

    if (superUser) await this.userService.update(superUser.id, userData);

    if (!superUser && active) {
      const defaultRole = await this.roleRepository.findOne({
        slug: RolesEnum.SUPER_ADMIN,
      });

      if (defaultRole) userData.roles = [defaultRole.id];

      await this.entityManager.transaction(
        async (entityManager: EntityManager) => {
          const nogicNumber = account?.nogicNumber;

          superUser = await this.userService.create(
            { ...userData, isActivated: true },
            entityManager,
          );

          await entityManager.save(Account, {
            id,
            active: true,
            nogicNumber,
            users: [superUser],
          });
        },
      );

      if (superUser) {
        this.sendNotification(account?.type, {
          user: superUser,
        });
      }
    }

    return account;
  }

  private _getAccountName(account: Account) {
    let name = '';
    switch (account.type) {
      case AccountTypeEnum.CUSTOMER:
        name = `${account.customer?.firstName} ${account.customer?.lastName}`;
        break;
      case AccountTypeEnum.ADMIN:
        name = `${account.admin?.firstName} ${account.admin?.lastName}`;
        break;
    }
    return name.trim();
  }
}
