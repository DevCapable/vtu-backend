import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  Req,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiFilterPagination } from '@app/core/decorators/api-filter-pagination.decorator';
import { PaginationInterceptor } from '@app/core/providers/pagination/pagination.interceptor';
import {
  ApiEndpoint,
  FiltersQuery,
  PaginationQuery,
} from '@app/core/decorators';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateUserProfileDto } from '@app/users/dto/update-user-profile.dto';
import { Accounts } from '@app/account/decorators/accounts.decorator';
import { AccountTypeEnum } from '@app/account/enums';
import { JwtAuthGuard } from '@app/iam/authentication/guards';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @HttpCode(HttpStatus.CREATED)
  @ApiEndpoint('Create User')
  @ApiResponse({
    status: 201,
    description: 'User Created Successfully',
  })
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create({ ...createUserDto, isActivated: true });
  }

  // @UseGuards(JwtAuthGuard)
  // @Accounts(AccountTypeEnum.ADMIN)
  @ApiFilterPagination('Get All users')
  @UseInterceptors(PaginationInterceptor)
  @Get()
  findAllUser(
    @FiltersQuery() filterOptions,
    @PaginationQuery() paginationOptions,
    @Req() req: Request,
  ) {
    // console.log('ACCCC');
    return this.usersService.findAll(filterOptions, paginationOptions, req);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @HttpCode(HttpStatus.OK)
  @ApiEndpoint('Update User')
  @ApiResponse({
    status: 200,
    description: 'Ok',
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() userData: UpdateUserProfileDto) {
    return this.usersService.update(+id, userData);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiEndpoint('Delete User')
  @ApiResponse({
    status: 200,
    description: 'Ok',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.delete(+id);
  }
}
