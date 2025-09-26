import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseInterceptors,
  Req,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AccountTypeEnum } from './enums';
import { ApiFilterPagination } from '../core/decorators/api-filter-pagination.decorator';
import { PaginationInterceptor } from '../core/providers/pagination/pagination.interceptor';
import { FiltersQuery, PaginationQuery } from '../core/decorators';
import { ApiAccountCreate, ApiAccountUpdate } from './decorators';
import {
  AccountValidationPipe,
  HandlerAction,
} from './pipes/account-validation.pipe';
import { Accounts } from './decorators/accounts.decorator';
import { AuditLogInterceptor } from '@app/audit-log/interceptors/audit-log.interceptor';
import { EntityType } from '@app/audit-log/enum';
import { ExternalLinkOriginEnum } from '@app/iam/enum';
import { Request } from 'express';
import { Public } from '@app/iam/decorators';

@Controller('accounts')
@ApiTags('accounts')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @ApiQuery({
    name: 'type',
    type: 'string',
    required: true,
    enum: [...Object.keys(AccountTypeEnum)],
  })
  @ApiFilterPagination('Get all Accounts by account type')
  @UseInterceptors(
    AuditLogInterceptor({
      entityType: EntityType.ACCOUNT,
      service: AccountService,
    }),
  )
  @UseInterceptors(PaginationInterceptor)
  @Get()
  async findAll(
    @FiltersQuery() filterOptions,
    @PaginationQuery() paginationOptions,
  ) {
    return await this.accountService.findAll(filterOptions, paginationOptions);
  }

  @Accounts(AccountTypeEnum.AGENCY)
  @ApiAccountCreate()
  @Post()
  @UseInterceptors(
    AuditLogInterceptor({
      entityType: EntityType.ACCOUNT,
      service: AccountService,
    }),
  )
  create(
    @Body(AccountValidationPipe(HandlerAction.CREATE))
    createAccountDto: CreateAccountDto,
  ) {
    return this.accountService.create({
      ...createAccountDto,
      isActivated: true,
    });
  }

  @Public()
  @ApiAccountCreate()
  @Post('/external')
  createExternal(
    @Body(AccountValidationPipe(HandlerAction.CREATE))
    createAccountDto: CreateAccountDto,
    @Req() req: Request,
  ) {
    const originApp = req.get('X-Origin-Application');
    const externalOrigin = ExternalLinkOriginEnum[originApp];
    return this.accountService.createExternal(
      {
        ...createAccountDto,
      },
      externalOrigin,
    );
  }

  @Accounts(AccountTypeEnum.AGENCY)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.accountService.findOne(+id);
  }

  @Get('/:id/stats')
  @ApiOperation({
    summary: 'Get Account Stats',
  })
  async findStats(@Param('id') id: number) {
    return await this.accountService.findStats(+id);
  }

  @Accounts(AccountTypeEnum.AGENCY)
  @ApiAccountUpdate()
  @Patch(':id')
  @UseInterceptors(
    AuditLogInterceptor({
      entityType: EntityType.ACCOUNT,
      service: AccountService,
    }),
  )
  update(@Param('id') id: string, @Body() updateAccountDto: UpdateAccountDto) {
    return this.accountService.update(+id, updateAccountDto);
  }
}
