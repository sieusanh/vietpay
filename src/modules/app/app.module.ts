import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { APP_FILTER, APP_PIPE, APP_GUARD, APP_INTERCEPTOR, RouterModule, Routes } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountsModule } from 'modules/accounts/accounts.module';
import { TransactionsModule } from 'modules/transactions/transactions.module';
import { LoggerModule } from 'common/log/module.log';
// import * as cors from 'cors';
// import helmet from 'helmet';
import { AllExceptionsFilter, HttpExceptionFilter } from 'src/common/exception';
import { ValidationPipe, RolesGuard, 
    LoggingInterceptor, 
    AuthGuard 
} from 'src/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configuration, validate } from 'common/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { ApiConfigService, ITypeOrmDatasource, IMongooseDatasource, CONFIG_KEYS } from 'common/config';

@Module({
    imports: [
        LoggerModule,
        AccountsModule,
        TransactionsModule,
        TypeOrmModule.forRootAsync({
            // imports: [ConfigModule],
            useFactory: (config: ConfigService) => 
                config.get<ITypeOrmDatasource>(CONFIG_KEYS.TYPEORM_DATASOURCE, { infer: true }),
            inject: [ConfigService]
        }),
        MongooseModule.forRootAsync({
            useFactory: (config: ConfigService) => 
                config.get<IMongooseDatasource>(CONFIG_KEYS.MONGOOSE_DATASOURCE, { infer: true }),
            inject: [ConfigService]
        }),
        ConfigModule.forRoot({
            isGlobal: true,
            validate,
            load: [configuration],
            cache: true
        }),
        
    ],
    controllers: [
        AppController
    ],
    providers: [
        {
          provide: APP_FILTER,
          useClass: AllExceptionsFilter, 
        },
        {
          provide: APP_PIPE,
          useClass: ValidationPipe,
        },
        {
            provide: APP_GUARD,
            useClass: AuthGuard,
        },
        {
          provide: APP_GUARD,
          useClass: RolesGuard,
        },
        // {
        //   provide: APP_INTERCEPTOR,
        //   useClass: LoggingInterceptor
        // },
        AppService,
        ApiConfigService,
    ],
})
export class AppModule {}
