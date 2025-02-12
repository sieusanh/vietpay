import { Module, Global } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import { AccountsRepository } from './accounts.repository';
import { AccountSchema } from './accounts.schema';
import { DataEntityFactory } from 'src/feature-modules/base';
import { QueryParser } from 'common/factory';
import { MODULE_INFO } from './accounts.constant';
// import { EntityListenerFactory, QueryRunnerFactory } from 'src/common';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: MODULE_INFO.NAME,
                schema: AccountSchema,
            },
        ]),
    ],
    controllers: [AccountsController],
    providers: [
        AccountsRepository,
        AccountsService,
        DataEntityFactory,
        QueryParser,
        // EntityListenerFactory, QueryRunnerFactory
    ],
    exports: [AccountsService],
})
export class AccountsModule {}
