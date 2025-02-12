import {
    Injectable,
    UnauthorizedException,
    ConflictException,
} from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { AccountsService } from 'src/feature-modules/accounts/accounts.service';
import { ErrorMessages, JWT_EXPIRES_IN } from 'common/constants';
import {
    ISelect,
    IFilter,
    ICriteria,
    ICurrentAccount,
} from 'common/types';
// import { IFindEntitiesResult, IFindDtosResult } from 'modules/base';
import {
    IAccount,
    ICreateAccount,
} from 'src/feature-modules/accounts/accounts.types';
import { IRegistry, ISignIn, IAccessInfo } from './authen.types';

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
            const select: ISelect = ['code'];
            const criteria: ICriteria = {
                filters,
                select,
            };

            const account: IAccount | null =
                await this.accountsService.findOne(criteria);
            // = await this.findOne(findAccountOptions);

            console.log('======================== account ', account);

            // A salted one-way hash algorithm

            if (account) {
                throw new ConflictException(
                    `Account ${ErrorMessages.EXISTED_POSTFIX}`,
                );
            }

            const newAccount: ICreateAccount =
                registryBody as ICreateAccount;
            // // Insert account
            await this.accountsService.createOne(newAccount);
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
            } = signInBody;

            // Account
            const filters: IFilter[] = [];
            const criteria: ICriteria = {};

            if (username) {
                filters.push({ username });
            }

            // if (email) {
            //     filters.push({ email });
            // }

            if (phone) {
                filters.push({ phone });
            }
            criteria.filters = filters;

            const account = await this.accountsService.findOne(criteria);

            if (!account) {
                throw new UnauthorizedException();
                // NotFoundException
            }

            const { password = '', roleCode, fullName } = account;

            if (password !== pass) {
                throw new UnauthorizedException();
            }

            // Generate access token
            const jwtPayload: ICurrentAccount = {
                fullName,
                username,
                roleCode,
            };

            const jwtSignOption: JwtSignOptions = {
                expiresIn: JWT_EXPIRES_IN,
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
