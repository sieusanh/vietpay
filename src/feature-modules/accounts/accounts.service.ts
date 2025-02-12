import { Injectable } from '@nestjs/common';
import { AccountModel } from './accounts.model';
import { AccountsRepository } from './accounts.repository';
// import { DataEntityFactory } from 'modules/base';
import { ICriteria, IFindManyCriteria } from 'common/types';
import { IResponseDataList } from 'src/feature-modules/base';
import { IAccount, ICreateAccount } from './accounts.types';

@Injectable()
export class AccountsService {
    constructor(
        protected repository: AccountsRepository,

        // protected dataEntityFactory:
        //     DataEntityFactory<AccountDto, Account>,
    ) {}

    async createOne(newAccount: ICreateAccount): Promise<IAccount> {
        // const accountEntity: AccountEntity
        //     = this.dataEntityFactory.convertDtoToEntity(accountDto);

        // if (accountDto.password) {

        // }

        const accountEntity: AccountModel = newAccount as AccountModel;

        const newEntity: IAccount =
            await this.repository.insertOne(accountEntity);
        console.log(
            '================================ service createOne newEntity ',
            newEntity,
        );
        return newEntity;

        // const resDto: AccountDto
        //     = this.dataEntityFactory.convertEntityToDto(newEntity);

        // const resAccount: IAccount = newEntity as IAccount;
        // return resAccount;
    }

    async findOne(
        criteria: ICriteria,
        // filters: IFilter[],
        // select?: ISelect,
        // ): Promise<IResponseAccount | null> {
    ): Promise<IAccount> {
        const accountEntity: IAccount =
            await this.repository.findOne(criteria);

        if (!accountEntity || !Object.keys(accountEntity).length) {
            return null;
        }

        return accountEntity;

        // const account: IAccount = accountEntity as IAccount;

        // return account;
    }

    async findMany(
        criteria: IFindManyCriteria,
    ): Promise<IResponseDataList<IAccount>> {
        // Promise<IFindDtosResult<AccountDto>> {
        const findAccountList: IResponseDataList<IAccount> =
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

        // // Convert Entity to Dto
        // const resDtos: AccountDto[] =
        //     this.dataEntityFactory.convertEntitiesToDtos(entities);

        // const { data: entities, total } = findEntitiesResult;

        // const accounts: Array<IAccount> = entities as Array<IAccount>;

        // const findManyDtosResult: IResponseDataList<IAccount> = {
        //     data: accounts,
        //     total,
        // };

        // return findManyDtosResult;
    }

    // async createMany(entities: Dto[]): Promise<void> {
    //     const func = async function () {
    //         await this.queryRunnerFactory.save(entities[0]);
    //         await this.queryRunnerFactory.save(entities[1]);
    //     }
    //     await this.queryRunnerFactory.wrapTransaction(func);
    // }

    // async updateOne(code: CODE, updateAccountDto: UpdateAccountDto) {
    //     // const entity: Account
    //     // = this.dataEntityFactory.convertDtoToEntity(accountDto);

    //     await this.repository.updateOne(id, entity);
    // }

    // updateMany(
    //     FindManyOptions
    //     criteria: FindOptionsWhere<Dto>,
    //     dto: Dto
    // ): Promise<UpdateResult> {
    //     const partialDto: QueryDeepPartialDto<Dto>
    //         = dto as QueryDeepPartialDto<Dto>;

    //     const result = this.repository
    //         .update(criteria, partialDto)
    //         .then(res => res)
    //         .catch(err => err);
    //     return result;
    // }

    // async deleteOne(filter: IFilter) {
    //     await this.repository.deleteOne(code);
    // }
}
