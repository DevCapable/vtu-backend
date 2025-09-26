import { Inject, Injectable } from '@nestjs/common';

import IORedis from 'ioredis';

import type { ConfigType } from '@nestjs/config';
import jwtConfig from '../config/jwt.config';
import { getSessionKey } from '../authentication/utils';
import { APP_REDIS } from '@app/redis/constants';
import { InjectRedisConnection } from '@app/redis/decorators';

@Injectable()
export class SessionService {
  constructor(
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,

    @InjectRedisConnection(APP_REDIS)
    private redis: IORedis,
  ) {}

  async storeSession(userId: string, sessionId: string) {
    const sessionKey = getSessionKey(userId);
    const accessTokenTTL = this.jwtConfiguration.accessTokenTtl;
    return this.redis.setex(sessionKey, accessTokenTTL, sessionId);
  }

  async clearSession(userId: string) {
    return this.redis.del(getSessionKey(userId));
  }

  async validateSession(userId: string, userSessionId: string) {
    const sessionKey = getSessionKey(userId);
    const storedSessionId = await this.redis.get(sessionKey);

    if (!storedSessionId) return false;
    return storedSessionId === userSessionId;
  }

  async hasActiveSession(userId: string) {
    const sessionKey = getSessionKey(userId);
    return this.redis.exists(sessionKey);
  }
}
