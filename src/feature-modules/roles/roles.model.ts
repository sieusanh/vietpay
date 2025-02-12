import { Prop, Schema } from '@nestjs/mongoose';
import { BaseModel } from 'src/feature-modules/base';

@Schema({
    collection: 'roles',
    timestamps: false,
})
export class RoleModel extends BaseModel {
    @Prop({
        unique: true,
    })
    name: string;
}
