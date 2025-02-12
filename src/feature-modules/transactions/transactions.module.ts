import { Module, Global } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { TransactionsRepository } from './transactions.repository';
import { MODULE_INFO } from './transactions.constant';
import { QueryParser } from 'common/factory';
import { Transactionschema } from './transactions.schema';
import { ConsoleService } from 'system-modules/log';

@Global()
@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: MODULE_INFO.NAME,
                schema: Transactionschema,
            },
        ]),
    ],
    controllers: [TransactionsController],
    providers: [
        TransactionsRepository,
        TransactionsService,
        QueryParser,
        ConsoleService,
    ],
    exports: [TransactionsService, TransactionsRepository],
})
export class TransactionsModule {}
