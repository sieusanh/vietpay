import { Prop, Schema } from '@nestjs/mongoose';
import { DB_CODE, STATUS_NUMBER } from 'common/types';

@Schema({ timestamps: true, _id: false })
export class BaseModel {
    @Prop({
        required: true,
        unique: true,
        // index: true,
        immutable: true,
    })
    code: DB_CODE;

    @Prop({
        type: Number,
        enum: STATUS_NUMBER,
        default: STATUS_NUMBER.ACTIVE,
    })
    status: number;
    // status: STATUS;

    @Prop({
        type: 'string',
        default: '',
        immutable: true,
    })
    createdBy: string;

    @Prop({
        type: 'string',
        default: '',
    })
    updatedBy: string;

    @Prop({
        type: Date,
        required: false,
        immutable: true,
    })
    createdAt: Date;

    @Prop({
        type: Date,
        required: false,
    })
    updatedAt: Date;

    // timestamp

    // @Prop({
    //     type: 'string',
    //     default: ''
    // })
    // createdAt: any;

    // @Prop({
    //     type: 'string',
    //     default: ''
    // })
    // updatedAt: any;
}
