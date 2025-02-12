import { Prop, Schema } from '@nestjs/mongoose';
import { BaseModel } from '../base';
import { DB_CODE } from 'common/types';
@Schema({
    // _id: false,
    timestamps: true,
    collection: 'transactions',
})
export class TransactionModel extends BaseModel {
    @Prop({
        unique: true,
        required: true,
    })
    code: DB_CODE;

    @Prop({
        required: false,
        type: 'string',
    })
    title?: string = '';

    @Prop({
        required: false,
        type: 'string',
    })
    type?: string = '';
}
