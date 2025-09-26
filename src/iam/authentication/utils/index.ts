import { REDIS_KEY_PREFIXES } from '@app/redis/constants';

export function getSessionKey(userIdOrEmail: string) {
  return `${REDIS_KEY_PREFIXES.USER_SESSION}:${userIdOrEmail}`;
}
