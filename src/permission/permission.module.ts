import { Module } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionController } from './permission.controller';
import { PermissionGroup } from './entities/permission-group.entity';
import { Permission } from './entities/permission.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  PermissionGroupRepository,
  PermissionRepository,
} from './repositories';

@Module({
  imports: [TypeOrmModule.forFeature([PermissionGroup, Permission])],
  controllers: [PermissionController],
  providers: [
    PermissionService,
    PermissionGroupRepository,
    PermissionRepository,
  ],
  exports: [PermissionRepository],
})
export class PermissionModule {}
