import { Injectable, Logger } from '@nestjs/common';
import { BaseRecordSeeder } from './base-record-seeder';
import { DocumentSeeder } from './document.seeder';
import { UserSeeder } from './user-seeder';
import { NcecCategorySeeder } from '@app/ncec/seeds/ncec-category.db.seeder';

// import { UserSeeder } from './user-seeder';
import { PermissionGroupSeeder } from './permission-group.seeder';
import { PermissionSeeder } from './permission.seeder';
import { RoleSeeder } from './role.seeder';
import { FaqSeeder } from './faq.seeder';
import { MarineVesselCategorySeeder } from './marine-vessel-category.seeder';
import { NctrcCategorySeeder } from '@app/nctrc/seeds/nctrc-categories.db.seeder';
import { NctrcCourseSeeder } from '@app/nctrc/seeds/nctrc-courses.db.seeder';
import { NctrcMatrixCriteriaGroupSeeder } from '@app/nctrc/seeds/nctrc-matrix-criteria-groups.db.seeder';
import { NctrcMatrixCriteriaSeeder } from '@app/nctrc/seeds/nctrc-matrix-criterias.db.seeder';
import { NctrcTypesSeeder } from '@app/nctrc/seeds/nctrc-types.db.seeder';
import { EmarketFaqSeeder } from './e-market-faq.seeder';
import { ServiceCodeSeeder } from './service-code.seeder';
import { TenderStageSeeder } from '@app/tender/seed/tender-stage.seeder';
import { TenderTypeStageSeeder } from '@app/tender/seed/tender-type-stage.seeder';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    private readonly baseRecordSeeder: BaseRecordSeeder,
    private readonly documentSeeder: DocumentSeeder,
    private readonly userSeeder: UserSeeder,
    private readonly ncecCategorySeeder: NcecCategorySeeder,
    private readonly permissionGroupSeeder: PermissionGroupSeeder,
    private readonly permissionSeeder: PermissionSeeder,
    private readonly roleSeeder: RoleSeeder,
    private readonly faqSeeder: FaqSeeder,
    private readonly marineVesselCategorySeeder: MarineVesselCategorySeeder,
    private readonly nctrcCategorySeeder: NctrcCategorySeeder,
    private readonly nctrcCourseSeeder: NctrcCourseSeeder,
    private readonly nctrcMatrixCriteriaGroupSeeder: NctrcMatrixCriteriaGroupSeeder,
    private readonly nctrcTypesSeeder: NctrcTypesSeeder,
    private readonly nctrcMatrixCriteriaSeeder: NctrcMatrixCriteriaSeeder,
    private readonly emarketFaqSeeder: EmarketFaqSeeder,
    private readonly serviceCodeSeeder: ServiceCodeSeeder,
    private readonly tenderStageSeeder: TenderStageSeeder,
    private readonly tenderTypeStageSeeder: TenderTypeStageSeeder,
  ) {}

  async seed() {
    this.logger.log('seeding....');
    await this.documentSeeder.seed();
    await this.roleSeeder.seed();
    await this.baseRecordSeeder.seed();
    await this.userSeeder.seed();
    await this.ncecCategorySeeder.seed();
    await this.marineVesselCategorySeeder.seed();
    await this.nctrcCategorySeeder.seed();
    await this.nctrcMatrixCriteriaGroupSeeder.seed();
    await this.nctrcTypesSeeder.seed();
    await this.nctrcMatrixCriteriaSeeder.seed();
    await this.nctrcCourseSeeder.seed();
    await this.faqSeeder.seed();
    await this.permissionGroupSeeder.seed();
    await this.permissionSeeder.seed();
    await this.tenderStageSeeder.seed();
    await this.tenderTypeStageSeeder.seed();
    await this.serviceCodeSeeder.seed();

    this.logger.log('seeding....Done!!!');
  }
}
