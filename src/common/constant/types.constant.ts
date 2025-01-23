
// consider adding format logic
export type CODE = string;

export enum STATUS {
    ACTIVE = 1,
    INACTIVE = 0,
    REMOVED = -1
}

export enum GENDERS {
    MALE = 'MALE',
    FEMALE = 'FEMALE'
}

export enum ROLES {
    MEMBER = 'MEMBER',
    ADMIN = 'ADMIN'
}

export const METADATA_KEYS = {
    ROLES: 'roles'
}
