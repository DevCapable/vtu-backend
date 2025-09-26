import { CurrentUser } from '@app/iam/decorators';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateRoleDto } from './dto/create-role.dto';
import { RoleService } from './role.service';
import { AccountTypeEnum } from '@app/account/enums';
import { Accounts } from '@app/account/decorators/accounts.decorator';
import {
  ApiEndpoint,
  FiltersQuery,
  PaginationQuery,
} from '@app/core/decorators';
import { ApiFilterPagination } from '@app/core/decorators/api-filter-pagination.decorator';
import { PaginationInterceptor } from '@app/core/providers/pagination/pagination.interceptor';
import { AuditLogInterceptor } from '@app/audit-log/interceptors/audit-log.interceptor';
import { EntityType } from '@app/audit-log/enum';

@Controller('roles')
@Accounts(
  AccountTypeEnum.AGENCY,
  AccountTypeEnum.OPERATOR,
  AccountTypeEnum.COMPANY,
)
@ApiTags('roles')
export class RoleController {
  constructor(private readonly rolesService: RoleService) {}

  @HttpCode(HttpStatus.CREATED)
  @ApiEndpoint('Create New Role')
  @ApiResponse({
    status: 201,
    description: 'Role created successfully',
  })
  @Post()
  @UseInterceptors(
    AuditLogInterceptor({
      entityType: EntityType.ROLE,
      service: RoleService,
    }),
  )
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @ApiFilterPagination('Get all Roles')
  @UseInterceptors(PaginationInterceptor)
  @Get()
  findAll(
    @FiltersQuery() filterOptions,
    @PaginationQuery() paginationOptions,
    @CurrentUser() user,
  ) {
    return this.rolesService.findAll(filterOptions, paginationOptions, user);
  }

  @ApiFilterPagination('Get all Roles')
  @UseInterceptors(PaginationInterceptor)
  @Get('/account')
  findAllByAccount(
    @FiltersQuery() filterOptions,
    @PaginationQuery() paginationOptions,
    @CurrentUser() user,
  ) {
    return this.rolesService.findAllByAccount(
      filterOptions,
      paginationOptions,
      user,
    );
  }

  @HttpCode(HttpStatus.OK)
  @ApiEndpoint('Get One Role')
  @ApiResponse({
    status: 200,
    description: 'Ok',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(+id);
  }

  @ApiFilterPagination('Get all Roles')
  @UseInterceptors(PaginationInterceptor)
  @Get(':id/users')
  findAllUsers(
    @Param('id') id: string,
    @FiltersQuery() filterOptions,
    @PaginationQuery() paginationOptions,
  ) {
    return this.rolesService.findAllUsers(
      filterOptions,
      paginationOptions,
      +id,
    );
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update Role  Record',
  })
  @ApiResponse({
    status: 200,
    description: 'Ok',
  })
  @Patch(':id')
  @UseInterceptors(
    AuditLogInterceptor({
      entityType: EntityType.ROLE,
      service: RoleService,
      changeKeys: ['name', 'slug', 'description'],
    }),
  )
  update(@Param('id') id: string, @Body() updateRoleDto) {
    return this.rolesService.update(+id, updateRoleDto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiEndpoint('Delete Role')
  @ApiResponse({
    status: 200,
    description: 'Ok',
  })
  @UseInterceptors(
    AuditLogInterceptor({
      entityType: EntityType.ROLE,
      service: RoleService,
    }),
  )
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rolesService.remove(+id);
  }
}
