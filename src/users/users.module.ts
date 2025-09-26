import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserRepository } from '@app/users/user.repository';
import { HashingService } from '@app/users/hashing/hashing.service';
import { BcryptService } from '@app/users/hashing/bcrypt.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@app/users/entities/user.entity';
import { UserVerification } from '@app/users/entities/user-verification.entity';
import { UserPassword } from '@app/users/entities/user-password.entity';
import { RoleModule } from '@app/role/role.module';
import { AccountModule } from '@app/account/account.module';
import { LoginAttempt } from '@app/users/entities/login-attempt.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      UserVerification,
      LoginAttempt,
      UserPassword,
    ]),
    // forwardRef(() => StaffModule),
    forwardRef(() => AccountModule),
    RoleModule,
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    UserRepository,
    // UserPasswordRepository,
    { provide: HashingService, useClass: BcryptService },
    // ResetPasswordEvent,
    // ResetPasswordListener,
    // SyncWorkflowListener,
  ],
  exports: [UserRepository, UsersService],
})
export class UsersModule {}
