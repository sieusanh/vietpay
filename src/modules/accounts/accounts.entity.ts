import { Entity, Column } from 'typeorm';
import { BaseEntity } from 'modules/base';
import { CODE, GENDERS } from 'src/common/constant';

@Entity({
    name: 'accounts'
})
export class AccountEntity extends BaseEntity {

    @Column({
        unique: true
    })
    code: CODE;

    @Column({
        unique: true
    })
    username: string;

    @Column({
        unique: true
    })
    email: string;

    @Column()
    phone?: string = '';

    @Column()
    password: string;

    @Column()
    fullName: string = '';

    @Column()
    avatar?: string = '';

    @Column()
    gender?: string = GENDERS.MALE;

    @Column()
    roleCode?: CODE;

    @Column()
    lastLoginAt: Date;
    
}
