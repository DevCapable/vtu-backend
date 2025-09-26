import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { CustomNamingStrategy } from '@app/database/strategies/custom-naming-strategy';

config();

const configService = new ConfigService();

export const dataSourceOptions: DataSourceOptions = {
  migrationsTableName: 'MIGRATIONS',
  type: 'oracle',
  host: configService.getOrThrow('ORACLE_HOST'),
  database: configService.getOrThrow('ORACLE_DATABASE'),
  port: configService.getOrThrow('ORACLE_PORT'),
  sid: configService.getOrThrow('ORACLE_SID'),
  username: configService.getOrThrow('ORACLE_USERNAME'),
  password: configService.getOrThrow('ORACLE_PASSWORD'),
  logging: true,
  extra: {
    queueMax: 100000,
    poolMax: 150,
    poolMin: 10,
    poolTimeout: 1200,
    poolIncrement: 100,
  },
  synchronize: false,
  migrations: ['migrations/**'],
  entities: ['dist/src/**/*.entity{.ts,.js}'],
  namingStrategy: new CustomNamingStrategy(),
};

export const seedDataSourceOptions: DataSourceOptions = {
  ...dataSourceOptions,
  logging: ['error', 'warn'],
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
