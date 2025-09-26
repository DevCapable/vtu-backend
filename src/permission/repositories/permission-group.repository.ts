import { BaseRepository } from '@app/core/base/base.repository';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PermissionGroup } from '../entities/permission-group.entity';

@Injectable()
export class PermissionGroupRepository extends BaseRepository<PermissionGroup> {
  constructor(
    @InjectRepository(PermissionGroup)
    private readonly permissionGroupRepository: Repository<PermissionGroup>,
  ) {
    super(permissionGroupRepository);
  }
}
