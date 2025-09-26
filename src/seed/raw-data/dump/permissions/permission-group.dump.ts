import { AccountTypeEnum } from '@app/account/enums';
import { PermissionGroupName } from './abilities/group-name';

export const permissionGroups = [
  // // MARINE_VESSEL
  // {
  //   id: 1,
  //   name: PermissionGroupName.MARINE_VESSEL,
  //   type: AccountTypeEnum.COMPANY,
  //   slug: Slug.MARINE_VESSEL,
  // },
  {
    id: 2,
    name: PermissionGroupName.MARINE_VESSEL,
    type: AccountTypeEnum.AGENCY,
  },
  // USER
  // {
  //   id: 3,
  //   name: PermissionGroupName.USER_MANAGEMENT,
  //   type: AccountTypeEnum.COMPANY,
  // },
  // {
  //   id: 4,
  //   name: PermissionGroupName.USER_MANAGEMENT,
  //   type: AccountTypeEnum.OPERATOR,
  // },
  {
    id: 5,
    name: PermissionGroupName.USER_MANAGEMENT,
    type: AccountTypeEnum.AGENCY,
  },

  // NCTRC
  // {
  //   id: 6,
  //   name: PermissionGroupName.NCTRC,
  //   type: AccountTypeEnum.COMPANY,
  // },
  // {
  //   id: 7,
  //   name: PermissionGroupName.NCTRC,
  //   type: AccountTypeEnum.OPERATOR,
  // },
  {
    id: 8,
    name: PermissionGroupName.NCTRC,
    type: AccountTypeEnum.AGENCY,
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
    type: AccountTypeEnum.AGENCY,
  },

  // // NCRC
  {
    id: 12,
    name: PermissionGroupName.NCRC,
    type: AccountTypeEnum.COMPANY,
  },
  {
    id: 13,
    name: PermissionGroupName.NCRC,
    type: AccountTypeEnum.OPERATOR,
  },
  {
    id: 14,
    name: PermissionGroupName.NCRC,
    type: AccountTypeEnum.AGENCY,
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
    type: AccountTypeEnum.AGENCY,
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
    type: AccountTypeEnum.AGENCY,
  },

  // EQ
  {
    id: 21,
    name: PermissionGroupName.EQ,
    type: AccountTypeEnum.COMPANY,
  },
  {
    id: 22,
    name: PermissionGroupName.EQ,
    type: AccountTypeEnum.OPERATOR,
  },
  {
    id: 23,
    name: PermissionGroupName.EQ,
    type: AccountTypeEnum.AGENCY,
  },

  // NCTRC
  {
    id: 24,
    name: PermissionGroupName.NCTRC_TRANINING_COURSE,
    type: AccountTypeEnum.AGENCY,
  },
  {
    id: 25,
    name: PermissionGroupName.NCTRC_MATRIX_CRITERIA,
    type: AccountTypeEnum.AGENCY,
  },
  {
    id: 26,
    name: PermissionGroupName.NCTRC_AREA_OF_SPECIALIZATION,
    type: AccountTypeEnum.AGENCY,
  },
  // SPECIAL PERMISSION
  {
    id: 27,
    name: PermissionGroupName.SPECIAL_PERMISSION,
    type: AccountTypeEnum.AGENCY,
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
    type: AccountTypeEnum.AGENCY,
  },

  //ACCOUNTS
  {
    id: 31,
    name: PermissionGroupName.INDIVIDUAL_MANAGEMENT,
    type: AccountTypeEnum.AGENCY,
  },
  {
    id: 32,
    name: PermissionGroupName.COMPANY_MANAGEMENT,
    type: AccountTypeEnum.AGENCY,
  },
  {
    id: 33,
    name: PermissionGroupName.OPERATOR_MANAGEMENT,
    type: AccountTypeEnum.AGENCY,
  },
  {
    id: 34,
    name: PermissionGroupName.NCDMB_STAFF,
    type: AccountTypeEnum.AGENCY,
  },

  // NCEC
  // {
  //   id: 35,
  //   name: PermissionGroupName.NCEC,
  //   type: AccountTypeEnum.COMPANY,
  // },
  // {
  //   id: 36,
  //   name: PermissionGroupName.NCEC,
  //   type: AccountTypeEnum.OPERATOR,
  // },
  {
    id: 37,
    name: PermissionGroupName.NCEC,
    type: AccountTypeEnum.AGENCY,
  },

  // BASE RECORD
  {
    id: 38,
    name: PermissionGroupName.BASE_RECORD_MANAGEMENT,
    type: AccountTypeEnum.AGENCY,
  },

  // DOCUMENT
  {
    id: 39,
    name: PermissionGroupName.DOCUMENT_MANAGEMENT,
    type: AccountTypeEnum.AGENCY,
  },

  // WHISTLE BLOWER
  {
    id: 40,
    name: PermissionGroupName.WHISTLE_BLOWER_MANAGEMENT,
    type: AccountTypeEnum.AGENCY,
  },

  // DOCUMENT
  {
    id: 41,
    name: PermissionGroupName.GUIDELINES,
    type: AccountTypeEnum.AGENCY,
  },

  // FAQS
  {
    id: 42,
    name: PermissionGroupName.FAQ_MANAGEMENT,
    type: AccountTypeEnum.AGENCY,
  },

  // COR
  {
    id: 43,
    name: PermissionGroupName.COR,
    type: AccountTypeEnum.AGENCY,
  },

  // AUDIT LOGS
  {
    id: 44,
    name: PermissionGroupName.AUDIT_LOG,
    type: AccountTypeEnum.AGENCY,
  },

  // NCDF
  {
    id: 51,
    name: PermissionGroupName.PAYMENT,
    type: AccountTypeEnum.AGENCY,
  },

  // E MARKET

  {
    id: 54,
    name: PermissionGroupName.SERVICE_CODE,
    type: AccountTypeEnum.AGENCY,
  },
  {
    id: 55,
    name: PermissionGroupName.TENDER,
    type: AccountTypeEnum.AGENCY,
  },
  {
    id: 56,
    name: PermissionGroupName.SUBSCRIPTION,
    type: AccountTypeEnum.AGENCY,
  },
  {
    id: 57,
    name: PermissionGroupName.SETTINGS,
    type: AccountTypeEnum.AGENCY,
  },
  {
    id: 58,
    name: PermissionGroupName.FAQ_MANAGEMENT,
    type: AccountTypeEnum.AGENCY,
  },
  {
    id: 59,
    name: PermissionGroupName.NEWS,
    type: AccountTypeEnum.AGENCY,
  },
];
