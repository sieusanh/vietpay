// consider adding format logic
export type CODE = string;

export type DB_CODE = number;

export enum STATUS_STRING {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    REMOVED = 'REMOVED',
}

export enum STATUS_NUMBER {
    ACTIVE = 1,
    INACTIVE = 0,
    DELETED = -1,
}

export enum GENDERS {
    MALE = 'MALE',
    FEMALE = 'FEMALE',
}

export enum ROLES {
    MEMBER = 'MEMBER',
    ADMIN = 'ADMIN',
}
