import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import { AccountsRepository } from './accounts.repository';
import { AccountEntity } from './accounts.model';
import { DataEntityFactory } from 'modules/base';
import { QueryParser } from 'common/http';
// import { EntityListenerFactory, QueryRunnerFactory } from 'src/common';

@Global()
@Module({
    imports: [TypeOrmModule.forFeature([AccountEntity])],
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
