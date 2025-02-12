import { IBaseServiceData } from 'src/feature-modules/base';

export interface ITransaction extends IBaseServiceData {
    title?: string;
    type?: string;
}

export interface ICreateTransaction {
    title?: string;
    type?: string;
}
