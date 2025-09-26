import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { UserRepository } from '@app/users/user.repository';
import jwtConfig from '../../../iam/config/jwt.config';
import type { ConfigType } from '@nestjs/config';
import { JwtPayload } from '../../../iam/interfaces';
import { AccountTypeEnum } from '@app/account/enums';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userRepository: UserRepository,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {
    const options: StrategyOptions = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConfiguration.secret ?? 'supersecret', // fallback secret
    };
    super(options);
  }

  async validate(payload: JwtPayload) {
    // Find user by email (or any unique identifier)
    const user = await this.userRepository.findFirstBy(
      { email: payload.email },
      [
        'accounts',
        // 'accounts.customer',
        // 'accounts.admin',
        'roles',
        // 'roles.permissions',
        'permissions',
      ],
    );

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Map all accounts
    const accounts = user.accounts.map((account) => ({
      id: account.id,
      uuid: account.uuid,
      createdAt: account.createdAt,
      updatedAt: account.updatedAt,
      name: account.name,
      type: account.type,
    }));

    // Find the current active account from the JWT payload
    const currentAccount = accounts.find(
      (a) => a.id === payload.currentAccountId,
    );

    if (!currentAccount) {
      throw new UnauthorizedException('Current account not found');
    }

    return {
      ...user,
      accounts,
      session: payload.session, // optional session info from JWT
      account: {
        id: currentAccount.id,
        type: currentAccount.type,
        // agencyPosition: payload.currentAccountAgencyPosition,
      },
    };
  }
}
