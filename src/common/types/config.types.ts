import { ENVIRONMENT } from '../constants';

export interface IApp {
    host: string;
    port: number;
}

export interface ITypeOrmDatasource {
    type: string;
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
    autoLoadEntities: boolean;
}

export interface IMongooseDatasource {
    uri: string;
}

export class EnvironmentVariables {
    NODE_ENV: ENVIRONMENT;

    // 0 - 65535
    PORT: number;
}
