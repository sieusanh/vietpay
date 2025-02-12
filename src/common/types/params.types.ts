import { CODE } from 'src/common';
import { ApiProperty } from '@nestjs/swagger';
import {
    // IsNumberString,
    IsString,
    IsNotEmpty,
} from 'class-validator';

export class PathParams {
    @IsString()
    @IsNotEmpty()
    code?: CODE;
}

export class QueryOneParams {
    // key, value is viewed as or if value have prefix "|"
    @ApiProperty({
        default: '',
        required: false,
    })
    select?: string;

    @ApiProperty({
        required: false,
    })
    populate?: string;

    [key: string]: unknown;
}

export class QueryManyParams extends QueryOneParams {
    @ApiProperty({
        default: 0,
        required: false,
    })
    offset?: number = 0;

    @ApiProperty({
        default: 20,
        required: false,
    })
    limit?: number = 20;

    // GET /ccadmin/v1/products?sort=id:desc,name:asc
    @ApiProperty({
        required: false,
    })
    sort?: string;

    @ApiProperty({
        required: false,
    })
    from_time?: string;

    @ApiProperty({
        required: false,
    })
    @ApiProperty({})
    to_time?: string;
}

export type ISelect = string[];

export enum FILTER_OPERATOR {
    EQUALS = 'EQUALS',
    IN = 'IN',
    CONTAINS = 'CONTAINS',
}

export type FilterOperator =
    | FILTER_OPERATOR.EQUALS
    | FILTER_OPERATOR.IN
    | FILTER_OPERATOR.CONTAINS;

export interface IFilterAnd {
    [field: string]: unknown;
}

export interface IFilterAll {
    field: string;
    operator: FilterOperator;
    value: unknown;
}

// type QueryPairs<Entity extends BaseEntity> = {
//     [key in keyof Entity]: number | string | boolean | null;
// }

export enum SORT_DIRECTION {
    ASC = 'asc',
    DESC = 'desc',
}

export interface ISort {
    column: string;
    direction?: SORT_DIRECTION.ASC | SORT_DIRECTION.DESC;
}

export type IFilter = IFilterAnd | IFilterAll;

export interface IPopulateOptions {
    path: string;
    select: string;
}

export interface ICriteria {
    filters?: Array<IFilter>;
    select?: ISelect;
    populateOptions?: IPopulateOptions[];
}
export interface IFindManyCriteria extends ICriteria {
    sort?: ISort;
    sorts?: Array<ISort>;
    offset?: number;
    limit?: number;
}
