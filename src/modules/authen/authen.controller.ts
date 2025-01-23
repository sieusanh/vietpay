import {
    Controller,
    Body,
    Query,
    Post,
    Get,
    Param,
    HttpCode,
    HttpException,
    HttpStatus,
    NotFoundException,
} from '@nestjs/common';
import { AuthenService } from './authen.service';
import { SignInDto, RegistryDto } from './authen.dto';
import {
    MODULE_INFO,
    ENDPOINTS,
    REGISTER_BODY_EXAMPLES,
} from './authen.constant';
import { IAccessInfo } from './accounts.interface';
import {
    ApiTags,
    ApiBearerAuth,
    ApiHeader,
    ApiBody,
    ApiOperation,
} from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from 'common/guards';
import { Roles } from 'common/decorator';
import { HttpErrorMessages, ICriteria } from 'src/common/constant';
import { QueryParams, QueryParser } from 'common/http';
import { API_HEADER } from 'common/constant';
import { IRegistry, ISignIn } from './authen.types';

@Controller(MODULE_INFO.CONTROLLER)
@ApiHeader(API_HEADER)
@ApiBearerAuth()
@UseGuards(RolesGuard)
@ApiTags(MODULE_INFO.NAME)
export class AuthenController {
    constructor(
        protected authenService: AuthenService,
        private queryParser: QueryParser,
    ) {}

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
    @ApiBody({
        type: SignInDto,
        description: '',
        examples: {
            'Case default': {
                value: {
                    phone: '0902083164',
                    password: 'Abc@123',
                },
            },
        },
    })
    async signIn(@Body() signInDto: SignInDto): Promise<IAccessInfo> {
        try {
            const res: IAccessInfo =
                await this.authenService.signIn(signInDto);
            return res;
        } catch (err) {
            throw new HttpException(
                HttpErrorMessages.UNAUTHORIZED,
                HttpStatus.UNAUTHORIZED,
            );
        }
    }
}
