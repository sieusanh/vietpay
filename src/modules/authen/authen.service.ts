import {
    Injectable,
    UnauthorizedException,
    ConflictException,
} from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { RegistryDto } from './authen.dto';
import { AccountEntity } from './accounts.entity';
import { AccountsService } from 'modules/accounts/accounts.service';
import { DataEntityFactory } from 'modules/base';
import { CODE } from 'common/constant';
import {
    ICriteria,
    ISelect,
    IFilter,
    ErrorMessages,
} from 'common/constant';
import { IFindEntitiesResult, IFindDtosResult } from 'modules/base';
import { IAccount } from 'modules/accounts/accounts.types';
import { IRegistry, ISignIn } from './authen.types';

@Injectable()
export class AuthenService {
    constructor(
        private jwtService: JwtService,

        protected accountsService: AccountsService,

        // protected dataEntityFactory:
        //     DataEntityFactory<RegistryDto, Account>,
    ) {}

    async register(registryBody: IRegistry): Promise<void> {
        try {
            //
            const { username, phone, email } = registryBody;

            // Check if account existed
            const filters: IFilter[] = [
                { username },
                { email },
                { phone },
            ];
            const select: ISelect = ['id'];

            const account: IAccount | null =
                await this.accountsService.findOne(filters, select);
            // = await this.findOne(findAccountOptions);

            console.log('======================== account ', account);

            // A salted one-way hash algorithm

            if (account) {
                throw new ConflictException(
                    `Account ${ErrorMessages.EXISTED_POSTFIX}`,
                );
            }

            // // Insert account
            await this.insertOne(RegistryDto);
        } catch (err) {
            console.log(
                '================== UserAuthService register err',
                err,
            );
            throw err;
        }
    }

    async signIn(signInBody: ISignIn): Promise<IAccessInfo> {
        try {
            const {
                username = '',
                // email = '',
                phone,
                password: pass,
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

            const account = await this.accountsService.findOne(filters);
            console.log(
                '======================== UserAuthService signIn account ',
                account,
            );
            if (!account) {
                throw new UnauthorizedException();
                // NotFoundException
            }

            const { password = '', roleId } = account;

            if (password !== pass) {
                throw new UnauthorizedException();
            }

            // Generate access token
            const jwtPayload: IAccountInfo = {
                // accountId
                username,
                roleId,
            };

            const jwtSignOption: JwtSignOptions = {
                expiresIn: '1h',
            };

            const accessToken: string = await this.jwtService.signAsync(
                jwtPayload,
                jwtSignOption,
            );

            const accessInfo: IAccessInfo = { accessToken };

            return accessInfo;
        } catch (err) {
            throw err;
        }
    }
}
