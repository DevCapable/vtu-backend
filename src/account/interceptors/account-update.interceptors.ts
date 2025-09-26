import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { AccountRepository } from '../account.repository';

@Injectable()
export class AccountUpdateInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly accountRepository: AccountRepository,
  ) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    const accountId = request.params.id;

    if (accountId) {
      this.accountRepository.findById(+accountId).then((account) => {
        request.body.accountType = account.type;
      });
    } else {
      request.body.accountType = request.user;
    }

    return next.handle();
  }
}
