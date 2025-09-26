import { agencyPermissionsDbSeed } from './agency-permissions.seed';
import { companyPermissionsDbSeed } from './company-permissions.seed';
import { operatorPermissionsDbSeed } from './operator-permissions.seed';

export const rolePermissionsDbSeed = [
  ...agencyPermissionsDbSeed,
  // ...companyPermissionsDbSeed,
  // ...operatorPermissionsDbSeed,
];
