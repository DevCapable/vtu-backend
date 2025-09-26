import { Accounts } from '@app/account/decorators/accounts.decorator';
import { AccountTypeEnum } from '@app/account/enums';
import { Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { ApiFilterPagination } from '@app/core/decorators/api-filter-pagination.decorator';
import { PaginationInterceptor } from '@app/core/providers/pagination/pagination.interceptor';
import { FiltersQuery, PaginationQuery } from '@app/core/decorators';
import { CurrentUser } from '@app/iam/decorators';
import { LoggerService } from '@app/logger';

/**
 * @TODO activate permission guards
 */
@Accounts(
  AccountTypeEnum.AGENCY,
  AccountTypeEnum.COMPANY,
  AccountTypeEnum.OPERATOR,
)
@Controller('permissions')
export class PermissionController {
  constructor(
    private readonly permissionsService: PermissionService,
    private readonly loggerService: LoggerService,
  ) {}

  @ApiFilterPagination('Get all Permissions')
  @UseInterceptors(PaginationInterceptor)
  @Get()
  findAll(
    @FiltersQuery() filterOptions,
    @PaginationQuery() paginationOptions,
    @CurrentUser() user,
  ) {
    return this.permissionsService.findAll(
      filterOptions,
      paginationOptions,
      user,
    );
  }

  @ApiFilterPagination('Get all Permission Groups')
  @UseInterceptors(PaginationInterceptor)
  //   @checkAbilites({ action: 'read', subject: 'Permission' })
  //   @UseGuards(AbilitiesGuard)
  @Get('/group')
  async findAllGroup(
    @FiltersQuery() filterOptions,
    @PaginationQuery() paginationOptions,
    @CurrentUser() user,
  ) {
    this.loggerService.log('...');
  }
}
