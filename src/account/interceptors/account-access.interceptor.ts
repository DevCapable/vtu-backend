import { REQUEST_USER_KEY } from '@app/iam/iam.constant';
import { CurrentUserData } from '@app/iam/interfaces';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  mixin,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AccountTypeEnum } from '../enums';
import { CustomForbiddenException } from '@app/core/error';

export function AccountAccessInterceptor(accountIdField: string = 'accountId') {
  @Injectable()
  class MixinAccountAccessInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const request = context.switchToHttp().getRequest();
      const user: CurrentUserData | undefined | any = request[REQUEST_USER_KEY];

      if (!user) return next.handle();
      const accountId = user.account.id;

      if (user.account?.type === AccountTypeEnum.ADMIN) {
        return next.handle();
      }

      return next.handle().pipe(
        map((data) => {
          if (data && typeof data === 'object') {
            if (data[accountIdField] !== accountId) {
              throw new CustomForbiddenException(
                'You do not have access to this resource.',
              );
            }
          }
          return data;
        }),
      );
    }
  }

  return mixin(MixinAccountAccessInterceptor);
}
