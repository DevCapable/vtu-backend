import { Role } from '../entities/role.entity';
import { RolesEnum } from '../enums';

export class RolesHelper {
  static hasAdminRole(roles: Role[]) {
    return roles.some((role) => role.slug === RolesEnum.SUPER_ADMIN);
  }
}
