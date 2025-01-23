import { CODE } from 'src/common';

export interface IBaseInfo {
    code: CODE;
    status: number;
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    updatedBy: string;
}

export interface IResponseData<T> {
    total: number;
    data: Array<T>;
}
