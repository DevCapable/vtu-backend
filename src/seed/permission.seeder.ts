import { Injectable } from '@nestjs/common';
import { SeederInterface } from './seeder.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from '@app/permission/entities/permission.entity';
import { Repository } from 'typeorm';
import { userPermissionsDbSeed } from '@app/user/seeds/permissions';
import { Promise as Bluebird } from 'bluebird';
import { marineVesselPermissionSeed } from 'src/marine-vessel/seeds';
import { advertPermissionsDbSeed } from '@app/advert/seeds/permissions';
import { ncrcPermissionsDbSeed } from '@app/ncrc/seeds/permissions';
import { nctrcPermissionsDbSeed } from '@app/nctrc/seeds/permissions';
import { v4 as uuidv4 } from 'uuid';
import { rolePermissionsDbSeed } from '@app/role/seeds/permissions';
import { twpPermissionsDbSeed } from '@app/temporary-work-permit/seeds/permissions';
import { expatriateQuotaPermissionsDbSeed } from '@app/expatriate-quota/seeds/permissions';
import { exchangeProgramPermissionsDbSeed } from '@app/exchange-program/seeds/permissions';
import { accountPermissionsDbSeed } from '@app/account/seed/permissions';
import { baseRecordPermissionDbSeed } from '@app/base-record/seed/permissions/base-record.permission';
import { documentPermissionDbSeed } from '@app/document/seed/permissions/document.permission';
import { faqPermissionDbSeed } from '@app/faq/seed/permissions/faq.permission';
import { guidelinePermissionDbSeed } from '@app/guideline/seed/permissions/guideline.permission';
import { whistleBlowerPermissionDbSeed } from '@app/support/repository/seeds/permissions/whistle-blower.permission';
import { ncecPermissionsDbSeed } from '@app/ncec/seeds/permissions';
import { corPermissionsDbSeed } from '@app/registration-certificate/seeds/permissions';
import { LoggerService } from '@app/logger';
import { auditLogPermissionsDbSeed } from '@app/audit-log/seeds/permissions';
import { ncdfPermissionsDbSeed } from '@app/ncdf/seeds/permissions';
import { eMarketPermissionsDbSeed } from '@app/e-market/seeds/permissions';

@Injectable()
export class PermissionSeeder implements SeederInterface {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    private readonly loggerService: LoggerService,
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
      ...baseRecordPermissionDbSeed,
      ...documentPermissionDbSeed,
      ...faqPermissionDbSeed,
      ...rolePermissionsDbSeed,
      ...guidelinePermissionDbSeed,
      ...whistleBlowerPermissionDbSeed,
      ...marineVesselPermissionSeed,
      ...userPermissionsDbSeed,
      ...advertPermissionsDbSeed,
      ...ncrcPermissionsDbSeed,
      ...nctrcPermissionsDbSeed,
      ...ncecPermissionsDbSeed,
      ...corPermissionsDbSeed,
      ...twpPermissionsDbSeed,
      ...expatriateQuotaPermissionsDbSeed,
      ...exchangeProgramPermissionsDbSeed,
      ...auditLogPermissionsDbSeed,
      ...ncdfPermissionsDbSeed,
      ...eMarketPermissionsDbSeed,
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
        this.loggerService.log(`Permission already exists ${data.subject}`);
      } else {
        try {
          const newPermission = await this.permissionRepository.create({
            ...data,
            uuid: uuidv4(),
          });
          await this.permissionRepository.save(newPermission);
        } catch (error) {
          this.loggerService.log(error);
        }
      }
    });
  }
}
