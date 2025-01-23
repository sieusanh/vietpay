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
import { AccountsService } from './accounts.service';
import { AccountDto } from './accounts.dto';
import { MODULE_INFO, ENDPOINTS } from './accounts.constant';
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
import { HttpErrorMessages, ICriteria } from 'common/constant';
import { QueryParams, QueryParser } from 'common/http';
import { ICreateAccount } from './accounts.types';

@Controller(MODULE_INFO.CONTROLLER)
@ApiHeader({
    name: 'X-MyHeader',
    description: 'Custom header',
})
@ApiBearerAuth()
@UseGuards(RolesGuard)
@ApiTags(MODULE_INFO.NAME)
export class AccountsController {
    constructor(
        protected accountService: AccountsService,
        private queryParser: QueryParser,
    ) {}

    @Post()
    // @Roles([ROLES.ADMIN])
    // @Header('Cache-Control', 'none')
    @HttpCode(HttpStatus.CREATED)
    // @RolesGuard(['admin'])
    @ApiOperation({ summary: `Create` })
    @ApiBody({
        description: 'Body',
        examples: {
            'Case 1': {
                value: {
                    username: 'username_1',
                    email: 'user1@gmail.com',
                    password: 'Abc@123',
                    name: 'Username 1',
                    phone: '0123456789',
                    avatar: 'a.png',
                    gender: 'FEMALE',
                    roleId: 'role1',
                    // lastLoginAt
                },
            },
        },
    })
    async create(
        @Body()
        accountDto: AccountDto,
    ) {
        try {
            const newAccount: ICreateAccount =
                accountDto as ICreateAccount;
            const result = await this.accountService.createOne(newAccount);

            return result;
            // res.status(HttpStatus.CREATED).json(data);
        } catch (err) {
            console.log(
                '===================== AccountsController create err ',
                err,
            );

            throw new HttpException(
                HttpErrorMessages.CREATE,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: `findOne` })
    async findById(
        @Param('id') code: CODE,
        @Query() queryParams: QueryParams,
        // @Res({ passthrough: true }) res: Response
    ) {
        try {
            const 
            const data = await this.accountService.findOne(code);

            if (!data) {
                throw new NotFoundException(`Account is not found.`);
            }

            return data;
        } catch (err) {
            const { message, status } = err;
            let errMess: string = HttpErrorMessages.INTERNAL_SERVER_ERROR;
            let errStatusCode: number = HttpStatus.INTERNAL_SERVER_ERROR;

            if (message && status) {
                errMess = message;
                errStatusCode = status;
            }

            throw new HttpException(errMess, errStatusCode);
        }
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: `findAll` })
    async findMany(@Query() queryParams: QueryParams) {
        try {
            const criteria: ICriteria =
                this.queryParser.parseFindManyQuery(queryParams);

            const result = await this.accountService.findMany(criteria);

            return result;
        } catch (err) {
            console.log(
                '=============== AccountsController findMany ',
                err,
            );
            const { message, status } = err;
            let errMess: string = HttpErrorMessages.INTERNAL_SERVER_ERROR;
            let errStatusCode: number = HttpStatus.INTERNAL_SERVER_ERROR;

            if (message && status) {
                errMess = message;
                errStatusCode = status;
            }

            throw new HttpException(errMess, errStatusCode);

            /*
                throw new BadRequestException('Something bad happened', { 
                    cause: new Error(), 
                    description: 'Some error description' 
                })
                    
                throw new HttpException({
                    status: HttpStatus.FORBIDDEN,
                    error: 'This is a custom message',
                }, HttpStatus.FORBIDDEN, {
                    cause: 'Em sai roi'
                });
            */
        }
    }

    // @Put(':id')
    // @HttpCode(HttpStatus.NO_CONTENT)
    // @ApiOperation({ summary: `update` })
    // updateById(
    //     @Param('id') id: Id,
    //     @Body() dto: Dto,
    // ) {
    //     try {
    //         return this.accountService.updateById(id, dto);

    //     } catch (error) {
    //         throw new HttpException(
    //             HttpErrorMessages.UPDATE,
    //             HttpStatus.INTERNAL_SERVER_ERROR
    //         );
    //     }
    // }

    // @Delete(':id')
    // @HttpCode(HttpStatus.NO_CONTENT)
    // @ApiOperation({ summary: `remove` })
    // async deleteById(
    //     @Param('id') id: Id
    // ) {
    //     try {
    //         return this.accountService.deleteById(id);
    //     } catch (error) {
    //         throw new HttpException(
    //             HttpErrorMessages.DELETE,
    //             HttpStatus.INTERNAL_SERVER_ERROR
    //         );
    //     }
    // }

    // @Get('*')
    // @Redirect('https://docs.nestjs.com', 302)
    // getDocs(@Query('version') version) {
    //     if (version && version === '5') {
    //         return { url: 'https://docs.nestjs.com/v5/' };
    //     }
    // }
}
