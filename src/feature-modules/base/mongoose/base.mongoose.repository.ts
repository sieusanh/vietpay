import { BaseModel } from './base.mongoose.model';
import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import {
    Model as MongooseModel,
    Connection,
    RootFilterQuery,
    FilterQuery,
    QueryOptions,
    ProjectionType,
    QueryWithHelpers,
    MongooseUpdateQueryOptions,
    PopulateOptions,
    ClientSession,
} from 'mongoose';
import {
    ICriteria,
    IFindManyCriteria,
    IFilter,
    ISelect,
    SORT_DIRECTION,
    STATUS_NUMBER,
} from 'common/types';
import {
    PipelineStage,
    // Aggregate
} from 'mongoose';
import { SORT_TYPE } from './base.mongoose.types';
import { BASE_IDENTITY_COLUMN } from '../base.constants';
import { IBaseServiceData, IResponseDataList } from '../base.types';
import { DB_CODE, CODE } from 'common/types';
import { CODE_PREFIX_MAP } from '../base.constants';

@Injectable()
export class BaseMongooseRepository<
    Model extends BaseModel,
    ServiceData extends IBaseServiceData,
> {
    @InjectConnection()
    protected readonly connection: Connection;

    constructor(
        protected model: MongooseModel<Model>,
        private name: string,
    ) {}

    getCodeString(dbDode: DB_CODE): CODE {
        const PREFIX = CODE_PREFIX_MAP[this.name];
        const code: string = `${PREFIX}${dbDode}`;
        return code;
    }

    getQueryFilter(filters?: IFilter[]): RootFilterQuery<Model> {
        const defaultFilter = {
            status: STATUS_NUMBER.ACTIVE,
        };
        filters.push(defaultFilter);

        if (!filters || !filters?.length) {
            return null;
        }

        const findFilter: RootFilterQuery<Model> = {};
        const whereList: FilterQuery<Model>[] = [];

        for (const filter of filters) {
            const whereItem: FilterQuery<Model> =
                filter as FilterQuery<Model>;

            whereList.push(whereItem);
        }

        Object.assign(findFilter, {
            $or: whereList,
        });

        return findFilter;
    }

    getFindParams(criteria: ICriteria) {
        const {
            filters = [],
            select = [],
            populateOptions = [],
        } = criteria;

        // Build filter
        const filter: RootFilterQuery<Model> =
            this.getQueryFilter(filters);

        if (!filter || !Object.keys(filter)?.length) {
            return null;
        }

        // Build projection
        const projection: ProjectionType<Model> = {};
        for (const key of select) {
            Object.assign(projection, {
                [key]: 1,
            });
        }

        if (!Object.keys(projection)?.length) {
            Object.assign(projection, {
                _id: 0,
                created_by: 0,
                updatedBy: 0,
                createdAt: 0,
                updatedAt: 0,
                __v: 0,
            });
        }

        // Build populate
        const populateItems: PopulateOptions[] = [];

        if (populateOptions?.length > 0) {
            for (const { path, select } of populateOptions) {
                const populateEle: PopulateOptions = {
                    path,
                    select,
                };
                populateItems.push(populateEle);
            }
        }

        // Build options
        const options: QueryOptions<Model> = { lean: true };

        if (populateItems?.length > 0) {
            Object.assign(options, {
                populate: populateItems,
            });
        }

        return { filter, projection, options };
    }

    handleResponseData(doc: Model) {
        const { code: dbCode, ...otherColumns } = doc;
        const code = this.getCodeString(dbCode);
        const serviceData: ServiceData = { code } as ServiceData;

        for (const [key, val] of Object.entries(otherColumns)) {
            serviceData[key] = val;
        }

        return serviceData;
    }

    handleResponseDataList(docs: Model[]) {
        const serviceDataList: ServiceData[] = [];

        for (const doc of docs) {
            const serviceData: ServiceData = this.handleResponseData(doc);
            serviceDataList.push(serviceData);
        }

        return serviceDataList;
    }

    async findOne(criteria: ICriteria): Promise<ServiceData> {
        const { filter, projection, options } =
            this.getFindParams(criteria);

        if (!filter || !Object.keys(filter)?.length) {
            return null;
        }

        const doc: Model = await this.model.findOne(
            filter,
            projection,
            options,
        );

        const serviceData: ServiceData = this.handleResponseData(doc);
        // const resData: IResponseData = result as QueryWithHelpers<
        //     Model | null,
        //     Model
        // >;

        return serviceData;
    }

    count(filters: IFilter[]): Promise<number> {
        const findFilter: RootFilterQuery<Model> =
            this.getQueryFilter(filters);

        const result: QueryWithHelpers<number, Model> =
            this.model.countDocuments(findFilter);

        return result;
    }

    async findMany(
        findManyCriteria: IFindManyCriteria,
    ): Promise<IResponseDataList<ServiceData>> {
        const {
            sort,
            sorts,
            offset,
            limit = 10,
            ...criteria
        } = findManyCriteria;
        let skip: number = 0;

        const {
            filter,
            projection,
            options: findOptions,
        } = this.getFindParams(criteria);

        if (!filter && limit == 0) {
            return null;
        }

        if (offset) {
            skip = offset;
        }

        const options: QueryOptions<Model> = {
            skip, // parseInt
            limit, // parseInt
            ...findOptions,
        };

        // const findPromise = this.model.find(filter, projection, options);
        if (sorts?.length > 0) {
            const sortList: SORT_TYPE[] = sorts.map((ele) => ({
                [`${ele.column}`]: ele.direction,
            }));
            // findPromise.sort(sortList);
            options.sort = sortList;
        }
        if (sort && Object.keys(sort)?.length > 0) {
            options.sort = {
                [sort.column]: sort.direction,
            };
        }

        const [docs = [], total = 0] = await Promise.all([
            this.model.find(filter, projection, options),
            this.model.countDocuments(filter),
        ]);

        const serviceDataList: ServiceData[] =
            this.handleResponseDataList(docs);

        const resServiceData: IResponseDataList<ServiceData> = {
            data: serviceDataList,
            total,
        };
        // .then(([data, total]) => {
        //     const res: IFindModelsResult<Model> = {
        //         data,
        //         total,
        //     };
        //     return res;
        // })
        // .catch((err) => {
        //     console.log(err);
        //     const data: Model[] = []; // try use "let"
        //     const total = 0;
        //     const res: IFindModelsResult<Model> = {
        //         data,
        //         total,
        //     };

        //     return res;
        // });

        // const result: IFindModelsResult<Model> = {
        //     data,
        //     total,
        // };

        return resServiceData;
    }

    groupBy(criteria: ICriteria, identityKey: string) {
        const { filters, select } = criteria;

        const groupColumnObj = {};
        const $match = {};
        const findFilter: RootFilterQuery<Model> =
            this.getQueryFilter(filters);

        if (select) {
            for (const key of select) {
                Object.assign(groupColumnObj, {
                    key: {
                        $first: `$${key}`,
                    },
                });
            }
        }

        if (findFilter) {
            Object.assign($match, findFilter);
        }

        const pipelineStages: PipelineStage[] = [
            {
                $match,
            },
            {
                $group: {
                    _id: `$${identityKey}`,
                    ...groupColumnObj,
                    total: {
                        $sum: 1,
                    },
                },
            },
        ];

        const result =
            // : Aggregate<Array<Model>>
            this.model.aggregate<Model>(pipelineStages).then((res) => {
                return res;
            });

        return result;
    }

    async wrapTransaction<T>(
        callback: (session: ClientSession) => Promise<T>,
    ) {
        let data;
        const session = await this.connection.startSession();
        try {
            session.startTransaction();
            data = await callback(session);
            await session.commitTransaction();
        } catch (error) {
            if (error.reason && error.reason.servers) {
                // log
                console.log(error);
            }
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
        return data;
    }

    // insertOne(Model: Model): Promise<InsertResult> {
    //     const partialModel: QueryDeepPartialModel<Model> =
    //         Model as QueryDeepPartialModel<Model>;
    //     const data = this.insert(partialModel)
    //         .then((res) => res.raw[0])
    //         .catch((err) => err);
    //     return data;
    // }

    // insertMany(models: Model[]): Promise<InsertResult> {
    //     const partialModels: QueryDeepPartialModel<Model>[] =
    //         [] as QueryDeepPartialModel<Model>[];
    //     for (const model of models) {
    //         const partialModel: QueryDeepPartialModel<Model> =
    //             model as QueryDeepPartialModel<Model>;
    //         partialModels.push(partialModel);
    //     }
    //     const data = this.repository
    //         .insert(partialModels)
    //         .then((res) => res.raw[0])
    //         .catch((err) => err);
    //     return data;
    // }

    /*
    async insertOne(model: Model): Promise<Model> {
        const partialModel: QueryDeepPartialModel<Model> 
            = model as QueryDeepPartialModel<Model>;

        const data = this.repository
            .insert(partialModel)
            .then(res => res.raw[0]);

        return data;
    }
*/

    // async getNextStringCode(): Promise<string> {
    //     const select: ISelect = [BASE_IDENTITY_COLUMN];
    //     const filters: Array<IFilter> = [
    //         {
    //             [BASE_IDENTITY_COLUMN]: {
    //                 $exists: true,
    //             },
    //         },
    //     ];
    //     const sort: ISort = {
    //         column: BASE_IDENTITY_COLUMN,
    //         direction: SORT_DIRECTION.DESC,
    //     };
    //     const limit: number = 1;
    //     const findManyCriteria: IFindManyCriteria = {
    //         select,
    //         filters,
    //         sort,
    //         limit,
    //     };
    //     const documents = await this.findMany(findManyCriteria);
    //     const prevCode = documents.data[0].code;
    //     let codeNum = 1;
    //     if (prevCode) {
    //         const splittedString = prevCode.split(/(\d+)/);
    //         codeNum = parseInt(splittedString[1]) + 1;
    //     }
    //     const PREFIX = CODE_PREFIX_MAP[this.name];
    //     const curCode = `${PREFIX}${codeNum}`;

    //     return curCode;
    // }

    async getNextCode(): Promise<number> {
        const select: ISelect = [BASE_IDENTITY_COLUMN];
        const filters: Array<IFilter> = [
            {
                [BASE_IDENTITY_COLUMN]: {
                    $exists: true,
                },
            },
        ];
        const criteria: ICriteria = {
            select,
            filters,
        };
        const { filter, projection } = this.getFindParams(criteria);

        const options: QueryOptions<Model> = {
            limit: 1,
            sort: {
                [BASE_IDENTITY_COLUMN]: SORT_DIRECTION.DESC,
            },
        };

        const docs = await this.model.find(filter, projection, options);
        const prevCode: number = docs[0]?.code;
        console.log('================== **** prevCode ', prevCode);
        let nextCode = 1;
        if (prevCode) {
            nextCode = prevCode + 1;
        }

        return nextCode;
    }

    async insertOne(newDocument: Model): Promise<ServiceData> {
        const code: number = await this.getNextCode();
        newDocument.code = code;
        const doc: Model = await this.model.create<Model>(newDocument);
        // delete result._id;
        // delete result.__v;
        // return result.toJSON();
        // FlattenMaps<Require_id<Model>>
        const serviceData: ServiceData = this.handleResponseData(doc);

        return serviceData;
    }

    updateOne(
        filters: IFilter[],
        newDocument: Model,
    ): QueryWithHelpers<Model | null, Model> {
        const updateFilter: RootFilterQuery<Model> =
            this.getQueryFilter(filters);

        const options: MongooseUpdateQueryOptions<Model> = {
            lean: true,
            new: true,
        };

        // const updateQuery: UpdateQuery<Model> =
        //     this.getUpdateQuery(updateBody);

        const data: QueryWithHelpers<Model | null, Model> =
            this.model.findOneAndUpdate<Model>(
                updateFilter,
                newDocument,
                options,
            );
        // .then((res) => res)
        // .catch((err) => err);

        // QueryWithHelpers<UpdateWriteOpResult, ResultDoc, TQueryHelpers, TRawDocType, 'updateOne', TInstanceMethods>
        return data;
    }

    // // updateMany(options, Model: Model): Promise<void> {

    // // }

    deleteOne(filters: IFilter[]): QueryWithHelpers<Model | null, Model> {
        const deleteFilter: RootFilterQuery<Model> =
            this.getQueryFilter(filters);

        const options: QueryOptions<Model> = {
            lean: true,
            new: false,
        };

        const result: QueryWithHelpers<Model | null, Model> =
            this.model.findOneAndDelete<Model>(deleteFilter, options);

        return result;
    }
}
