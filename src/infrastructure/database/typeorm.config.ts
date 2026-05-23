import { DataSource, DataSourceOptions } from 'typeorm';
import { env } from '@shared/constants/env';
import path from 'path';

const config: DataSourceOptions = {
  type: 'mysql',
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  synchronize: env.NODE_ENV === 'development',
  logging: env.NODE_ENV === 'development',
  entities: [path.join(__dirname, './entities/*.entity.{ts,js}')],
  migrations: [path.join(__dirname, './migrations/*.{ts,js}')],
};

export const AppDataSource = new DataSource(config);
