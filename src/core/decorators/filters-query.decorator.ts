import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const FiltersQuery = createParamDecorator(
  (data, ctx: ExecutionContext) => {
    const req: Request = ctx.switchToHttp().getRequest();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { sortBy, limit, page, ...search } = req.query;

    const [sortKey, sortDir] = sortBy
      ? sortBy.toString().split('.')
      : ['createdAt', 'DESC'];

    return {
      sortKey,
      sortDir: sortDir && sortDir?.toUpperCase(),
      ...search,
    };
  },
);
