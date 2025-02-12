import { Prop, Schema } from '@nestjs/mongoose';
import { BaseModel } from '../base';
import { GENDERS, CODE } from 'common/types';
import { MONGODB_COLLECTION } from './accounts.constant';

@Schema({
    collection: MONGODB_COLLECTION.NAME,
    timestamps: true,
})
export class AccountModel extends BaseModel {
    @Prop({
        unique: true,
    })
    username: string;

    @Prop({
        unique: true,
    })
    email: string;

    @Prop()
    phone?: string = '';

    @Prop()
    password: string;

    @Prop()
    fullName: string = '';

    @Prop()
    avatar?: string = '';

    @Prop()
    gender?: string = GENDERS.MALE;

    @Prop()
    roleCode?: CODE;

    @Prop()
    lastLoginAt: Date;
}
