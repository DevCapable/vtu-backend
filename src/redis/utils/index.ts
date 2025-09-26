export function getConnectionToken(redisStoreName: any) {
  return `${redisStoreName}Connection`;
}
