import { SetMetadata } from '@nestjs/common';
import {
  PermisionActionTypeEnum,
  PermisionSubjectTypeEnum,
} from '../../enum/permission.enum';

export interface RequiredRule {
  action: PermisionActionTypeEnum;
  subject: PermisionSubjectTypeEnum;
}

export const CHECK_ABILITY = 'check_ability';

export const Permission = (
  action: PermisionActionTypeEnum,
  subject: PermisionSubjectTypeEnum,
) => SetMetadata(CHECK_ABILITY, { action, subject });
