import { Prop, Schema } from '@nestjs/mongoose';
import { BaseModel } from 'modules/base';
import { CODE } from 'src/common/constant';

@Schema({
    collection: 'roles',
    timestamps: false,
})
export class RoleModel extends BaseModel {
    @Prop({
        unique: true,
    })
    code: CODE;

    @Prop({
        unique: true,
    })
    name: string;
}
