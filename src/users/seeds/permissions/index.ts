import { agencyPermissionsDbSeed } from './agency-permissions.db.seed';
import { companyPermissionsDbSeed } from './company-permissions.db.seed';
import { operatorPermissionsDbSeed } from './operator-permissions.db.seed';

export const userPermissionsDbSeed = [
  ...agencyPermissionsDbSeed,
  // ...companyPermissionsDbSeed,
  // ...operatorPermissionsDbSeed,
];
