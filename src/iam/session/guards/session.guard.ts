import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CurrentUserData } from '@app/iam/interfaces';
import { IS_PUBLIC_KEY } from '@app/iam/decorators';
import { SessionService } from '../session.service';
import {
  CustomInternalServerException,
  CustomUnauthorizedException,
} from '@app/core/error';
import { ExternalLinkOriginEnum } from '@app/iam/enum';

@Injectable()
export class SessionGuard {
  constructor(
    private readonly reflector: Reflector,
    private readonly sessionService: SessionService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    const user: CurrentUserData | null = request.user;

    if (!user)
      throw new CustomInternalServerException(
        'This guard must be called after the JWT guard',
      );

    // Do not validate if no session information is in token
    // i.e For impersonated sessions, we do not store a session
    if (!user.session) return true;

    const originApp = request.get('X-Origin-Application');
    const externalOrigin = ExternalLinkOriginEnum[originApp];

    const sessionKey = externalOrigin
      ? `${user.email}:${externalOrigin}`
      : user.email;

    const isValidSession = await this.sessionService.validateSession(
      sessionKey,
      user.session,
    );

    if (!isValidSession) throw new CustomUnauthorizedException();

    return true;
  }
}
