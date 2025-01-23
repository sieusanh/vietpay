import { Prop, Schema } from '@nestjs/mongoose';
// import { HydratedDocument } from 'mongoose';
import { CODE, STATUS } from 'src/common';

// export type CatDocument = HydratedDocument<Cat>;

@Schema({ timestamps: true, _id: false })
export class BaseModel {

    @Prop({
        // required: true,
        unique: true,
        // index: true,
    })
    code: CODE;

    @Prop({ 
        type: Number,
        enum: STATUS,
        default: STATUS.ACTIVE
    })
    status: number;
    // status: STATUS;

    @Prop({ 
        type: 'string',
        default: ''
    })
    createdBy: string;

    @Prop({ 
        type: 'string',
        default: ''
    })
    updatedBy: string;

    @Prop({ 
        type: Date, 
        required: false 
    })
    createdAt: Date;

    @Prop({ 
        type: Date, 
        required: false 
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

