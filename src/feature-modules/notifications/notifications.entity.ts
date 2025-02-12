import { Entity, Column } from 'typeorm';
import { BaseEntity } from 'src/feature-modules/base';
import { CODE } from 'common/types';

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
