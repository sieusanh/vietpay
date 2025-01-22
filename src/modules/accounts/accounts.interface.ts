import { ID } from 'src/common';

export interface ISignin {
    username: string;
    // email?: string;
    phone?: string;
    password: string;
}

export interface IAccountInfo {
    username: string;
    roleId?: ID;
}

export interface IAccessInfo {
    accessToken: string;
}