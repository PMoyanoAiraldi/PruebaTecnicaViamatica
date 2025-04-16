import { DataSource, DataSourceOptions } from "typeorm";
import * as dotenv from 'dotenv';
import { registerAs } from "@nestjs/config";

dotenv.config({ path: '.env'});


const PostgresDataSource: DataSourceOptions = {
    type:'postgres',
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432', 10), 
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    ssl: false,
    synchronize: true,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    migrations:['./dist/migration/*{.ts,.js}'],
}

export const postgresDataSourceConfig = registerAs('postgres', () => PostgresDataSource)

export const connectionSource = new DataSource(PostgresDataSource as DataSourceOptions)