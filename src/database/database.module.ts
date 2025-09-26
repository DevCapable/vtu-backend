import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomNamingStrategy } from '@app/database/strategies/custom-naming-strategy';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'oracle',
        host: configService.getOrThrow('ORACLE_HOST'),
        port: configService.getOrThrow('ORACLE_PORT'),
        sid: configService.getOrThrow('ORACLE_SID'),
        database: configService.getOrThrow('ORACLE_DATABASE'),
        username: configService.getOrThrow('ORACLE_USERNAME'),
        password: configService.getOrThrow('ORACLE_PASSWORD'),
        synchronize: false,
        autoLoadEntities: true,
        namingStrategy: new CustomNamingStrategy(),
        poolMax: 100, // maximum number of connections in the pool
        poolIncrement: 100, // number of connections to be opened when needed
        poolTimeout: 1200, // time (in seconds) that idle connections will be closed
        queueTimeout: 120000, // time (in milliseconds) that requests will wait in the queue before timing out
        extra: {
          queueMax: 100000,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [],
})
export class DatabaseModule {}
