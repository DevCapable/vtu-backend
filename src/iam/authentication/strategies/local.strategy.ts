import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-local';
import { AuthenticationService } from '@app/iam/authentication/authentication.service';
import { CustomUnauthorizedException } from '@app/core/error';
import { PassportStrategy } from '@nestjs/passport';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authenticationService: AuthenticationService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: any, password) {
    const user = await this.authenticationService.validateUser(email, password);

    if (!user) {
      throw new CustomUnauthorizedException(
        'Authentication failed. Please check your credentials and try again.',
      );
    }
    return user;
  }
}
