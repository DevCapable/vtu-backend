import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { seedDataSourceOptions } from '../../typeorm.config';
import { SeedService } from './seed.service';
import { User } from '@app/user/entities/user.entity';
import { Agency } from '@app/account/entities/agency.entity';
import { Operator } from '@app/account/entities/operator.entity';
import { Company } from '@app/account/entities/company.entity';
import { Individual } from '@app/account/entities/individual.entity';
import { Account } from '@app/account/entities/account.entity';
import { BaseRecord } from '@app/base-record/entities/base-record.entity';
import { BaseRecordSeeder } from './base-record-seeder';
import { Document } from '@app/document/entities/document.entity';
import { DocumentSeeder } from './document.seeder';
import { UserSeeder } from './user-seeder';
import { NcecCategorySeeder } from '@app/ncec/seeds/ncec-category.db.seeder';
import { NcecCategory } from '@app/ncec/entities/ncec-category.entity';
import { PermissionGroup } from '@app/permission/entities/permission-group.entity';
import { PermissionGroupSeeder } from './permission-group.seeder';
import { Permission } from '@app/permission/entities/permission.entity';
import { PermissionSeeder } from './permission.seeder';
import { RoleSeeder } from './role.seeder';
import { Role } from '@app/role/entities/role.entity';
import { Faq } from '@app/faq/entities/faq.entity';
import { FaqSeeder } from './faq.seeder';
import { MarineVesselCategory } from '@app/marine-vessel/entities/marine-vessel-category.entity';
import { MarineVesselCategorySeeder } from './marine-vessel-category.seeder';
import { NctrcMatrixCriteria } from '@app/nctrc/entities/nctrc-matrix-criteria.entity';
import { NctrcType } from '@app/nctrc/entities/nctrc-type.entity';
import { NctrcCourse } from '@app/nctrc/entities/nctrc-course.entity';
import { NctrcCategory } from '@app/nctrc/entities/nctrc-category.entity';
import { NctrcMatrixCriteriaGroup } from '@app/nctrc/entities/nctrc-matrix-criteria-group.entity';
import { NctrcCategorySeeder } from '@app/nctrc/seeds/nctrc-categories.db.seeder';
import { NctrcCourseSeeder } from '@app/nctrc/seeds/nctrc-courses.db.seeder';
import { NctrcMatrixCriteriaGroupSeeder } from '@app/nctrc/seeds/nctrc-matrix-criteria-groups.db.seeder';
import { NctrcTypesSeeder } from '@app/nctrc/seeds/nctrc-types.db.seeder';
import { NctrcMatrixCriteriaSeeder } from '@app/nctrc/seeds/nctrc-matrix-criterias.db.seeder';
import { NctrcTypeRepository } from '@app/nctrc/repositories/nctrc-type.repository';
import { NctrcMatrixCriteriaGroupRepository } from '@app/nctrc/repositories/nctrc-matrix-criteria-group.repository';
import { NctrcMatrixCriteriaRepository } from '@app/nctrc/repositories/nctrc-matrix-criteria.repository';
import { Repository } from 'typeorm';
import { PromotionAdvertPackageSeeder } from './promotion-advert-package.seeder';
import { PromotionAdvertPackage } from '@app/promotion/advert-package/entities/advert-package.entity';
import { EmarketFaq } from '@app/e-market/faq/entities/faq.entity';
import { EmarketFaqSeeder } from './e-market-faq.seeder';
import { BaseRecordRepository } from '@app/base-record/base-record.repository';
import { TenderStageSeeder } from '../tender/seed/tender-stage.seeder';
import { TenderStage } from '@app/tender/entities/tender-stage.entity';
import { ServiceCodeSeeder } from './service-code.seeder';
import { ServiceCode } from '@app/service-code/entities/service-code.entity';
import { TenderTypeStageSeeder } from '@app/tender/seed/tender-type-stage.seeder';
import { TenderTypeStage } from '@app/tender/entities/tender-type-stage.entity';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from '@app/logger';

@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({ ...seedDataSourceOptions }),
    TypeOrmModule.forFeature([
      BaseRecord,
      Account,
      Individual,
      Company,
      Operator,
      Agency,
      User,
      Document,
      NcecCategory,
      PermissionGroup,
      Permission,
      Role,
      Faq,
      MarineVesselCategory,
      NctrcMatrixCriteria,
      NctrcType,
      NctrcCourse,
      NctrcCategory,
      NctrcMatrixCriteriaGroup,
      PromotionAdvertPackage,
      EmarketFaq,
      TenderStage,
      TenderTypeStage,
      ServiceCode,
    ]),
  ],
  controllers: [],
  providers: [
    NctrcTypeRepository,
    NctrcMatrixCriteriaGroupRepository,
    NctrcMatrixCriteriaRepository,
    BaseRecordRepository,
    Repository,
    SeedService,
    BaseRecordSeeder,
    DocumentSeeder,
    UserSeeder,
    NcecCategorySeeder,
    PermissionGroupSeeder,
    PermissionSeeder,
    RoleSeeder,
    FaqSeeder,
    MarineVesselCategorySeeder,
    NctrcCategorySeeder,
    NctrcCourseSeeder,
    NctrcMatrixCriteriaGroupSeeder,
    NctrcTypesSeeder,
    NctrcMatrixCriteriaSeeder,
    PromotionAdvertPackageSeeder,
    EmarketFaqSeeder,
    TenderStageSeeder,
    TenderTypeStageSeeder,
    ServiceCodeSeeder,
  ],
})
export class SeedModule {}
