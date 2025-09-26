import { AccountTypeEnum } from '@app/account/enums';
import { PermissionGroupName } from './abilities/group-name';

export const permissionGroups = [
  {
    id: 2,
    name: PermissionGroupName.MARINE_VESSEL,
    type: AccountTypeEnum.ADMIN,
  },
  {
    id: 5,
    name: PermissionGroupName.USER_MANAGEMENT,
    type: AccountTypeEnum.ADMIN,
  },

  {
    id: 8,
    name: PermissionGroupName.NCTRC,
    type: AccountTypeEnum.ADMIN,
  },
  // // ADVERT
  // {
  //   id: 9,
  //   name: PermissionGroupName.ADVERT,
  //   type: AccountTypeEnum.COMPANY,
  // },
  // {
  //   id: 10,
  //   name: PermissionGroupName.ADVERT,
  //   type: AccountTypeEnum.OPERATOR,
  // },
  {
    id: 11,
    name: PermissionGroupName.ADVERT,
    type: AccountTypeEnum.ADMIN,
  },

  {
    id: 14,
    name: PermissionGroupName.NCRC,
    type: AccountTypeEnum.ADMIN,
  },

  // EXCHANGE PROG
  // {
  //   id: 15,
  //   name: PermissionGroupName.EXCHANGE_PROGRAM,
  //   type: AccountTypeEnum.COMPANY,
  // },
  // {
  //   id: 16,
  //   name: PermissionGroupName.EXCHANGE_PROGRAM,
  //   type: AccountTypeEnum.OPERATOR,
  // },
  {
    id: 17,
    name: PermissionGroupName.EXCHANGE_PROGRAM,
    type: AccountTypeEnum.ADMIN,
  },

  // TWP
  // {
  //   id: 18,
  //   name: PermissionGroupName.TWP,
  //   type: AccountTypeEnum.COMPANY,
  // },
  // {
  //   id: 19,
  //   name: PermissionGroupName.TWP,
  //   type: AccountTypeEnum.OPERATOR,
  // },
  {
    id: 20,
    name: PermissionGroupName.TWP,
    type: AccountTypeEnum.ADMIN,
  },
  {
    id: 23,
    name: PermissionGroupName.EQ,
    type: AccountTypeEnum.ADMIN,
  },

  // NCTRC
  {
    id: 24,
    name: PermissionGroupName.NCTRC_TRANINING_COURSE,
    type: AccountTypeEnum.ADMIN,
  },
  {
    id: 25,
    name: PermissionGroupName.NCTRC_MATRIX_CRITERIA,
    type: AccountTypeEnum.ADMIN,
  },
  {
    id: 26,
    name: PermissionGroupName.NCTRC_AREA_OF_SPECIALIZATION,
    type: AccountTypeEnum.ADMIN,
  },
  // SPECIAL PERMISSION
  {
    id: 27,
    name: PermissionGroupName.SPECIAL_PERMISSION,
    type: AccountTypeEnum.ADMIN,
  },
  // ROLE
  // {
  //   id: 28,
  //   name: PermissionGroupName.ROLE_MANAGEMENT,
  //   type: AccountTypeEnum.COMPANY,
  // },
  // {
  //   id: 29,
  //   name: PermissionGroupName.ROLE_MANAGEMENT,
  //   type: AccountTypeEnum.OPERATOR,
  // },
  {
    id: 30,
    name: PermissionGroupName.ROLE_MANAGEMENT,
    type: AccountTypeEnum.ADMIN,
  },

  //ACCOUNTS
  {
    id: 31,
    name: PermissionGroupName.INDIVIDUAL_MANAGEMENT,
    type: AccountTypeEnum.ADMIN,
  },
  {
    id: 32,
    name: PermissionGroupName.COMPANY_MANAGEMENT,
    type: AccountTypeEnum.ADMIN,
  },
  {
    id: 33,
    name: PermissionGroupName.OPERATOR_MANAGEMENT,
    type: AccountTypeEnum.ADMIN,
  },
  {
    id: 34,
    name: PermissionGroupName.NCDMB_STAFF,
    type: AccountTypeEnum.ADMIN,
  },
  {
    id: 37,
    name: PermissionGroupName.NCEC,
    type: AccountTypeEnum.ADMIN,
  },

  // BASE RECORD
  {
    id: 38,
    name: PermissionGroupName.BASE_RECORD_MANAGEMENT,
    type: AccountTypeEnum.ADMIN,
  },

  // DOCUMENT
  {
    id: 39,
    name: PermissionGroupName.DOCUMENT_MANAGEMENT,
    type: AccountTypeEnum.ADMIN,
  },

  // WHISTLE BLOWER
  {
    id: 40,
    name: PermissionGroupName.WHISTLE_BLOWER_MANAGEMENT,
    type: AccountTypeEnum.ADMIN,
  },

  // DOCUMENT
  {
    id: 41,
    name: PermissionGroupName.GUIDELINES,
    type: AccountTypeEnum.ADMIN,
  },

  // FAQS
  {
    id: 42,
    name: PermissionGroupName.FAQ_MANAGEMENT,
    type: AccountTypeEnum.ADMIN,
  },

  // COR
  {
    id: 43,
    name: PermissionGroupName.COR,
    type: AccountTypeEnum.ADMIN,
  },

  // AUDIT LOGS
  {
    id: 44,
    name: PermissionGroupName.AUDIT_LOG,
    type: AccountTypeEnum.ADMIN,
  },

  // NCDF
  {
    id: 51,
    name: PermissionGroupName.PAYMENT,
    type: AccountTypeEnum.ADMIN,
  },

  // E MARKET

  {
    id: 54,
    name: PermissionGroupName.SERVICE_CODE,
    type: AccountTypeEnum.ADMIN,
  },
  {
    id: 55,
    name: PermissionGroupName.TENDER,
    type: AccountTypeEnum.ADMIN,
  },
  {
    id: 56,
    name: PermissionGroupName.SUBSCRIPTION,
    type: AccountTypeEnum.ADMIN,
  },
  {
    id: 57,
    name: PermissionGroupName.SETTINGS,
    type: AccountTypeEnum.ADMIN,
  },
  {
    id: 58,
    name: PermissionGroupName.FAQ_MANAGEMENT,
    type: AccountTypeEnum.ADMIN,
  },
  {
    id: 59,
    name: PermissionGroupName.NEWS,
    type: AccountTypeEnum.ADMIN,
  },
];
