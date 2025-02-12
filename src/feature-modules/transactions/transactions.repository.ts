import { Injectable } from '@nestjs/common';
import { BaseMongooseRepository } from '../base';
import { TransactionModel } from './transactions.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model as MongooseModel } from 'mongoose';
import { MODULE_INFO } from './transactions.constant';
import { ITransaction } from './transactions.types';

@Injectable()
export class TransactionsRepository extends BaseMongooseRepository<
    TransactionModel,
    ITransaction
> {
    constructor(
        @InjectModel(MODULE_INFO.NAME)
        protected model: MongooseModel<TransactionModel>,
    ) {
        super(model, MODULE_INFO.NAME);
    }

    getTransactions(): Promise<any> {
        const p = new Promise((resolve) => resolve('nothing'));
        return p;
    }
}
