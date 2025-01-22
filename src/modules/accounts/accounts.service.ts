import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { AccountDto } from './accounts.dto';
import { AccountEntity } from './accounts.entity';
import { AccountsRepository } from './accounts.repository';
import { DataEntityFactory } from 'modules/base';
import { CODE } from 'src/common/constant';
import { ICriteria, ISelect, IFilter, ErrorMessages } from 'src/common/constant';
import { IFindEntitiesResult, IFindDtosResult } from 'modules/base';
import { IAccount, IAccountInfo } from './accounts.types';

@Injectable()
export class AccountsService {

    constructor(
        private jwtService: JwtService,

        protected repository: AccountsRepository,

        // protected dataEntityFactory: 
        //     DataEntityFactory<AccountDto, Account>,

    ) { }

    async createOne(reqAccount: ICreateAccount) {
        try {
            // const accountEntity: AccountEntity
            //     = this.dataEntityFactory.convertDtoToEntity(accountDto);

            // if (accountDto.password) {
                
            // }

            const accountEntity: AccountEntity = reqAccount as AccountEntity;

            const newEntity 
                = await this.repository.insertOne(accountEntity);

            const resAccount: IAccount = newEntity as IAccount;
            
            
            // const resDto: AccountDto 
            //     = this.dataEntityFactory.convertEntityToDto(newEntity);

            return resAccount; 
        } catch (err) {
            throw err;
        }
    }

    async findOne(filters: IFilter[], select?: ISelect): 
        Promise<IAccount | null> {
        try {
  
            const accountEntity: AccountEntity 
                = await this.repository.findOne({ select, filters });
            
            if (!accountEntity || !Object.keys(accountEntity).length) {
                return null;
            }

            const account: IAccount = accountEntity as IAccount;

            return account;
    
        } catch (err) {
            throw err;
        }
    }

    async findMany(criteria: ICriteria) {
    // Promise<IFindDtosResult<AccountDto>> {
        try {

            const findEntitiesResult: IFindEntitiesResult<AccountEntity> 
                = await this.repository.findMany(criteria);
            
            if (!findEntitiesResult || 
                !findEntitiesResult.data.length || 
                !findEntitiesResult.total) {

                const defaultResult = { data: [], total: 0 };
                return defaultResult;
            } 
            
            const { data: entities, total }: IFindEntitiesResult<AccountEntity> 
                = findEntitiesResult;

            const accounts: Array<IAccount> = entities as Array<IAccount>;

            // Convert Entity to Dto
            const resDtos: AccountDto[] 
                = this.dataEntityFactory.convertEntitiesToDtos(entities);

            const findManyDtosResult: IFindDtosResult<AccountDto> 
                = { data: accounts, total };
            
            return findManyDtosResult;
        } catch (err) {
            throw err;
        }
    }

        // async createMany(entities: Dto[]): Promise<void> {
    //     const func = async function () {
    //         await this.queryRunnerFactory.save(entities[0]);
    //         await this.queryRunnerFactory.save(entities[1]);
    //     }
    //     await this.queryRunnerFactory.wrapTransaction(func);
    // }

    async updateOne(
        id: ID, 
        accountDto: AccountDto
    ) {
        try {
            const entity: Account 
            = this.dataEntityFactory.convertDtoToEntity(accountDto);

            await this.repository.updateById(id, entity);

        } catch (err) {
            throw err;
        }
    }

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

    async deleteOne(code: CODE) {
        try {
            
            await this.repository.deleteOne(code);

        } catch (err) {
            throw err;
        }
    }
}
