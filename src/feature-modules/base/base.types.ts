import { CODE } from 'common/types';

export interface IBaseServiceData {
    code: CODE;
    status: number;
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    updatedBy: string;
}

export interface IResponseDataList<Data extends IBaseServiceData> {
    total: number;
    data: Array<Data>;
}
