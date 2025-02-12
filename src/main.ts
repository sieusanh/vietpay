import { NestFactory } from '@nestjs/core';
import { AppModule } from 'system-modules/app';
import {
    SwaggerModule,
    DocumentBuilder,
    SwaggerDocumentOptions,
} from '@nestjs/swagger';
import { LoggerMiddleware } from './common/middlewares';
// import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { CreateAccountDto } from 'src/feature-modules/accounts';
import { QueryOneParams, QueryManyParams, IApp } from 'common/types';
import * as cors from 'cors';
import helmet from 'helmet';
import { ConsoleService } from 'system-modules/log';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        // logger: false
        // logger: ['log', 'error', 'warn'] 'log', 'fatal', 'error', 'warn', 'debug', 'verbose'
        // logger: console
        // logger: new MyLogger()
        bufferLogs: true, // equivalent to logger: false
        // autoFlushLogs: false,
    });

    // Here are for functional-based LoggerMiddleware
    app.use(cors());
    app.use(helmet());
    app.use(LoggerMiddleware);
    app.setGlobalPrefix('api');
    // app.useLogger(app.get(LogService));
    const swaggerConfig = new DocumentBuilder()
        // .addBearerAuth()
        .setTitle('Demo NestJS')
        .setDescription('The API description')
        .setVersion('1.0')
        .addTag('demo')
        .build();

    const swaggerOptions: SwaggerDocumentOptions = {
        extraModels: [QueryOneParams, QueryManyParams, CreateAccountDto],
        //   autoTagControllers: true,
    };
    const document = () =>
        SwaggerModule.createDocument(app, swaggerConfig, swaggerOptions);

    SwaggerModule.setup('docs', app, document, {
        swaggerOptions: {
            docExpansion: 'none',
        },
        // jsonDocumentUrl: "swagger/json"
    });

    process.on('unhandledRejection', (error, promise) => {
        console.log(
            '====================== unhandledRejection promise ',
            promise,
        );
        throw error;
    });

    process.on('uncaughtException', async (error) => {
        const defaultMessage = 'Server failed.';
        if (error instanceof Error) {
            console.error(error?.message || defaultMessage);
        } else if (typeof error === 'string') {
            console.error(error || defaultMessage);
        }

        // process.exit(1);
    });

    // app.use(cookieParser());

    // Logging
    const logService = await app.resolve(ConsoleService);
    app.useLogger(logService);

    const configService = app.get(ConfigService);
    // const appPort = configService.get<string>('app.port');
    const appConfig = configService.get<IApp>('app');
    const appPort = appConfig?.port;

    await app.listen(appPort).catch((err) => {
        console.log('Server Error: ', err);
    });
}

bootstrap();
