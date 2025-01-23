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

export enum SortDirection {
    ASC = 'asc',
    DESC = 'desc',
}

export interface ISort {
    column: string;
    direction?: SortDirection.ASC | SortDirection.DESC;
}

export type IFilter = IFilterAnd | IFilterAll;

export interface IPopulateOptions {
    path: string;
    select: string;
}

export interface ICriteria {
    select?: ISelect;
    filters?: IFilter[];
    populateOptions?: IPopulateOptions[];
}

export interface IFindManyCriteria extends ICriteria {
    sort?: ISort;
    sorts?: ISort[];
    offset?: number;
    limit?: number;
}
