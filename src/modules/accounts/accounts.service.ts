import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { AccountDto } from './accounts.dto';
import { Account } from './accounts.entity';
import { AccountsRepository } from './accounts.repository';
import { DataEntityFactory } from 'modules/base';
import { ID } from 'src/common/constants';
import { ICriteria, ISelect, IFilter, ErrorMessages } from 'src/common/constants';
import { IFindEntitiesResult, IFindDtosResult } from 'modules/base';
import { ISignin, IAccessInfo, IAccountInfo } from './accounts.interface';

@Injectable()
export class AccountsService {

    constructor(
        private jwtService: JwtService,

        protected repository: AccountsRepository,

        protected dataEntityFactory: 
            DataEntityFactory<AccountDto, Account>,

    ) { }

    async signIn(signInDto: ISignin): Promise<IAccessInfo> {
        try {

            const { 
                username = '', 
                // email = '', 
                phone, password: pass 
            } = signInDto;

            // Account        
            const filters: IFilter[] = [];

            if (username) {
                filters.push({ username });
            }

            // if (email) {
            //     filters.push({ email });
            // }

            if (phone) {
                filters.push({ phone });
            }
            
            const account = await this.findOne(filters);
            console.log('======================== UserAuthService signIn account ', 
                account)
            if (!account) {
                throw new UnauthorizedException();
                // NotFoundException
            }

            const { password = '', roleId } = account;

            if (password !== pass) {
                throw new UnauthorizedException();
            }

            // Generate access token
            const jwtPayload: IAccountInfo 
                = {
                // accountId
                username, roleId
            }

            const jwtSignOption: JwtSignOptions = {
                expiresIn: '1h'
            }

            const accessToken: string 
                = await this.jwtService.signAsync(jwtPayload, jwtSignOption);

            const accessInfo: IAccessInfo = { accessToken };

            return accessInfo;
        } catch (err) {
            throw err;
        }
    }

    async register(accountDto: AccountDto): Promise<void> {

        try {
            // 
            const { username, phone, email } = accountDto;
    
            // Check if account existed
            const filters: IFilter[] = [
                { username },
                { email }, 
                { phone } 
            ];
            const select: ISelect = ['id'];
    
            const account: AccountDto | null
                = await this.findOne(filters, select);
                // = await this.findOne(findAccountOptions);
                    
            console.log('======================== account ', 
                account)

            // A salted one-way hash algorithm
            
            if (account) {
                // throw new BadRequestException(`Account ${ErrorMessages.EXISTED_POSTFIX}`);
                // throw new BadRequestException(`Account ${ErrorMessages.EXISTED_POSTFIX}`);
                throw new ConflictException(`Account ${ErrorMessages.EXISTED_POSTFIX}`);
            }
            
            // // Insert account
            await this.insertOne(accountDto);
            
        } catch (err) {
            console.log('================== UserAuthService register err', err)
            throw err;
        }
    }

    async insertOne(accountDto: AccountDto) {
        try {
            const accountEntity: Account
                = this.dataEntityFactory.convertDtoToEntity(accountDto);

            if (accountDto.password) {
                
            }

            const newEntity 
                = await this.repository.insertOne(accountEntity);

            const resDto: AccountDto 
                = this.dataEntityFactory.convertEntityToDto(newEntity);

            return resDto;
        } catch (err) {
            throw err;
        }
    }

    async findById(id: ID): Promise<AccountDto | null> {
        try {
  
            const accountEntity 
                = await this.repository.findById(id);

            if (!accountEntity || !Object.keys(accountEntity).length) {
                return null;
            }

            const resDto: AccountDto 
                = this.dataEntityFactory.convertEntityToDto(accountEntity);

            return resDto;
        } catch (err) {
            throw err;
        }
    }

    async findOne(filters: IFilter[], select?: ISelect): 
        Promise<AccountDto | null> {
        try {
  
            const accountEntity: Account 
                = await this.repository.findOne({ select, filters });
            
            if (!accountEntity || !Object.keys(accountEntity).length) {
                return null;
            }

            const resDto: AccountDto 
                = this.dataEntityFactory.convertEntityToDto(accountEntity);
            
            return resDto;
    
        } catch (err) {
            throw err;
        }
    }

    async findMany(criteria: ICriteria) {
    // Promise<IFindDtosResult<AccountDto>> {
        try {

            const findEntitiesResult: IFindEntitiesResult<Account> 
                = await this.repository.findMany(criteria);
            
            if (!findEntitiesResult || 
                !findEntitiesResult.data.length || 
                !findEntitiesResult.total) {

                const defaultResult = { data: [], total: 0 };
                return defaultResult;
            } 
            
            const { data: entities, total }: IFindEntitiesResult<Account> 
                = findEntitiesResult;

            // Convert Entity to Dto
            const resDtos: AccountDto[] 
                = this.dataEntityFactory.convertEntitiesToDtos(entities);

            const findManyDtosResult: IFindDtosResult<AccountDto> 
                = { data: resDtos, total };
            
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

    async updateById(
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

    async deleteById(id: ID) {
        try {
            
            await this.repository.deleteById(id);

        } catch (err) {
            throw err;
        }
    }
}
