import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { HttpErrorMessages, IResponseBody, ENV_LABELS } from '../constant';
import { Response } from 'express';
import { MongooseError } from 'mongoose';

type ExceptionType = HttpException | Error | MongooseError;

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    private readonly logger = new Logger(AllExceptionsFilter.name, 
        // { timestamp: true }
    );

    constructor(private readonly httpAdapterHost: HttpAdapterHost) { }

    catch(exception: ExceptionType, host: ArgumentsHost) {
        // In certain situations `httpAdapter` might not be available in the
        // constructor method, thus we should resolve it here.
        const { httpAdapter } = this.httpAdapterHost;

        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        let statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR;
        let message: string = exception.message // || HttpErrorMessages.INTERNAL_SERVER_ERROR;
        const ENV = process.env.ENV;

        if (exception instanceof MongooseError) {
            
        }

        if (exception instanceof Error) {
            this.logger.error(message);
            if (ENV === ENV_LABELS.PROD) {
                message = HttpErrorMessages.INTERNAL_SERVER_ERROR;
            }
        }
        
        if (exception instanceof HttpException) {
            statusCode = exception.getStatus();
        } 

        response.status(statusCode);
        const responseBody: IResponseBody = {
            statusCode,
            message
        }
        
        httpAdapter.reply(response, responseBody);
    }
}
