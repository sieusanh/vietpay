import { Request } from 'express';
import { CODE } from 'common/constant';

interface ICurrentAccount {
    username: string;
    email?: string;
    phone?: string;
    full_name: string;
    avatar?: string;
    gender?: string;
    roleCode?: CODE;
}

export interface IRequestInfo extends Request {
    account: ICurrentAccount;
}
