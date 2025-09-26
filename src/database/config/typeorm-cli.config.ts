import { DataSource } from 'typeorm';
import { config as dotenvConfig } from 'dotenv';
import { CustomNamingStrategy } from '../strategies/custom-naming-strategy';

dotenvConfig();

export default new DataSource({
  type: 'oracle',
  host: process.env.ORACLE_HOST,
  port: parseInt(process.env.ORACLE_PORT, 10),
  sid: process.env.ORACLE_SID,
  database: process.env.ORACLE_DATABASE,
  username: process.env.ORACLE_USERNAME,
  password: process.env.ORACLE_PASSWORD,
  entities: ['dist/src/**/*.entity{.ts,.js}'],
  migrations: ['dist/src/database/migrations/*{.ts,.js}'],
  namingStrategy: new CustomNamingStrategy(),
  migrationsTableName: 'MIGRATIONS',
});
