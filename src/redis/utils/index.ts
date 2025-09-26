export function getConnectionToken(redisStoreName: string) {
  return `${redisStoreName}Connection`;
}
