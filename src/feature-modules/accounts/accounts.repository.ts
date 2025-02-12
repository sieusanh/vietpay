import { Injectable } from '@nestjs/common';
import { BaseMongooseRepository } from 'src/feature-modules/base';
import { AccountModel } from './accounts.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model as MongooseModel } from 'mongoose';
import { MODULE_INFO } from './accounts.constant';
import { IAccount } from './accounts.types';

@Injectable()
export class AccountsRepository extends BaseMongooseRepository<
    AccountModel,
    IAccount
> {
    constructor(
        @InjectModel(MODULE_INFO.NAME)
        protected model: MongooseModel<AccountModel>,
    ) {
        super(model, MODULE_INFO.NAME);
    }

    getAccounts(): Promise<any> {
        const p = new Promise((resolve) => resolve('nothing'));
        return p;
    }
}
