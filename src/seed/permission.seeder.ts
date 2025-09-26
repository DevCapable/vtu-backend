import { Injectable } from '@nestjs/common';
import { SeederInterface } from './seeder.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from '@app/permission/entities/permission.entity';
import { Repository } from 'typeorm';
// import { userPermissionsDbSeed } from '@app/user/seeds/permissions';
import { Promise as Bluebird } from 'bluebird';
import { v4 as uuidv4 } from 'uuid';
import { rolePermissionsDbSeed } from '@app/role/seeds/permissions';
import { accountPermissionsDbSeed } from '@app/account/seed/permissions';
// import { baseRecordPermissionDbSeed } from '@app/base-record/seed/permissions/base-record.permission';
import { documentPermissionDbSeed } from '@app/document/seed/permissions/document.permission';
import { userPermissionsDbSeed } from '@app/users/seeds/permissions';
import { baseRecordPermissionDbSeed } from '@app/base-record/seed/permissions/base-record.permission';
// import { faqPermissionDbSeed } from '@app/faq/seed/permissions/faq.permission';
// import { LoggerService } from '@app/logger';

@Injectable()
export class PermissionSeeder implements SeederInterface {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    // private readonly loggerService: LoggerService,
  ) {}
  async seed() {
    const permissions = [
      {
        action: 'create',
        title: 'access ncdf',
        subject: 'special-permission',
        permissionGroupId: 27,
      },
      ...accountPermissionsDbSeed,
      ...documentPermissionDbSeed,
      ...baseRecordPermissionDbSeed,
      // ...faqPermissionDbSeed,
      ...rolePermissionsDbSeed,
      ...userPermissionsDbSeed,
    ];
    await Bluebird.map(permissions, async (data) => {
      const existingPermission = await this.permissionRepository.findOne({
        where: {
          subject: data.subject,
          action: data.action,
          permissionGroupId: data.permissionGroupId,
        },
      });

      if (existingPermission) {
        // this.loggerService.log(`Permission already exists ${data.subject}`);
      } else {
        try {
          const newPermission = this.permissionRepository.create({
            ...data,
            uuid: uuidv4(),
          });
          await this.permissionRepository.save(newPermission);
        } catch (error) {
          // this.loggerService.log(error);
        }
      }
    });
  }
}
