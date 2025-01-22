
export const MODULE_INFO = {
    NAME: 'Authen',
    CONTROLLER: 'authen',
}

export const ENDPOINTS = {
    SIGNIN: 'login',
    REGISTER: 'register',
}

export const LOGIN_BODY_EXAMPLE = {
    username: 'user1',
    email: 'user1@gmail.com',
    phone: '0902083164',
    password: 'abc123'
}

export const REGISTER_BODY_EXAMPLES = {
    DEFAULT: {
        value: {
            username: 'user1',
            email: 'user1@gmail.com',
            phone: '0902083164',
            password: 'abc123',
            fullName: 'La Siêu Sánh',
            avatar: null,
            gender: 'MALE',
            roleId: 'MEMBER',
        }
    }
};
