import { forwardRef, Inject, mixin, PipeTransform } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { accountTypeMapping } from '../account-type.mapping';
import { AccountRepository } from '../account.repository';
import { memoize } from '@nestjs/passport/dist/utils/memoize.util';
import { AccountTypeEnum } from '../enums';
import { CustomValidationException } from '@app/core/error';

export enum HandlerAction {
  CREATE,
  UPDATE,
}

export const AccountValidationPipe: (
  handlerAction: HandlerAction,
) => PipeTransform = memoize(createAccountValidationPipe);

function createAccountValidationPipe(handlerAction: HandlerAction) {
  handlerAction = !handlerAction ? HandlerAction.CREATE : handlerAction;
  class MixinAccountValidationPipe implements PipeTransform<any> {
    constructor(
      @Inject(forwardRef(() => AccountRepository))
      private accountRepository: AccountRepository,
    ) {}
    async transform(value: any) {
      let dto;
      let accountType;
      if (handlerAction === HandlerAction.CREATE) {
        accountType = value.accountType as AccountTypeEnum;
        if (!accountType) {
          throw new CustomValidationException({
            accountType: 'Account type is required',
          });
        }
        if (!Object.values(AccountTypeEnum).includes(accountType)) {
          throw new CustomValidationException({
            accountType: `Account type can only be one of ${Object.values(
              AccountTypeEnum,
            ).join(', ')}`,
          });
        }
        dto = accountTypeMapping[accountType].createDto;
      } else {
        const accountId = value.id;
        if (!accountId) {
          throw new CustomValidationException({
            accountType: 'Account ID is required',
          });
        }
        const { type } = await this.accountRepository.findById(+accountId);
        accountType = type;
        dto = accountTypeMapping[accountType].updateDto;
      }
      const object = plainToInstance(dto, value);
      const errors = await validate(object);
      if (errors.length > 0) {
        const errMsg = {};
        errors.forEach((err) => {
          errMsg[err.property] = [...Object.values(err.constraints)];
        });
        throw new CustomValidationException(errMsg);
      }
      return { ...value, accountType };
    }
  }
  return mixin(MixinAccountValidationPipe);
}
