import { 
    Controller, Body, Query, Post, Get, 
    Param, HttpCode, HttpException, 
    HttpStatus, NotFoundException, 
    BadRequestException, 
    InternalServerErrorException,
    UseGuards, Logger, 
    ParseIntPipe
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionDto } from './transactions.dto';
import { ApiTags, ApiBearerAuth, 
    ApiHeader, ApiBody, ApiOperation 
} from '@nestjs/swagger';
import { RolesGuard, AuthGuard } from 'common/guards';
import { HttpErrorMessages, ICriteria, IFilter, PATH_PARAMS, ROLES } from 'src/common/constant';
import { QueryParams, QueryParser } from 'common/http';
import { MODULE_INFO, MODULE_PATH_PARAMS, LOG_INFOS } from './transactions.constant';
import { ConsoleService } from 'common/log';
import { Roles } from 'common/decorator';

@Controller(MODULE_INFO.CONTROLLER)
@ApiHeader({
    name: 'X-MyHeader',
    description: 'Custom header'
})
// @ApiBearerAuth()
@UseGuards(RolesGuard)
@ApiTags(MODULE_INFO.NAME)
@Roles([ROLES.MEMBER])
export class TransactionsController {

    // private readonly logger = new Logger(TransactionsController.name);

    constructor(
        protected service: TransactionsService,
        private queryParser: QueryParser,
        private consoleService: ConsoleService,
    ) { 
        this.consoleService.setContext(TransactionsController.name);
    }   

    @Post()
    @Roles([ROLES.ADMIN])
    // @Header('Cache-Control', 'none')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: `Create` })
    @ApiBody({
        description: 'Body',
        examples: {
            'Case 1': {
                value: {
                    name: 'Transaction 1',
                    type: 'Normal',
                    phone: '0123456789',
                    city: 'Ho Chi Minh',
                    address: '12/3 A',
                    distance: '2km',
                    photos: ['a.png'],
                    title: 'Transaction 1',
                    desc: 'abc',
                    rating: 1,
                    rooms: ['Room 1'],
                    cheapestPrice: 123,
                    featured: false
                }
            }
        }
    })
    async create(
        @Body()
        transactionDto: TransactionDto,
    ) {
        try {
            // const transactionEntity = transactionDto as TransactionEntity
            // const result = await this.service
            //     .insertOne(transactionDto);

            // return result;
            console.log('========================== created transaction ')
            return true;
        } catch (err) {
            console.log('================= TransactionsController create ', err)
            throw new HttpException(
                HttpErrorMessages.CREATE, 
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    // @Get(PATH_PARAMS.ID)
    // @HttpCode(HttpStatus.OK)
    // @ApiOperation({ summary: `findOne` })
    // @UseGuards(AuthGuard)
    // async findById(
    //     @Param('id') id: string,
    //     // @Res({ passthrough: true }) res: Response
    // ) {
    //     try {

    //         const data = await this.service.findById(id);

    //         if (!data) {
    //             throw new NotFoundException(
    //                 `Account is not found.`
    //             );
    //         }

    //         return data;

    //     } catch (err) {

    //         const { message, status } = err;
    //         let errMess: string = HttpErrorMessages.INTERNAL_SERVER_ERROR;
    //         let errStatusCode: number = HttpStatus.INTERNAL_SERVER_ERROR;

    //         if (message && status) {
    //             errMess = message;ConsoleService
    //             errStatusCode = status;
    //         }

    //         throw new HttpException(
    //             errMess, 
    //             errStatusCode
    //         );
    //     }
    // }
    
    @Get('pipe/:id')
    findPipe(@Param('id', new ParseIntPipe({  errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number) {
        console.log('================ id ', id)
        console.log('================ typeof id ', typeof id)
        return { prop: 'val' }
    }

    @Get('throw')
    // @HttpCode(HttpStatus.OK)
    findThrow() {
        const err = new Error('abc123')
        // this.logger.log('WOAEIAWEIAW')
        const logInfo = {
            title: LOG_INFOS.INIT_TRANSACTION,
            data: {
                transid: 'abc123'
            }
        }
        this.consoleService.printLog(logInfo);

        console.log('=============== err ', err.name)
        throw err
        // throw new HttpException(
        //     'mess', 
        //     500
        // );
        // throw new HttpException('Forbideen', HttpStatus.INTERNAL_SERVER_ERROR)
        // throw new InternalServerErrorException('Anc')

        // try {
            // throw new HttpException('Forbideen', HttpStatus.FORBIDDEN)
            // throw new Error('This is a mess')
        // } catch (error) {
        //     console.log('== err ', error)
        //     // throw new HttpException({
        //     //     status: HttpStatus.FORBIDDEN,
        //     //     error: 'This is a custom message'
        //     // }, HttpStatus.FORBIDDEN, {
        //     //     cause: error
        //     // })
        //     const a = error.message;
        //     const b = error.status;
        //     console.log('================ a ', a)
        //     console.log('================ b ', b)
        //     console.log('================ error ', error)
        //     // throw new BadRequestException('Something bad happened', {
        //     //     cause: new Error(),
        //     //     description: 'Some error description',
        //     // });
        //     throw new Error(error)
        // }
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: `findAll` })
    async findMany(
        @Query() queryParams: QueryParams,
    ) {
        try {
            const criteria: ICriteria 
                = this.queryParser.parseFindManyQuery(queryParams);

            const result 
                = await this.service.findMany(criteria);

            return result;
        } catch (err) {
            console.log('=============== TransactionsController findMany ', err);
            const { message, status } = err;
            let errMess: string = HttpErrorMessages.INTERNAL_SERVER_ERROR;
            let errStatusCode: number = HttpStatus.INTERNAL_SERVER_ERROR;
    
            if (message && status) {
                errMess = message;
                errStatusCode = status;
            }

            throw new HttpException(
                errMess, 
                errStatusCode
            );
            
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

    @Get(MODULE_PATH_PARAMS.COUNT_BY_CITY)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: `countByCity` })
    async countByCity(
        @Query('cities') cities,
    ) {
        try {
            const filters: IFilter[] = [];

            for (const city of cities.split(',')) {
                const filter = { city };
                filters.push(filter);
            }
            const criteria: ICriteria = { filters };

            const result 
                = await this.service.countByCity(criteria);

            return result;
        } catch (err) {
            const { message, status } = err;
            let errMess: string = HttpErrorMessages.INTERNAL_SERVER_ERROR;
            let errStatusCode: number = HttpStatus.INTERNAL_SERVER_ERROR;
    
            if (message && status) {
                errMess = message;
                errStatusCode = status;
            }

            throw new HttpException(
                errMess, 
                errStatusCode
            );
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
    //         return this.service.updateById(id, dto);

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
    //         return this.service.deleteById(id);
    //     } catch (error) {
    //         throw new HttpException(
    //             HttpErrorMessages.DELETE, 
    //             HttpStatus.INTERNAL_SERVER_ERROR
    //         );
    //     }
    // }

}
