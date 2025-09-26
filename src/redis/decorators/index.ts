import { Inject } from '@nestjs/common';
import { getConnectionToken } from '../utils';

export const InjectRedisConnection = (name: string) =>
  Inject(getConnectionToken(name));
