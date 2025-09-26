import { AccountService } from '@app/account/account.service';
import { validateAccountId, generateCryptoString } from '@app/core/util';
// import {
//   ForgotPasswordDto,
//   ImpersonateAccountDto,
//   RegisterDto,
//   SwitchAccountDto,
// } from '@app/iam/authentication/dto';
import jwtConfig from '../../iam/config/jwt.config';
// import { UserService } from '@app/user/user.service';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
// import { UpdateUserProfileDto } from '@app/user/dto/update-user-profile.dto';
// import { ChangePasswordDto } from './dto/change.password.dto';
// import { UserRepository } from '@app/user/user.repository';
// import { HashingService } from '@app/user/hashing/hashing.service';
import { CurrentUserData, JwtPayload } from '../interfaces';
// import { ForgotPasswordEvent } from './events/forgot-password.event';
// import { AuditAction, EntityType } from '@app/audit-log/enum';
// import { AuditLogService } from '@app/audit-log/audit-log.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
// import { Events } from '@app/user/constants';
// import { SyncWorkflowEvent } from '@app/user/event';
import { AccountTypeEnum } from '@app/account/enums';
import { Account } from '@app/account/entities/account.entity';
// import { ErrorMessages } from './constants';
import { RolesHelper } from '@app/role/helpers';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
// import { SessionService } from '../session/session.service';
import { BaseService } from '@app/core/base/base.service';
import {
  CustomBadRequestException,
  CustomForbiddenException,
  CustomNotFoundException,
  CustomUnauthorizedException,
} from '@app/core/error';
// import { WorkflowService } from '@app/workflow/workflow.service';
import { ExternalLinkOriginEnum } from '../enum';
import { UserRepository } from '@app/users/user.repository';
import { UsersService } from '@app/users/users.service';
import { HashingService } from '@app/users/hashing/hashing.service';
import { ErrorMessages } from '@app/iam/authentication/constants';
// import { User } from '@app/user/entities/user.entity';
import type { ConfigType } from '@nestjs/config';
import { SessionService } from '@app/iam/session/session.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userService: UsersService,
    private readonly accountService: AccountService,
    private jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly hashingService: HashingService,
    // private readonly forgotPasswordEvent: ForgotPasswordEvent,
    // private readonly auditLogService: AuditLogService,
    private readonly sessionService: SessionService,
    // private readonly workflowService: WorkflowService,
    private eventEmitter: EventEmitter2,
  ) {}

  // async register(data: RegisterDto) {
  //   try {
  //     await this.accountService.create({
  //       ...data,
  //       accountType: AccountTypeEnum.INDIVIDUAL,
  //     });
  //   } catch (error) {
  //     if (error && error.code === 'ER_DUP_ENTRY') {
  //       throw new CustomBadRequestException(
  //         'User with that email already exists',
  //       );
  //     }
  //     throw error;
  //   }
  // }

  async validateUser(email, password) {
    return await this.userRepository.login(email, password);
  }

  async login(user: any, data) {
    let accountId = data.accountId || null;
    const sessionKey = user.email;

    if (validateAccountId(accountId, user.accounts))
      throw new CustomBadRequestException('Invalid Account Specified');

    if (!user?.accounts)
      throw new CustomNotFoundException('No Accounts created for user');

    // await this.sessionService.clearSession(sessionKey);
    // await this.removeRefreshToken(user?.email);
    // const hasActiveSession =
    //   await this.sessionService.hasActiveSession(sessionKey);
    //
    // if (hasActiveSession)
    //   throw new CustomUnauthorizedException(
    //     ErrorMessages.ExistingSessionForUser,
    //     'ERR_ACT_SESS_EXIST',
    //   );

    let accountType;
    let accountAgencyPosition;
    // if the accountId is empty, set it to the first account on the user's list of accounts
    if (!accountId) {
      accountId = user.accounts[0].id;
      accountType = user.accounts[0].type;
      // accountAgencyPosition = user.accounts[0]?.admin?.position;
    } else {
      accountType = user.accounts.find(
        (account) => account.id === accountId,
      ).type;
    }

    const sessionId = await generateCryptoString(16);

    const { accessToken, refreshToken } = await this.getTokens(user.id, {
      email: user.email,
      currentAccountId: accountId,
      currentAccountType: accountType,
      // currentAccountAgencyPosition: accountAgencyPosition || '',
      session: sessionId,
    });

    const hashedRt = await this.hashingService.hash(refreshToken);

    // await this.userRepository.update(user.id, {
    //   lastLogin: new Date(),
    //   uuid: uuidv4(),
    //
    //   hashedRt,
    // });

    await this.sessionService.storeSession(sessionKey, sessionId);

    return { accessToken, refreshToken };
  }

  async logout(user: CurrentUserData, externalOrigin: string | null) {
    const email = user.email;
    const sessionKey = user.email;

    await this.sessionService.clearSession(sessionKey);
    await this.removeRefreshToken(email);
    // await this.workflowService.clearToken(email);
  }

  // async forgotPassword(payload: ForgotPasswordDto) {
  //   try {
  //     const { email } = payload;
  //
  //     if (!email) {
  //       throw new CustomBadRequestException('Email is required');
  //     }
  //
  //     const user = await this.userRepository.findFirst({
  //       email,
  //     });
  //     if (!user) {
  //       throw new CustomBadRequestException(
  //         'Invalid email or password reset is not allowed.',
  //       );
  //     }
  //
  //     const resetToken = await this.userService.generateToken(user.id);
  //
  //     await this.forgotPasswordEvent.forgotPasswordEvent({
  //       token: resetToken.token,
  //       user,
  //     });
  //     return {
  //       message: 'Password reset instructions have been sent to your email.',
  //     };
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  async updateUser(user: any, data: any) {
    await this.userService.update(user.id, data);
    const updatedFields = Object.keys(data)
      .filter((key) => data[key] !== undefined)
      .map((key) => key.charAt(0).toUpperCase() + key.slice(1))
      .join(', ');

    const message = updatedFields
      ? `Your ${updatedFields} ${
          updatedFields.includes(',') ? 'have' : 'has'
        } been updated.`
      : 'No fields were updated.';
    return { message };
  }

  // async changePassword(user: any, changePassword: any) {
  //   try {
  //     return await this.userService.changePassword(user.id, changePassword);
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  async refreshTokens(payload, externalOrigin?: string) {
    const user: any = await this.userRepository.findOne(
      {
        email: payload.user.email,
      },
      ['accounts', 'accounts.admin'],
    );

    if (!user) throw new CustomForbiddenException('Access Denied');

    const isRefreshTokenMatching = await this.hashingService.compare(
      payload.user.refreshToken,
      user.hashedRt,
    );

    if (!isRefreshTokenMatching)
      throw new CustomUnauthorizedException('Invalid Token');

    await this.jwtService.verifyAsync(payload.user.refreshToken, {
      secret: this.jwtConfiguration.refresh_secret,
    });

    const sessionId = await generateCryptoString(16);

    const tokens = await this.getTokens(user.id, {
      email: user.email,
      currentAccountId: user.accounts[0].id,
      currentAccountType: user.accounts[0].type,
      session: sessionId,
    });

    const sessionKey = externalOrigin
      ? `${user.email}:${externalOrigin}`
      : user.email;

    await this.sessionService.storeSession(sessionKey, sessionId);

    await this.userRepository.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async removeRefreshToken(email) {
    // TODO - [Perfomance Improvement] This can be an atomic request
    // const updateResult = await Repository.update({ email }, { hashedRt: null });
    // if (updateResult.affected === 0) throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);

    const user: any = await this.userRepository.findFirst({ email });
    if (!user) {
      throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    }
    this.userRepository.update(user.id, {
      hashedRt: null,
    });
  }

  async impersonateAccount(impersonateAccountDto: any) {
    const requestingUser = BaseService.getCurrentUser();

    if (
      !RolesHelper.hasAdminRole(requestingUser.roles) ||
      requestingUser.account.type !== AccountTypeEnum.ADMIN
    )
      throw new CustomUnauthorizedException();

    const { userId, accountId } = impersonateAccountDto;

    const user: any = await this.userRepository.findOne(userId, [
      'roles',
      'accounts',
      'accounts.admin',
    ]);

    if (!user) throw new CustomNotFoundException(ErrorMessages.UserNotFound);

    if (requestingUser.id === user.id)
      throw new CustomForbiddenException(
        ErrorMessages.SelfImpersonationForbidden,
      );

    let account: Account | null = user.accounts[0] || null;

    if (accountId) {
      account = user.accounts.find((account) => account.id === accountId);

      if (!account)
        throw new CustomUnauthorizedException(ErrorMessages.InvalidAccount);
    }

    await this.sessionService.clearSession(requestingUser.email);

    if (account) {
      const { accessToken } = await this.getTokens(user.id, {
        email: user.email,
        currentAccountId: account.id as number,
        currentAccountType: account.type,
        // currentAccountAgencyPosition: account.admin?.position || '',
      });

      // this.auditLogService.emitAction({
      //   entityId: user.id.toString(),
      //   entityTitle: user.firstName + ' ' + user.lastName,
      //   entityType: EntityType.USER,
      //   userId: requestingUser.id,
      //   action: AuditAction.IMPERSONATE,
      //   changes: null,
      //   ipAddress: requestingUser.ipAddress,
      // });

      return { accessToken };
    }
  }

  async switchAccount({ accountId }: any) {
    const user: any = BaseService.getCurrentUser();

    const account = user.accounts.find((account) => account.id === accountId);
    if (!account)
      throw new CustomUnauthorizedException(ErrorMessages.InvalidAccount);

    const { accessToken, refreshToken } = await this.getTokens(user.id, {
      email: user.email,
      currentAccountId: account.id,
      currentAccountType: account.type,
      // currentAccountAgencyPosition: account.admin?.position || '',
    });

    // this.auditLogService.emitAction({
    //   entityId: user.id.toString(),
    //   entityTitle: user.firstName + ' ' + user.lastName,
    //   entityType: EntityType.USER,
    //   userId: user.id,
    //   action: AuditAction.SWITCH_ACCOUNT,
    //   changes: null,
    //   ipAddress: user.ipAddress,
    // });

    return { accessToken, refreshToken };
  }

  getRefreshTokenOptions() {
    return this.getTokenOptions();
  }

  private getTokenOptions() {
    const options: JwtSignOptions = {
      secret: this.jwtConfiguration.refresh_secret,
    };

    const expiration = this.jwtConfiguration.refreshTokenTtl;

    if (expiration) options.expiresIn = expiration;

    return options;
  }

  async getTokens(userId: number, payload: JwtPayload) {
    const [accessToken, refreshToken] = await Promise.all([
      this.signToken<JwtPayload>(userId, this.jwtConfiguration.accessTokenTtl, {
        email: payload.email,
        currentAccountId: payload.currentAccountId,
        currentAccountType: payload.currentAccountType,
        // currentAccountAgencyPosition:
        //   payload.currentAccountAgencyPosition || '',
        session: payload.session,
      }),
      this.signToken<JwtPayload>(
        userId,
        this.jwtConfiguration.refreshTokenTtl,
        {
          email: payload.email,
          currentAccountId: payload.currentAccountId,
          currentAccountType: payload.currentAccountType,
          // currentAccountAgencyPosition:
          //   payload.currentAccountAgencyPosition || '',
        },
        this.jwtConfiguration.refresh_secret,
      ),
    ]);
    return { accessToken, refreshToken };
  }

  private async signToken<T>(
    userId: number,
    expiresIn: number,
    payload?: T,
    secret = this.jwtConfiguration.secret,
  ) {
    return await this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret,
        expiresIn,
      },
    );
  }

  // private isNcdfAccess(user: User): boolean {
  //   return user.roles.some(
  //     (role) => role.slug === 'ncdf-super-admin' || role.slug === 'ncdf-access',
  //   );
  // }
}
