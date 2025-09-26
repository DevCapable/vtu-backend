import { ncdmbPermissionDbSeed } from './agency.permission';
import { companyPermissionDbSeed } from './company.permission';
import { individualPermissionDbSeed } from './individual.permission';
import { operatorPermissionDbSeed } from './operator.permission';

export const accountPermissionsDbSeed = [
  ...individualPermissionDbSeed,
  ...companyPermissionDbSeed,
  ...operatorPermissionDbSeed,
  ...ncdmbPermissionDbSeed,
];
