import { Injectable } from '@nestjs/common';
import { TransactionDto } from './transactions.dto';
import { TransactionModel } from './transactions.model';
import { TransactionsRepository } from './transactions.repository';
import { DataModelFactory } from 'modules/base';
import { ICriteria, ISelect, IFilter, CODE } from 'src/common/constant';
import { IFindModelsResult, IFindDtosResult } from 'modules/base';
import { ConsoleService } from 'common/log';

@Injectable()
export class TransactionsService {

    constructor(
        protected repository: TransactionsRepository,

        protected dataModelFactory: 
            DataModelFactory<TransactionDto, TransactionModel>,
        private consoleService: ConsoleService,
    ) {
        this.consoleService.setContext(TransactionsService.name);
    }

    async insertOne(TransactionDto: TransactionDto) {
        try {
            const TransactionEntity: TransactionModel
                = this.dataModelFactory.convertDtoToModel(TransactionDto);

            const newModel 
                = await this.repository.insertOne(TransactionEntity);

            const resDto: TransactionDto 
                = this.dataModelFactory.convertModelToDto(newModel);

            return resDto;
        } catch (err) {
            throw err;
        }
    }

    async findOne(filters: IFilter[], select?: ISelect): 
        Promise<TransactionDto | null> {
        try {
  
            const TransactionModel = await this.repository.findOne(
                { select, filters }
            );
            
            if (!TransactionModel || !Object.keys(TransactionModel).length) {
                return null;
            }

            const resDto: TransactionDto 
                = this.dataModelFactory.convertModelToDto(TransactionModel);
            
            return resDto;
    
        } catch (err) {
            throw err;
        }
    }

    async findMany(criteria: ICriteria) {
    // Promise<IFindDtosResult<TransactionDto>> {
        try {
            const findModelsResult: IFindModelsResult<TransactionModel> 
                = await this.repository.findMany(criteria);

            if (!findModelsResult || 
                !findModelsResult.data.length || 
                !findModelsResult.total) {

                const defaultResult = { data: [], total: 0 };
                return defaultResult;
            } 
            
            const { data: entities, total }: IFindModelsResult<TransactionModel> 
                = findModelsResult;

            // Convert Entity to Dto
            const resDtos: TransactionDto[] 
                = this.dataModelFactory.convertModelsToDtos(entities);

            const findManyDtosResult: IFindDtosResult<TransactionDto> 
                = { data: resDtos, total };
            
            return findManyDtosResult;
        } catch (err) {
            throw err;
        }
    }

    async countByCity(criteria: ICriteria) {
        // const { filters } = criteria;

        const findModelsResult: IFindModelsResult<TransactionModel> 
                = await this.repository.findMany(criteria);

        const identityKey = 'city';
        await this.repository.groupBy(criteria, identityKey);
    }

    // async updateById(
    //     id: ID, 
    //     TransactionDto: TransactionDto
    // ) {
    //     try {
    //         const model: Transaction 
    //         = this.dataModelFactory.convertDtoToModel(TransactionDto);

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
