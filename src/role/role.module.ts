import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { RoleRepository } from './role.repository';
import { PermissionModule } from '@app/permission/permission.module';

@Module({
  imports: [TypeOrmModule.forFeature([Role]), PermissionModule],
  controllers: [RoleController],
  providers: [RoleService, RoleRepository],
  exports: [RoleRepository],
})
export class RoleModule {}
