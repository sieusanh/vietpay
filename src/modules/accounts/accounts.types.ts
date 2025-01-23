import { CODE } from 'common/constant';
import { IBaseInfo } from 'modules/base';

export interface IAccount extends IBaseInfo {
    code: CODE;
    username: string;
    email?: string;
    phone?: string;
    password: string;
    fullName: string;
    avatar?: string;
    gender?: string;
    role_code?: CODE;
    lastLoginAt?: Date;
}

export interface ICreateAccount {
    username: string;
    email?: string;
    phone?: string;
    password: string;
    fullName: string;
    avatar?: string;
    gender?: string;
    role_code?: CODE;
    lastLoginAt?: Date;
}