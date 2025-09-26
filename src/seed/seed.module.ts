import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { seedDataSourceOptions } from '../../typeorm.config';
import { SeedService } from './seed.service';
import { Account } from '@app/account/entities/account.entity';
// import { BaseRecord } from '@app/base-record/entities/base-record.entity';
import { BaseRecordSeeder } from './base-record-seeder';
import { Document } from '@app/document/entities/document.entity';
import { DocumentSeeder } from './document.seeder';
import { UserSeeder } from './user-seeder';
import { PermissionGroup } from '@app/permission/entities/permission-group.entity';
import { PermissionGroupSeeder } from './permission-group.seeder';
import { Permission } from '@app/permission/entities/permission.entity';
import { PermissionSeeder } from './permission.seeder';
import { RoleSeeder } from './role.seeder';
import { Role } from '@app/role/entities/role.entity';
// import { Faq } from '@app/faq/entities/faq.entity';
// import { FaqSeeder } from './faq.seeder';
import { Repository } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import { Customer } from '@app/account/entities/customer.entity';
import { User } from '@app/users/entities/user.entity';
import { Admin } from '@app/account/entities/admin.entity';
import { seedDataSourceOptions } from '../../typeorm.config';
import { LoggerModule } from '@app/logger';
import { BaseRecord } from '@app/base-record/entities/base-record.entity';
import { BaseRecordRepository } from '@app/base-record/base-record.repository';

@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({ ...seedDataSourceOptions }),
    TypeOrmModule.forFeature([
      BaseRecord,
      Account,
      Customer,
      Admin,
      User,
      Document,
      PermissionGroup,
      Permission,
      Role,
      // Faq,
    ]),
  ],
  controllers: [],
  providers: [
    Repository,
    SeedService,
    BaseRecordSeeder,
    DocumentSeeder,
    UserSeeder,
    PermissionGroupSeeder,
    PermissionSeeder,
    RoleSeeder,
    BaseRecordRepository,
  ],
})
export class SeedModule {}
