import { CODE } from 'src/common';

export class IRegistry {
    username: string;
    email?: string;
    phone?: string;
    password: string;
    full_name: string;
    avatar?: string;
    gender?: string;
    role_code?;
    last_login_at?: Date;
}

export interface ISignIn {
    username: string;
    email?: string;
    phone?: string;
    password: string;
}

export interface IAccountInfo {
    username: string;
    role_code?: CODE;
}

export interface IAccessInfo {
    accessToken: string;
}
