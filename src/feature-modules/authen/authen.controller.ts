import {
    Controller,
    Body,
    Post,
    HttpCode,
    HttpException,
    HttpStatus,
    SerializeOptions,
} from '@nestjs/common';
import { AuthenService } from './authen.service';
import { SignInDto, RegistryDto, ResponseSignInDto } from './authen.dto';
import {
    MODULE_INFO,
    ENDPOINTS,
    REGISTER_BODY_EXAMPLES,
    LOGIN_BODY_EXAMPLE,
} from './authen.constant';
import { IAccessInfo } from './authen.types';
import {
    ApiTags,
    ApiBearerAuth,
    ApiHeader,
    ApiBody,
    ApiOperation,
} from '@nestjs/swagger';
import { HttpErrorMessages } from 'src/common/constants';
import { API_HEADER } from 'src/common/constants';
import { IRegistry, ISignIn } from './authen.types';

@Controller(MODULE_INFO.CONTROLLER)
@ApiHeader(API_HEADER)
@ApiBearerAuth()
@ApiTags(MODULE_INFO.NAME)
export class AuthenController {
    constructor(protected authenService: AuthenService) {}

    @Post(ENDPOINTS.REGISTER)
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'User account registration' })
    @ApiBody({
        // schema: {
        //     // $ref: getSchemaPath(RegistryDto)
        //     $ref: getSchemaPath(AccountDto)
        // },
        type: RegistryDto,
        description: '',
        examples: REGISTER_BODY_EXAMPLES,
    })
    async register(@Body() registryDto: RegistryDto): Promise<void> {
        try {
            const registerBody = registryDto as IRegistry;
            await this.authenService.register(registerBody);
        } catch (err) {
            console.log(
                '======================== controller register err ',
                err,
            );
            const { message, status } = err;
            let errMess: string = HttpErrorMessages.CREATE;
            let errStatusCode: number = HttpStatus.INTERNAL_SERVER_ERROR;

            if (message && status) {
                errMess = message;
                errStatusCode = status;
            }

            throw new HttpException(errMess, errStatusCode);
        }
    }

    @Post(ENDPOINTS.SIGNIN)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Account Login' })
    @SerializeOptions({ type: ResponseSignInDto })
    @ApiBody({
        type: SignInDto,
        description: '',
        examples: LOGIN_BODY_EXAMPLE,
    })
    async signIn(@Body() signInDto: SignInDto): Promise<IAccessInfo> {
        try {
            const signInBody = signInDto as ISignIn;

            const res: IAccessInfo =
                await this.authenService.signIn(signInBody);
            return res;
        } catch (err) {
            console.log(err);
            throw new HttpException(
                HttpErrorMessages.UNAUTHORIZED,
                HttpStatus.UNAUTHORIZED,
            );
        }
    }
}
