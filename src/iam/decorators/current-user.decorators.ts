import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { REQUEST_USER_KEY } from '../iam.constant';
import { CurrentUserData } from '@app/iam/interfaces';

export const CurrentUser = createParamDecorator(
  (field: keyof CurrentUserData | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: CurrentUserData | undefined = request[REQUEST_USER_KEY];
    return field ? user?.[field] : user;
  },
);

export const CurrentUserIp = createParamDecorator(
  (_: undefined, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return (
      req.headers['x-forwarded-for']?.split(',')[0] ||
      req.socket?.remoteAddress ||
      req.ip
    );
  },
);
