import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { CustomNamingStrategy } from '@app/database/strategies/custom-naming-strategy';

config();

const configService = new ConfigService();

export const dataSourceOptions: DataSourceOptions = {
  migrationsTableName: 'MIGRATIONS',
  type: 'mysql',
  host: configService.getOrThrow('MYSQL_HOST'),
  database: configService.getOrThrow('MYSQL_DATABASE'),
  port: configService.getOrThrow('MYSQL_PORT'),
  username: configService.getOrThrow('MYSQL_USERNAME'),
  password: configService.getOrThrow('MYSQL_PASSWORD'),
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
