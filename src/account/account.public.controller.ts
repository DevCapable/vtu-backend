import { Public } from '../iam/decorators';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { AccountService } from './account.service';
import { ApiEndpoint, FiltersQuery, PaginationQuery } from '../core/decorators';
import { ApiFilterPagination } from '../core/decorators/api-filter-pagination.decorator';
import { PaginationInterceptor } from '../core/providers/pagination/pagination.interceptor';
import { AccountTypeEnum } from './enums';
import { IVendor } from './interface';
import { ExternalLinkOriginEnum } from '@app/iam/enum';

@Controller('accounts-public')
@Public()
@ApiTags('accounts-public')
export class AccountPublicController {
  constructor(private readonly accountService: AccountService) {}

  @ApiQuery({
    name: 'type',
    type: 'string',
    required: true,
    enum: [...Object.keys(AccountTypeEnum)],
  })
  @ApiFilterPagination('Get all Accounts by account type for public')
  @UseInterceptors(PaginationInterceptor)
  @Get('')
  async findAll(
    @FiltersQuery() filterOptions,
    @PaginationQuery() paginationOptions,
  ) {
    delete filterOptions.accountId;
    return await this.accountService.findAll(filterOptions, paginationOptions);
  }

  // @ApiEndpoint('find or create an account')
  // @Post('/find-create-account')
  // async matchOrCreateCompany(@Body() payload: IVendor[], @Req() req) {
  //   const originApp = req.get('X-Origin-Application');
  //   const externalOrigin = ExternalLinkOriginEnum[originApp];
  //   return await this.accountService.matchOrCreateCompany(
  //     payload,
  //     externalOrigin,
  //   );
  // }
  @ApiEndpoint('Get One Account by ID')
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.accountService.findOne(+id);
  }
}
