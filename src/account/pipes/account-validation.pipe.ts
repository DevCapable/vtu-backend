import { forwardRef, Inject, mixin, PipeTransform } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import memoize from 'lodash.memoize';
import { accountTypeMapping } from '../account-type.mapping';
import { AccountRepository } from '../account.repository';
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
  handlerAction = handlerAction ?? HandlerAction.CREATE;

  class MixinAccountValidationPipe implements PipeTransform<any> {
    constructor(
      @Inject(forwardRef(() => AccountRepository))
      private readonly accountRepository: AccountRepository,
    ) {}

    async transform(value: any) {
      let dto;
      let accountType: AccountTypeEnum;

      if (handlerAction === HandlerAction.CREATE) {
        accountType = value.accountType as AccountTypeEnum;

        if (!accountType) {
          throw new CustomValidationException({
            accountType: ['Account type is required'],
          });
        }

        if (!Object.values(AccountTypeEnum).includes(accountType)) {
          throw new CustomValidationException({
            accountType: [
              `Account type can only be one of ${Object.values(
                AccountTypeEnum,
              ).join(', ')}`,
            ],
          });
        }

        dto = accountTypeMapping[accountType].createDto;
      } else {
        const accountId = value.id;
        if (!accountId) {
          throw new CustomValidationException({
            accountId: ['Account ID is required'],
          });
        }

        const account = await this.accountRepository.findById(+accountId);
        if (!account) {
          throw new CustomValidationException({
            accountId: ['Account not found'],
          });
        }

        accountType = account.type;
        dto = accountTypeMapping[accountType].updateDto;
      }

      const object = plainToInstance(dto, value);
      const errors = await validate(object, { whitelist: true });

      if (errors.length > 0) {
        throw new CustomValidationException(this.formatErrors(errors));
      }

      return { ...value, accountType };
    }

    private formatErrors(errors: ValidationError[]): Record<string, string[]> {
      const result: Record<string, string[]> = {};

      const flatten = (errs: ValidationError[], parent?: string) => {
        for (const err of errs) {
          const property = parent ? `${parent}.${err.property}` : err.property;

          if (err.constraints) {
            result[property] = Object.values(err.constraints);
          }

          if (err.children?.length) {
            flatten(err.children, property);
          }
        }
      };

      flatten(errors);
      return result;
    }
  }

  return mixin(MixinAccountValidationPipe);
}
