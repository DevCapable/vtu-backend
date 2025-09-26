import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Body,
  Get,
  UseInterceptors,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { Accounts } from '@app/account/decorators/accounts.decorator';
import { AccountTypeEnum } from '@app/account/enums';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BaseRecordService } from './base-record.service';
import { CreateBaseRecordDto } from './dto/create-base-record.dto';
import { ApiEndpoint, FiltersQuery, PaginationQuery } from '../core/decorators';
import { ApiFilterPagination } from '../core/decorators/api-filter-pagination.decorator';
import { PaginationInterceptor } from '../core/providers/pagination/pagination.interceptor';
import { UpdateBaseRecordDto } from './dto/update-base-record.dto';
import { Public } from '@app/iam/decorators';

@Controller('base-records')
@ApiTags('base-records')
export class BaseRecordController {
  constructor(private readonly baseRecordService: BaseRecordService) {}

  @Accounts(AccountTypeEnum.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ApiEndpoint('Create Base Record')
  @ApiResponse({
    status: 201,
    description: 'New Record Created Successfully',
  })
  @Post()
  create(@Body() createBaseRecordDto: CreateBaseRecordDto) {
    return this.baseRecordService.create(createBaseRecordDto);
  }

  @ApiQuery({
    name: 'type',
    description: 'base record type is required',
    required: true,
  })
  @Public()
  @ApiFilterPagination('Get all base records by type')
  @UseInterceptors(PaginationInterceptor)
  @Get()
  async findAll(
    @FiltersQuery() filterOptions,
    @PaginationQuery() paginationOptions,
  ) {
    return await this.baseRecordService.findAll(
      filterOptions,
      paginationOptions,
    );
  }

  @HttpCode(HttpStatus.OK)
  @ApiEndpoint('Get One Base Record')
  @ApiResponse({
    status: 200,
    description: 'Ok',
  })
  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.baseRecordService.findOne(+id);
  }

  @Accounts(AccountTypeEnum.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update Base Record',
    description: 'Update Any Base Record Data',
  })
  @ApiResponse({
    status: 200,
    description: 'Ok',
  })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBaseRecordDto: UpdateBaseRecordDto,
  ) {
    return this.baseRecordService.update(+id, updateBaseRecordDto);
  }

  @Accounts(AccountTypeEnum.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiEndpoint('Delete Base Record')
  @ApiResponse({
    status: 200,
    description: 'Ok',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.baseRecordService.delete(+id);
  }
}
