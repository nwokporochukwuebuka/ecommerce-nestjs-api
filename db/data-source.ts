import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
config();

export const typeOrmConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/db/migrations/*{.ts,.js}'],
  logging: false,
  synchronize: false,
};

const dataSource = new DataSource(typeOrmConfig);

export default dataSource;
