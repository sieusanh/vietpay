import { Entity, Column } from 'typeorm';
import { BaseEntity } from 'modules/base';
import { CODE } from 'src/common/constant';

@Entity({
    name: 'accounts',
})
export class NotificationEntity extends BaseEntity {
    @Column({
        unique: true,
    })
    code: CODE;

    @Column({
        unique: true,
    })
    title: string;
}
