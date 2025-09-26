import { Injectable } from '@nestjs/common';
import { AccountRepository } from './account.repository';

import {
  CustomBadRequestException,
  CustomValidationException,
} from '@app/core/error';
import { pick } from '@app/core/util';
import { DocumentService } from '@app/document/document.service';
import { ExternalLinkOriginEnum } from '@app/iam/enum';
import { RolesEnum } from '@app/role/enums';
import { RoleRepository } from '@app/role/role.repository';
import { StatRepository } from '@app/stat/stat.repository';
import { StatService } from '@app/stat/stat.service';
import { UserService } from '@app/user/user.service';
import { stringSimilarity } from 'string-similarity-js';
import { EntityManager, Like } from 'typeorm';
import { camelCase } from 'typeorm/util/StringUtils';
import { Account } from './entities/account.entity';
import { AccountTypeEnum } from './enums';
import { AccountEvent } from './events/account.event';

const FILEABLE_TYPE = 'PROFILE-PICTURE';
const SIMILARITY_THRESHOLD = 0.7;
const DEFAULT_LAST_NAME = 'ADMIN';

/**
 * @TODO verifyCode, resetpassword, sendNotification
 */
@Injectable()
export class AccountService {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly userService: UserService,
    private readonly entityManager: EntityManager,
    private readonly roleRepository: RoleRepository,
    private readonly documentService: DocumentService,
    private readonly statService: StatService,
    private readonly statRepository: StatRepository,
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

          let transformedItem = item;

          if (item.type === AccountTypeEnum.COMPANY) {
            const {
              services,
              serviceExecuted,
              facilities,
              qualityAssurances,
              rawMaterials,
              subsidiaries,
              equipments,
            } = await this.statRepository.findCompanyAccountRelations(item.id);

            const serviceTypes = services
              .map((service) => service.type.name)
              .join(', ');

            const serviceExecutedNames = serviceExecuted
              .map((service) => service.name)
              .join(', ');

            const facilityTypes = facilities
              .map((item) => item?.type?.name)
              .join(', ');

            const equipmentCategories = equipments
              .map((item) => item?.category?.name)
              .join(', ');

            const qualityAssuranceNames = qualityAssurances
              .map((item) => item?.isoCode)
              .join(', ');

            const rawMaterialCategories = rawMaterials
              .map((item) => item?.materialCategory?.name)
              .join(', ');

            const subsidiaryCompanies = subsidiaries
              .map((item) => item?.companyAccount?.name)
              .join(', ');

            transformedItem = {
              ...item,
              id: item.id,
              rcNumber: item.isOffshore ? 'N/A' : item.rcNumber,
              name: item.company.name.toUpperCase(),
              serviceTypes,
              serviceExecuted: serviceExecutedNames,
              facilityTypes,
              equipmentCategories,
              qualityAssurances: qualityAssuranceNames,
              rawMaterialCategories,
              subsidiaries: subsidiaryCompanies,
            };
          }

          if (item.type === AccountTypeEnum.INDIVIDUAL) {
            const {
              academics,
              jobExperiences,
              certifications,
              skills,
              trainings,
            } = await this.statRepository.findIndividualAccountRelations(
              item.id,
            );

            const degrees = academics
              .map((academic) => academic?.degree?.name)
              .join(', ');

            const courses = academics
              .map((academic) => academic?.course?.name)
              .join(', ');

            const levels = academics
              .map((academic) => academic?.level?.name)
              .join(', ');

            const jobTitles = jobExperiences
              .map((item) => item?.jobType?.name)
              .join(', ');

            const skillCategories = skills
              .map((skill) => skill?.category?.name)
              .join(', ');

            const certificationTypes = certifications
              .map((certification) => certification?.type?.name)
              .join(', ');

            const trainingNames = trainings.map((item) => item.name).join(', ');

            transformedItem = {
              id: item.id,
              firstName: item.individual.firstName.toUpperCase(),
              lastName: item.individual.lastName.toUpperCase(),
              dob: item.individual.dob,
              gender: item.individual.gender,
              state: item?.individual?.state?.name,
              degrees,
              courses,
              jobTitles,
              levels,
              skillCategories,
              certificationTypes,
              trainings: trainingNames,
              users: item.users,
              individual: item.individual,
              competencyId: item.individual?.competencyId,
            };
          }

