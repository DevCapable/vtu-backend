import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          if (req && req.cookies) {
            return req.cookies['refresh_token'];
          }
          if (req.headers.authorization) {
            return req.headers.authorization.replace('Bearer', '');
          }
          return null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_REFRESH_SECRET || 'REFRESH_SECRET',
      passReqToCallback: true,
    });
  }
  validate(req: Request, payload: any) {
    const refreshToken =
      req.cookies?.['refresh_token'] ||
      req.headers?.authorization?.replace('Bearer ', '');

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }
    return {
      userId: payload.sub,
      email: payload.email,
      refreshToken,
    };
  }
}
