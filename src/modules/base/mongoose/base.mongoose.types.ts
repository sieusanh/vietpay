import { SortDirection } from 'common/constant';

export type SORT_TYPE = Record<
    string,
    SortDirection.ASC | SortDirection.DESC
>;

// export type SORT_TYPE =
//     | { [key: string]: SortOrder }
//     | [string, SortOrder][];
