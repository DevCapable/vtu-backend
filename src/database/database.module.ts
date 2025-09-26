import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { CustomNamingStrategy } from '@app/database/strategies/custom-naming-strategy';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => ({
        type: 'mysql',
        host: configService.getOrThrow('MYSQL_HOST'),
        port: configService.getOrThrow('MYSQL_PORT'),
        database: configService.getOrThrow('MYSQL_DATABASE'),
        username: configService.getOrThrow('MYSQL_USERNAME'),
        password: configService.getOrThrow('MYSQL_PASSWORD'),
        synchronize: false,
        autoLoadEntities: true,
        namingStrategy: new CustomNamingStrategy(),
        extra: {
          connectionLimit: 100, // max pool size
          queueLimit: 0, // unlimited queue
          waitForConnections: true,
        },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
