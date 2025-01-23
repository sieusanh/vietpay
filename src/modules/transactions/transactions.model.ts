import { Prop, Schema } from '@nestjs/mongoose';
import { BaseModel } from '../base';

@Schema({
    // _id: false,
    timestamps: true,
    collection: 'transactions',
})
export class TransactionModel extends BaseModel {
    // @Prop({
    //     unique: true,
    //     required: true,
    // })
    // id: string;

    @Prop({
        required: true,
        // type: String,
        type: 'string',
    })
    name: string = '';

    @Prop({
        required: false,
        type: 'string',
    })
    type?: string = '';

    @Prop({
        required: false,
        type: 'string',
        match: /^[+ 0-9]{8,18}$/,
    })
    phone?: string = '';

    @Prop({
        type: [String],
    })
    photos?: Array<string>;

    @Prop({
        null: false,
        type: 'number',
        min: 0,
        max: 5,
    })
    rating: number;

    @Prop({
        type: [String],
    })
    rooms: Array<string>;
}
