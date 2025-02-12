export const MODULE_INFO = {
    NAME: 'Authen',
    CONTROLLER: 'authen',
};

export const ENDPOINTS = {
    SIGNIN: 'login',
    REGISTER: 'register',
};

export const LOGIN_BODY_EXAMPLE = {
    DEFAULT: {
        value: {
            username: 'user1',
            password: 'abc123@',
        },
    },
    EMAIL: {
        value: {
            email: 'user1@gmail.com',
            password: 'abc123@',
        },
    },
    PHONE: {
        value: {
            phone: '0902030405',
            password: 'abc123@',
        },
    },
};

export const REGISTER_BODY_EXAMPLES = {
    DEFAULT: {
        value: {
            username: 'user1',
            email: 'user1@gmail.com',
            phone: '0902030405',
            password: 'abc123',
            fullName: 'La Siêu Sánh',
            avatar: null,
            gender: 'MALE',
            roleId: 'MEMBER',
        },
    },
};
