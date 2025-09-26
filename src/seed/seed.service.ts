import { Injectable, Logger } from '@nestjs/common';
import { BaseRecordSeeder } from './base-record-seeder';
import { DocumentSeeder } from './document.seeder';
import { UserSeeder } from './user-seeder';

// import { UserSeeder } from './user-seeder';
import { PermissionGroupSeeder } from './permission-group.seeder';
import { PermissionSeeder } from './permission.seeder';
import { RoleSeeder } from './role.seeder';
// import { FaqSeeder } from './faq.seeder';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    private readonly baseRecordSeeder: BaseRecordSeeder,
    private readonly documentSeeder: DocumentSeeder,
    private readonly userSeeder: UserSeeder,
    private readonly permissionGroupSeeder: PermissionGroupSeeder,
    private readonly permissionSeeder: PermissionSeeder,
    private readonly roleSeeder: RoleSeeder,
    // private readonly faqSeeder: FaqSeeder,
  ) {}

  async seed() {
    this.logger.log('seeding....');
    this.documentSeeder.seed();
    this.roleSeeder.seed();
    await this.baseRecordSeeder.seed();
    await this.userSeeder.seed();
    await this.permissionGroupSeeder.seed();
    await this.permissionSeeder.seed();

    this.logger.log('seeding....Done!!!');
  }
}
