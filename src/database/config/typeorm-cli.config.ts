import { DataSource } from 'typeorm';
import { config as dotenvConfig } from 'dotenv';
import { CustomNamingStrategy } from '../strategies/custom-naming-strategy';

dotenvConfig();

export default new DataSource({
  type: 'mysql',
  host: process.env.MYSQL_HOST,
  port: parseInt(process.env.MYSQL_PORT || '3306', 10),
  database: process.env.MYSQL_DATABASE,
  username: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  entities: ['dist/src/**/*.entity{.ts,.js}'],
  migrations: ['dist/src/database/migrations/*{.ts,.js}'],
  namingStrategy: new CustomNamingStrategy(),
  migrationsTableName: 'MIGRATIONS',
});
