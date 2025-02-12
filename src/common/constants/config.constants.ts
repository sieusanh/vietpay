export enum ENVIRONMENT {
    DEVELOPMENT = 'dev',
    PRODUCTION = 'prod',
    STAGING = 'staging',
    TEST = 'test',
    PROVISION = 'prov',
}

export const CONFIG_KEYS = {
    JWT_SECRET_KEY: 'JWT_SECRET_KEY',
    TYPEORM_DATASOURCE: 'postgres',
    MONGOOSE_DATASOURCE: 'mongodb',
};
