import { Injectable } from '@nestjs/common';
import { TransactionModel } from './transactions.model';
import { TransactionsRepository } from './transactions.repository';
import { ICriteria, IFindManyCriteria } from 'common/types';
import { IResponseDataList } from 'src/feature-modules/base';
import { ConsoleService } from 'system-modules/log';
import { ICreateTransaction, ITransaction } from './transactions.types';

@Injectable()
export class TransactionsService {
    constructor(
        protected repository: TransactionsRepository,
        private consoleService: ConsoleService,
    ) {
        this.consoleService.setContext(TransactionsService.name);
    }

    async createOne(
        newTransaction: ICreateTransaction,
    ): Promise<ITransaction> {
        const transactionEntity: TransactionModel =
            newTransaction as TransactionModel;

        const newEntity: ITransaction =
            await this.repository.insertOne(transactionEntity);

        return newEntity;
    }

    async findOne(criteria: ICriteria): Promise<ITransaction> {
        const transactionEntity = await this.repository.findOne(criteria);

        if (!transactionEntity || !Object.keys(transactionEntity).length) {
            return null;
        }

        return transactionEntity;
    }

    async findMany(
        criteria: IFindManyCriteria,
    ): Promise<IResponseDataList<ITransaction>> {
        // Promise<IFindDtosResult<TransactionDto>> {
        const findAccountList: IResponseDataList<ITransaction> =
            await this.repository.findMany(criteria);

        if (
            !findAccountList ||
            !findAccountList.data.length ||
            !findAccountList.total
        ) {
            const defaultResult = { data: [], total: 0 };
            return defaultResult;
        }

        return findAccountList;
    }

    // async countByCity(filters: IFilter[]) {
    //     // const { filters } = criteria;

    //     const findAccountList: IResponseDataList<ITransaction> =
    //         await this.repository.count(filters);

    //     const identityKey = 'city';
    //     await this.repository.groupBy(criteria, identityKey);
    // }

    // async updateById(
    //     id: ID,
    //     TransactionDto: TransactionDto
    // ) {
    //     try {
    //         await this.repository.updateById(id, model);

    //     } catch (err) {
    //         throw err;
    //     }
    // }

    // async deleteById(id: ID) {
    //     try {

    //         await this.repository.deleteById(id);

    //     } catch (err) {
    //         throw err;
    //     }
    // }

    /*
    async createMany(entities: Dto[]): Promise<void> {
        const func = async function () {
            await this.queryRunnerFactory.save(entities[0]);
            await this.queryRunnerFactory.save(entities[1]);
        }
        await this.queryRunnerFactory.wrapTransaction(func);
    }

    updateMany(
        FindManyOptions
        criteria: FindOptionsWhere<Dto>, 
        dto: Dto
    ): Promise<UpdateResult> {
        const partialDto: QueryDeepPartialDto<Dto> 
            = dto as QueryDeepPartialDto<Dto>; 

        const result = this.repository
            .update(criteria, partialDto)
            .then(res => res)
            .catch(err => err);
        return result; 
    }
*/
}
