import { CODE } from 'common/types';
import { IBaseServiceData } from 'src/feature-modules/base';

export interface IAccount extends IBaseServiceData {
    username: string;
    email?: string;
    phone?: string;
    password: string;
    fullName: string;
    avatar?: string;
    gender?: string;
    roleCode?: CODE;
    lastLoginAt?: Date;
}
// export interface IResponseAccount extends IBaseResponseData {
//     username: string;
//     email?: string;
//     phone?: string;
//     password: string;
//     fullName: string;
//     avatar?: string;
//     gender?: string;
//     roleCode?: CODE;
//     lastLoginAt?: Date;
// }

export interface ICreateAccount {
    username: string;
    email?: string;
    phone?: string;
    password: string;
    fullName: string;
    avatar?: string;
    gender?: string;
    roleCode?: CODE;
    lastLoginAt?: Date;
}
