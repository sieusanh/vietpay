import {
    Module,
    // NestModule,
    // MiddlewareConsumer,
    ClassSerializerInterceptor,
} from '@nestjs/common';
import {
    APP_FILTER,
    // APP_PIPE,
    APP_GUARD,
    APP_INTERCEPTOR,
    // RouterModule,
    // Routes,
} from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthenModule } from 'feature-modules/authen/authen.module';
import { AccountsModule } from 'feature-modules/accounts/accounts.module';
import { TransactionsModule } from 'feature-modules/transactions/transactions.module';
// import * as cors from 'cors';
// import helmet from 'helmet';
import {
    AllExceptionsFilter,
    // HttpExceptionFilter,
} from 'common/exception';
import {
    // RolesGuard,
    AuthGuard,
} from 'common/guards';
import { LoggingInterceptor } from 'common/interceptors';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
    ApiConfigService,
    configuration,
    // validate
} from 'common/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { CONFIG_KEYS } from 'common/constants';
import { ITypeOrmDatasource, IMongooseDatasource } from 'common/types';

@Module({
    imports: [
        AuthenModule,
        AccountsModule,
        TransactionsModule,
        TypeOrmModule.forRootAsync({
            // imports: [ConfigModule],
            useFactory: (config: ConfigService) =>
                config.get<ITypeOrmDatasource>(
                    CONFIG_KEYS.TYPEORM_DATASOURCE,
                    {
                        infer: true,
                    },
                ),
            inject: [ConfigService],
        }),
        MongooseModule.forRootAsync({
            useFactory: (config: ConfigService) =>
                config.get<IMongooseDatasource>(
                    CONFIG_KEYS.MONGOOSE_DATASOURCE,
                    {
                        infer: true,
                    },
                ),
            inject: [ConfigService],
        }),
        ConfigModule.forRoot({
            // envFilePath: ['.env.development'],
            ignoreEnvFile: true,
            isGlobal: true,
            load: [configuration],
            // validate,
            // cache: true,
        }),
    ],
    controllers: [AppController],
    providers: [
        {
            provide: APP_FILTER,
            useClass: AllExceptionsFilter,
        },
        // {
        //     provide: APP_PIPE,
        //     useClass: ValidationPipe,
        // },
        {
            provide: APP_GUARD,
            useClass: AuthGuard,
        },
        // {
        //     provide: APP_GUARD,
        //     useClass: RolesGuard,
        // },
        {
            provide: APP_INTERCEPTOR,
            useClass: LoggingInterceptor,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: ClassSerializerInterceptor,
        },
        AppService,
        ApiConfigService,
    ],
})
export class AppModule {}
