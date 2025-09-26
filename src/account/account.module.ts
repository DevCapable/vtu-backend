import { AccountSubscriber } from '@app/account/entities/subscribers/account.subscriber';
import { DocumentModule } from '@app/document/document.module';
import { RoleModule } from '@app/role/role.module';
// import { ShareholderModule } from '@app/shareholder/shareholder.module';
// import { StatModule } from '@app/stat/stat.module';
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { UserModule } from '../user/user.module';
import { AccountProfileController } from './account-profile.controller';
import { AccountController } from './account.controller';
import { AccountPublicController } from './account.public.controller';
import { AccountRepository } from './account.repository';
import { AccountService } from './account.service';
import { Account } from './entities/account.entity';
import { Admin } from './entities/admin.entity';
import { Customer } from './entities/customer.entity';
import { AccountEvent } from './events/account.event';
import { UsersModule } from '@app/users/users.module';
// import { AccountListener } from './events/listeners/account.listener';

@Module({
  imports: [
    TypeOrmModule.forFeature([Account, Admin, Customer]),
    forwardRef(() => UsersModule),
    RoleModule,
    DocumentModule,
    // forwardRef(() => StatModule),
    // ShareholderModule,
  ],
  controllers: [
    AccountController,
    AccountProfileController,
    AccountPublicController,
  ],
  providers: [
    AccountService,
    AccountRepository,
    AccountSubscriber,
    // AccountListener,
    AccountEvent,
  ],
  exports: [AccountService, AccountRepository],
})
export class AccountModule {}
