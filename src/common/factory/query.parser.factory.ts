// import { EntityListenerService } from './entity-listener.factory';
// import { QueryRunnerService } from './query-runner.factory';

// @Global()
// @Module({
//     exports: [
//         EntityListenerService,
//         QueryRunnerService
//     ]
// })
// export class ModuleFactory {

// }

import { QueryOneParams, QueryManyParams } from '../types';
import {
    ICriteria,
    IFindManyCriteria,
    IFilter,
    ISelect,
    ISort,
    SORT_DIRECTION,
} from 'common/types';
import {
    PARAM_SPLIT_SPLITTER,
    SORT_ITEM_SPLITTER,
} from 'src/common/constants';

export class QueryParser {
    parseFindOneQuery(queryParams: QueryOneParams): ICriteria {
        const { select: fields, populate, ...others } = queryParams;

        const criteria: ICriteria = {};

        if (fields && fields?.length > 0) {
            const select: ISelect =
                fields.split(PARAM_SPLIT_SPLITTER) || [];
            criteria.select = select;
        }

        if (populate && populate?.length > 0) {
            // const populateOptions: IPopulateOptions[] = [];
            criteria.populateOptions = [];
        }

        if (others && Object.entries(others).length) {
            const filters: IFilter[] =
                Object.entries(others).map(([key, val]) => ({
                    [key]: val,
                })) || [];

            criteria.filters = filters;
        }

        return criteria;
    }

    parseFindManyQuery(
        queryManyParams: QueryManyParams,
    ): IFindManyCriteria {
        const {
            offset,
            limit,
            sort,
            from_time,
            to_time,
            ...queryOneParams
        } = queryManyParams;

        const findManyCriteria: IFindManyCriteria = {};

        if (offset) {
            findManyCriteria.offset = offset;
        }

        if (limit) {
            findManyCriteria.limit = limit;
        }

        if (sort && sort?.length > 0) {
            const sorts: Array<ISort> = [];
            for (const item of sort.split(PARAM_SPLIT_SPLITTER)) {
                const [column, directionStr] =
                    item.split(SORT_ITEM_SPLITTER);

                const direction = directionStr as SORT_DIRECTION.ASC;
                sorts.push({ column, direction });
            }
            findManyCriteria.sorts = sorts;
        }

        const criteria: ICriteria = this.parseFindOneQuery(queryOneParams);

        const created_at = {};
        if (from_time) {
            Object.assign(created_at, {
                gte: from_time,
            });
        }

        if (to_time) {
            Object.assign(created_at, {
                lte: to_time,
            });
        }

        if (Object.keys(created_at)?.length > 0) {
            criteria.filters.push({ created_at });
        }

        Object.assign(findManyCriteria, criteria);

        return findManyCriteria;
    }
}
