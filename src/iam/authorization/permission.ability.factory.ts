import {
  AbilityBuilder,
  ForbiddenError,
  MongoAbility,
  createMongoAbility,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { CurrentUserData, Role } from '../interfaces';
import {
  PermisionActionTypeEnum,
  PermisionSubjectTypeEnum,
} from '../enum/permission.enum';
import { CustomForbiddenException } from '@app/core/error';

export type AppAbility = MongoAbility<
  [PermisionActionTypeEnum, PermisionSubjectTypeEnum]
>;

@Injectable()
export class AbilityFactory {
  static createForUser(roles: Role[]): AppAbility {
    const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility);
    roles?.forEach((role) => {
      role.permissions?.forEach((permission) =>
        can(
          permission.action as PermisionActionTypeEnum,
          permission.subject as PermisionSubjectTypeEnum,
        ),
      );
    });

    return build();
  }

  static hasPermission(
    user: CurrentUserData,
    action: PermisionActionTypeEnum,
    subject: PermisionSubjectTypeEnum,
  ) {
    if (user.roles.some((role) => role.slug === 'super-admin')) return true;

    const ability = this.createForUser(user.roles as unknown as Role[]);

    try {
      ForbiddenError.from(ability).throwUnlessCan(action, subject);
    } catch (error) {
      throw new CustomForbiddenException(
        'You do not have permission to perform this action',
      );
    }
  }
}
