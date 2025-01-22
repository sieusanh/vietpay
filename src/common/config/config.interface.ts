

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