import { Prop, Schema } from '@nestjs/mongoose';
import { BaseModel } from 'modules/base';
import { CODE, GENDERS } from 'src/common/constant';

@Schema({
    collection: 'accounts',
    timestamps: true,
})
export class AccountModel extends BaseModel {
    @Prop({
        unique: true,
    })
    code: CODE;

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
    role_code?: CODE;

    @Prop()
    last_login_at: Date;
}
