import { Request } from 'express';
import { CODE } from 'common/types';

export interface ICurrentAccount {
    username: string;
    email?: string;
    phone?: string;
    fullName: string;
    avatar?: string;
    gender?: string;
    roleCode?: CODE;
}

export interface IRequestInfo extends Request {
    account: ICurrentAccount;
}
