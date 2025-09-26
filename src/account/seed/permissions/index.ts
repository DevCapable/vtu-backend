import { ncdmbPermissionDbSeed } from './admin.permission';
import { customerPermissionDbSeed } from './customer.permission';

export const accountPermissionsDbSeed = [
  ...customerPermissionDbSeed,
  ...ncdmbPermissionDbSeed,
];
