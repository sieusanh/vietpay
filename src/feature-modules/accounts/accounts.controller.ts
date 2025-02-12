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
    SerializeOptions,
} from '@nestjs/common';
import { AccountsService } from './accounts.service';
import {
    CreateAccountDto,
    ResponseAccountDto,
    ResponseAccountListDto,
} from './accounts.dto';
import { MODULE_INFO, CREATE_BODY_EXAMPLE } from './accounts.constant';
import {
    ApiTags,
    // ApiBearerAuth,
    ApiHeader,
    ApiBody,
    ApiOperation,
} from '@nestjs/swagger';
// import { Roles } from 'common/decorator';
import {
    HttpErrorMessages,
    // ROLES
} from 'src/common/constants';
import { ICreateAccount } from './accounts.types';
import {
    QueryOneParams,
    QueryManyParams,
    ICriteria,
    CODE,
} from 'common/types';
import { QueryParser } from 'common/factory';

@Controller(MODULE_INFO.CONTROLLER)
@ApiHeader({
    name: 'X-MyHeader',
    description: 'Custom header',
})
// @ApiBearerAuth()
@ApiTags(MODULE_INFO.NAME)
export class AccountsController {
    constructor(
        protected accountService: AccountsService,
        private queryParser: QueryParser,
    ) {}

    @Post()
    // @Roles(ROLES.ADMIN)
    // @Header('Cache-Control', 'none')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: `Create` })
    @SerializeOptions({ type: ResponseAccountDto })
    @ApiBody({
        description: 'Body',
        examples: CREATE_BODY_EXAMPLE,
    })
    async create(
        @Body()
        accountDto: CreateAccountDto,
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

    @Get(':code')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: `findOne` })
    @SerializeOptions({ type: ResponseAccountDto })
    async findById(
        @Param('id') code: CODE,
        @Query() queryParams: QueryOneParams,
        // @Res({ passthrough: true }) res: Response
    ) {
        try {
            queryParams.code = code;
            const criteria: ICriteria =
                this.queryParser.parseFindOneQuery(queryParams);

            const data = await this.accountService.findOne(criteria);

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

            //         throw new BadRequestException('Something bad happened', {
            //             cause: new Error(),
            //             description: 'Some error description'
            //         })

            //         throw new HttpException({
            //             status: HttpStatus.FORBIDDEN,
            //             error: 'This is a custom message',
            //         }, HttpStatus.FORBIDDEN, {
            //             cause: 'Em sai roi'
            //         });
            //     */
            // }
        }
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: `findAll` })
    @SerializeOptions({ type: ResponseAccountListDto })
    async findMany(@Query() queryParams: QueryManyParams) {
        const criteria: ICriteria =
            this.queryParser.parseFindManyQuery(queryParams);

        const result = await this.accountService.findMany(criteria);

        return result;
    }

    // @Put(':id')
    // @HttpCode(HttpStatus.NO_CONTENT)
    // @ApiOperation({ summary: `update` })
    // updateById(
    //     @Param('id') code: CODE,
    //     @Body() dto: Dto,
    // ) {
    //     try {
    //         return this.accountService.updateOne(id, dto);

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