          if (item.type === AccountTypeEnum.COMMUNITY_VENDOR) {
            transformedItem = {
              ...item,
              communityVendor: {
                id: item?.id,
                name: item.communityVendor?.name?.toUpperCase() || '',
                email: item.communityVendor?.email,
                address: item.communityVendor?.address,
                phoneNumber: item.communityVendor?.phoneNumber,
                stateId: item.communityVendor?.stateId,
                nogicNumber: item?.nogicNumber,
                state: item?.communityVendor?.state?.name,
              },
            };
          }

          return {
            ...transformedItem,
            profilePicture: documentFiles[0] || null,
          };
        }),
      );
      return { data: transformedData, totalCount };
    }

    throw new CustomValidationException({
      type: 'Account type is required',
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

      if (
        [
          AccountTypeEnum.COMPANY,
          AccountTypeEnum.OPERATOR,
          AccountTypeEnum.COMMUNITY_VENDOR,
        ].includes(accountData.accountType)
      ) {
        const defaultRole = await this.roleRepository.findOne({
          slug: RolesEnum.SUPER_ADMIN,
        });

        accountData['name'] = data.name.toUpperCase();
        accountData['isOffshore'] = data.isOffshore === 'YES';
        userData = {
          ...accountData,
          firstName: accountData.name,
          lastName: accountData?.rcNumber || DEFAULT_LAST_NAME,
        };

        if (defaultRole) {
          userData.roles = [defaultRole.id];
        }
      } else {
        accountData['firstName'] = data.firstName.toUpperCase();
        accountData['lastName'] = data.lastName.toUpperCase();
        userData = { ...accountData, isPasswordReset: false };

        if (accountData.stateId === 0) {
          delete accountData.stateId;
        }
        if (accountData.lgaId === 0) {
          delete accountData.lgaId;
        }
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
        await this.sendNotification(accountData.accountType, {
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

  async createExternal(
    data: any,
    externalOrigin: ExternalLinkOriginEnum | null,
  ) {
    try {
      const accountData = {
        ...data,
        email: data.email.toLowerCase(),
        workflowGroups: [],
        origin: externalOrigin,
        active: false,
      };

      if (
        [
          AccountTypeEnum.COMPANY,
          AccountTypeEnum.OPERATOR,
          AccountTypeEnum.COMMUNITY_VENDOR,
        ].includes(accountData.accountType)
      ) {
        accountData['name'] = data.name.toUpperCase();
      } else {
        accountData['firstName'] = data.firstName.toUpperCase();
        accountData['lastName'] = data.lastName.toUpperCase();

        if (accountData.stateId === 0) {
          delete accountData.stateId;
        }
        if (accountData.lgaId === 0) {
          delete accountData.lgaId;
        }
      }

      const isEmail = await this.accountRepository.checkEmailExist(
        accountData.email,
      );
      if (isEmail) {
        const sanitizedAccountName = data.name
          .toLowerCase()
          .replace(/[^\w\s]/gi, '')
          .replace(/\s+/g, '_');
        const newEmail = `${sanitizedAccountName}@jqs.com`;
        accountData.email = newEmail;
      }

      const respo = await this.entityManager.transaction(
        async (entityManager: EntityManager) => {
          return await this.accountRepository.createExternal(
            {
              ...accountData,
              users: [],
            },
            entityManager,
          );
        },
      );
      return respo;
    } catch (error) {
      console.error(`error-check`, error);
      throw error;
    }
  }

  async sendNotification(accountType, payload: any) {
    switch (accountType.toUpperCase()) {
      case AccountTypeEnum.COMPANY:
        this.accountEvent.companyWelcome(payload);
        break;
      case AccountTypeEnum.OPERATOR:
        this.accountEvent.operatorWelcome(payload);
        break;
      case AccountTypeEnum.AGENCY:
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
    const accountTypeData: any =
      await this.accountRepository.findAccountTypeData(
        account.id,
        account.type,
      );

    const documentFiles = await this.documentService.findFilesByFileable(
      account.id,
      FILEABLE_TYPE,
    );

    const accountWithType = {
      ...{ ...account, profilePicture: documentFiles[0] },
      [camelCase(account.type.toLowerCase())]: {
        ...accountTypeData,
        rcNumber: accountTypeData.isOffshore ? 'N/A' : accountTypeData.rcNumber,
      },
    };

    accountWithType['name'] = this._getAccountName(accountWithType);

    return accountWithType;
  }

  async findStats(id: number) {
    return await this.statService.findStat(id);
  }

  async update(id: number, data) {
    const { profilePicture, isOffshore, active, ...profileData } = data;

    const account = await this.accountRepository.update(id, {
      ...profileData,
      accountId: id,
      isOffshore: isOffshore === 'YES',
    });

    let userData = pick(data, [
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

    if (
      [
        AccountTypeEnum.COMPANY,
        AccountTypeEnum.OPERATOR,
        AccountTypeEnum.COMMUNITY_VENDOR,
      ].includes(account?.type as any)
    ) {
      userData = {
        firstName: data.name?.toUpperCase(),
        lastName: data.rcNumber || DEFAULT_LAST_NAME,
        email: data.email?.toLowerCase()?.trim(),
      } as any;
    }

    // super admin user  for the company
    let superUser = account?.users?.[0];

    if (superUser) await this.userService.update(superUser.id, userData);

    if (
      !superUser &&
      active &&
      account?.type !== AccountTypeEnum.COMMUNITY_VENDOR
    ) {
      const defaultRole = await this.roleRepository.findOne({
        slug: RolesEnum.SUPER_ADMIN,
      });

      if (defaultRole) userData.roles = [defaultRole.id];

      await this.entityManager.transaction(
        async (entityManager: EntityManager) => {
          let nogicNumber = account?.nogicNumber;

          if (!nogicNumber.includes('201/')) {
            const totalCompanies = await entityManager.count(Account, {
              where: {
                type: AccountTypeEnum.COMPANY,
                nogicNumber: Like('201/%'),
              },
            });

            const year = new Date().getFullYear().toString().slice(-2);
            nogicNumber = `201/${year}/${totalCompanies + 1}`;
          }

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
        await this.sendNotification(account?.type, {
          user: superUser,
        });
      }
    }

    return account;
  }

  async matchOrCreateCompany(
    vendors: {
      email: string;
      name: string;
      nogicUniqueId?: string;
      phoneNumber: string;
      address: string;
    }[],
    externalOrigin: ExternalLinkOriginEnum | null,
  ) {
    const companies =
      await this.accountRepository.findCompaniesByIdentifiers(vendors);

    const { matches: matchedCompanies, matchedKeys } =
      this.findBestMatchAccounts(vendors, companies);

    const results: any[] = [...matchedCompanies];

    for (const vendor of vendors) {
      const vendorName = vendor.name.toLowerCase();
      const matchKey = `${vendorName}`;

      if (matchedKeys.has(matchKey)) continue;

      console.log(`vendor to create`, vendor);
      try {
        const created = await this.createExternal(
          {
            email: vendor.email,
            name: vendor.name,
            phoneNumber: vendor.phoneNumber,
            address: vendor.address,
            accountType: AccountTypeEnum.COMPANY,
          },
          externalOrigin,
        );
        results.push({ vendorName, account: created });
      } catch (error) {
        console.log(
          `Failed to create account for`,
          vendorName,
          'with error',
          error,
        );
      }
    }
    return results;
  }

  private _getAccountName(account: Account) {
    let name = '';
    switch (account.type) {
      case AccountTypeEnum.INDIVIDUAL:
        name = `${account.individual?.firstName} ${account.individual?.lastName}`;
        break;
      case AccountTypeEnum.COMPANY:
        name = account.company?.name;
        break;
      case AccountTypeEnum.OPERATOR:
        name = account.operator?.name;
        break;
      case AccountTypeEnum.AGENCY:
        name = `${account.agency?.firstName} ${account.agency?.lastName}`;
        break;
      case AccountTypeEnum.COMMUNITY_VENDOR:
        name = account.communityVendor.name;
        break;
    }
    return name.trim();
  }

  private findBestMatchAccounts(
    identifiers: { email: string; name: string }[],
    companies: Account[],
  ) {
    const matches = [];
    const matchedKeys = new Set<string>();

    for (const identifier of identifiers) {
      const vendorName = identifier.name.toLowerCase();
      const matchKey = `${vendorName}`;

      let bestNameMatch = null;
      let highestScore = 0;

      for (const company of companies) {
        const source = company.company ?? company.operator;
        const sourceName = source?.name?.toLowerCase() ?? '';
        const nameScore = stringSimilarity(vendorName, sourceName);

        if (nameScore > highestScore) {
          bestNameMatch = company;
          highestScore = nameScore;
        }
      }

      if (highestScore >= SIMILARITY_THRESHOLD && bestNameMatch) {
        matches.push({ vendorName, account: bestNameMatch });
        matchedKeys.add(matchKey);
        continue;
      }
    }

    return { matches, matchedKeys };
  }
}
