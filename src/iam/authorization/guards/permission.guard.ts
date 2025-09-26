import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AbilityFactory } from '../permission.ability.factory';
import { ForbiddenError } from '@casl/ability';
import { Reflector } from '@nestjs/core';
import {
  CHECK_ABILITY,
  RequiredRule,
} from '../decorators/permission.decorator';
import { CurrentUserData } from '@app/iam/interfaces';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const rule =
      this.reflector.get<RequiredRule>(CHECK_ABILITY, context.getHandler()) ||
      null;

    if (!rule) return true;
    const request = context.switchToHttp().getRequest();

    const { user } = request;

    if (this.isSuperAdmin(user)) return true;

    const ability = AbilityFactory.createForUser(user.roles);

    try {
      ForbiddenError.from(ability).throwUnlessCan(rule.action, rule.subject);
      return true;
    } catch (error) {
      return false;
    }
  }

  private isSuperAdmin(user: CurrentUserData): boolean {
    return user.roles.some((role) => role.slug === 'super-admin');
  }
}
