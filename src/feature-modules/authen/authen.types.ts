import { CODE } from 'common/types';

export class IRegistry {
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

export interface ISignIn {
    username: string;
    email?: string;
    phone?: string;
    password: string;
}

export interface IAccessInfo {
    accessToken: string;
}
