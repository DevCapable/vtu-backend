import {
  InjectionToken,
  ModuleMetadata,
  OptionalFactoryDependency,
} from '@nestjs/common';
import { RedisOptions } from 'ioredis';

export interface RedisModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  name?: string;
  useFactory?: (...args: any[]) => Promise<RedisOptions> | RedisOptions;
  inject?: (InjectionToken | OptionalFactoryDependency)[];
}
