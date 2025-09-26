import { ACCOUNTS_KEY } from '../decorators/accounts.decorator';
import { REQUEST_USER_KEY } from '../../iam/iam.constant';
import { CurrentUserData } from '../../iam/interfaces';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { AccountTypeEnum } from '../enums';

@Injectable()
export class AccountGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const contextAccounts = this.reflector.getAllAndOverride<AccountTypeEnum[]>(
      ACCOUNTS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!contextAccounts) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: CurrentUserData | undefined = request[REQUEST_USER_KEY];
    const accountType = user.account.type;
    const accountId = user.account.id;
    // Append Current User AccountID to request body and query
    if (user.account.type !== AccountTypeEnum.AGENCY) {
      request.body['accountId'] = accountId;
      request.query['accountId'] = accountId;
      // Hack to append ID to request for updating account profile
      if (request.url === '/account') {
        request.body['id'] = accountId;
      }
    }

    return contextAccounts.some((account) => accountType === account);
  }
}
