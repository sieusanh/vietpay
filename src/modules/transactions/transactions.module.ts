import { Module, Global } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { TransactionsRepository } from './transactions.repository';
import { MODULE_INFO } from './transactions.constant';
import { DataModelFactory } from 'modules/base';
import { QueryParser } from 'common/http';
import { Transactionschema } from './transactions.schema';
import { LoggerModule, ConsoleService } from 'common/log';

@Global()
@Module({
    imports: [
        MongooseModule.forFeature([{ 
            name: MODULE_INFO.NAME, 
            schema: Transactionschema,
        }]),
        LoggerModule,
    ],
    controllers: [TransactionsController],
    providers: [    
        TransactionsRepository,
        TransactionsService, 
        DataModelFactory,
        QueryParser,
        ConsoleService,
    ],
    exports: [
        TransactionsService,
        TransactionsRepository,
    ]
})
export class TransactionsModule {}
