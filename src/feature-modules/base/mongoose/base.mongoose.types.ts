import { SORT_DIRECTION } from 'common/types';

export type SORT_TYPE = Record<
    string,
    SORT_DIRECTION.ASC | SORT_DIRECTION.DESC
>;

// export type SORT_TYPE =
//     | { [key: string]: SortOrder }
//     | [string, SortOrder][];
