import { DynamicModule, Module } from '@nestjs/common';
import IORedis, { RedisOptions } from 'ioredis';
import { RedisModuleAsyncOptions } from './interface';
import { getConnectionToken } from './utils';
export const REDIS_MODULE_OPTIONS = 'REDIS_MODULE_OPTIONS';

// With this construction, we can instantiate multiple redis instances
// This separation can help us accommodate a possible need to have various redis instances
// for specific purposes and scaled separately
@Module({})
export class RedisModule {
  static forRootAsync({
    name,
    useFactory,
    inject,
    imports,
  }: RedisModuleAsyncOptions): DynamicModule {
    const connectionToken = getConnectionToken(name);
    const connectionProvider = {
      provide: connectionToken,
      useFactory: (options: RedisOptions) => new IORedis(options),
      inject: [REDIS_MODULE_OPTIONS],
    };

    const optionsProvider: any = {
      provide: REDIS_MODULE_OPTIONS,
      useFactory,
      inject,
    };

    return {
      module: RedisModule,
      global: true,
      imports,
      providers: [optionsProvider, connectionProvider],
      exports: [connectionToken],
    };
  }
}
