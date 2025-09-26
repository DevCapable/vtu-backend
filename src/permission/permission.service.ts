import { Injectable } from '@nestjs/common';
import { AccountTypeEnum } from '@app/account/enums';
import { GROUPTYPE } from './entities/permission-group.entity';
import { PermissionRepository } from './repositories';

@Injectable()
export class PermissionService {
  constructor(private readonly permissionRepository: PermissionRepository) {}

  async findAll(pagination, paginationOptions, user) {
    let permissionGroup;
    const [data, totalCount] = await this.permissionRepository.findAll(
      pagination,
      paginationOptions,
      user,
      permissionGroup,
    );
    return { data, totalCount };
  }
}
