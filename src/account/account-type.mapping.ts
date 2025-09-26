import {
  CreateAgencyDto,
  CreateIndividualDto,
  UpdateAgencyDto,
  UpdateIndividualDto,
} from './dto';
import { AccountTypeEnum } from './enums';

type Options = {
  fillable: string[];
  relations: string[];
  searchable: string[];
  createDto: any;
  updateDto: any;
};

export type AccountTypeMapping = Record<AccountTypeEnum, Options>;
export const accountTypeMapping: AccountTypeMapping = {
  [AccountTypeEnum.CUSTOMER]: {
    fillable: [
      'firstName',
      'lastName',
      'otherNames',
      'isExpatriate',
      'dob',
      'gender',
      'phoneNumber',
      'countryId',
      'nationalityId',
      'altEmail',
      'altPhoneNumber',
      'address',
      'stateId',
      'cityResidence',
      'stateResidenceForeign',
      'stateResidenceId',
      'lgaId',
      'homeTown',
      'employmentStatus',
      'currentEmployer',
      'dateEmployed',
      'ninNumber',
      'accountId',
      'uuid',
      'competencyId',
    ],
    relations: ['country', 'nationality', 'state', 'lga', 'stateResidence'],
    searchable: [
      'users.firstName',
      'users.lastName',
      'individual.firstName',
      'individual.lastName',
      'individual.phoneNumber',
      'individual.competencyId',
      'users.email',
    ],
    createDto: CreateIndividualDto,
    updateDto: UpdateIndividualDto,
  },
  [AccountTypeEnum.ADMIN]: {
    fillable: [
      'firstName',
      'lastName',
      'position',
      'workflowGroups',
      'phoneNumber',
      'accountId',
      'uuid',
    ],
    relations: [],
    searchable: [
      'users.firstName',
      'users.lastName',
      'agency.firstName',
      'agency.lastName',
      'users.email',
    ],
    createDto: CreateAgencyDto,
    updateDto: UpdateAgencyDto,
  },
};
