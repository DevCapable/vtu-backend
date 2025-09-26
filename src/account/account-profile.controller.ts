import { Controller, Get, Patch, Body } from '@nestjs/common';
import { AccountService } from './account.service';
import { Accounts } from './decorators/accounts.decorator';
import { AccountTypeEnum } from './enums';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../iam/decorators';
// import { CurrentUserData } from '../iam/interfaces';
import { ApiAccountUpdate } from './decorators';
import {
  AccountValidationPipe,
  HandlerAction,
} from './pipes/account-validation.pipe';
import * as interfaces from '@app/iam/interfaces';

@Controller('account')
@Accounts(AccountTypeEnum.CUSTOMER, AccountTypeEnum.ADMIN)
@ApiTags('account')
export class AccountProfileController {
  constructor(private readonly accountService: AccountService) {}

  @Get()
  @ApiOperation({
    summary: 'Get Authenticated Account Profile',
  })
  async findOne(@CurrentUser() user: interfaces.CurrentUserData) {
    return await this.accountService.findOne(user?.account?.id);
  }

  // @Get('/stats')
  // @ApiOperation({
  //   summary: 'Get Account Profile Stats',
  // })
  // async findStats(@CurrentUser() user: interfaces.CurrentUserData) {
  //   return await this.accountService.findStats(user.account?.id);
  // }

  @ApiAccountUpdate()
  @Patch()
  async update(
    @Body(AccountValidationPipe(HandlerAction.UPDATE))
    updateAccountDto,
    @CurrentUser() user: interfaces.CurrentUserData,
  ) {
    return await this.accountService.update(user.account.id, updateAccountDto);
  }
}
