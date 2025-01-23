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
import { IFindModelsResult } from './base.mongoose.interfaces';
import { ICriteria, IFindManyCriteria, IFilter } from 'common/constant';
import {
    PipelineStage,
    // Aggregate
} from 'mongoose';
import { SORT_TYPE } from './base.mongoose.types';

@Injectable()
export class BaseTypeormRepository<Model extends BaseModel> {
    // constructor(
    //     protected repo Model: Model
    // ) {}

    // @InjectRepository(Model)
    // protected repository: Repository<Model> ;

    // private SCHEMA_NAME = this.SCHEMA_NAME;

    @InjectConnection()
    protected readonly connection: Connection;

    constructor(
        // @InjectModel(SCHEMA_NAME)
        // private model: MongooseModel<Model>,

        protected model: MongooseModel<Model>,

        // protected repository: Repository<Entity>
    ) {}

    /*
    filter: RootFilterQuery<TRawDocType>,
    projection: ProjectionType<TRawDocType> | null | undefined,
    options: QueryOptions<TRawDocType> & { lean: true }
*/

    getQueryFilter(filters?: IFilter[]): RootFilterQuery<Model> {
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
        const { filters, select, populateOptions } = criteria;

        // Build filter
        const filter: RootFilterQuery<Model> =
            this.getQueryFilter(filters);

        if (!filter || !Object.keys(filter)?.length) {
            return null;
        }

        // Build projection
        const projection: ProjectionType<Model> = {
            _id: 0,
            created_by: 0,
            updatedBy: 0,
            createdAt: 0,
            updatedAt: 0,
            __v: 0,
        };
        for (const key of select) {
            Object.assign(projection, {
                [key]: 1,
            });
        }

        // Build populate
        const populateItems: PopulateOptions[] = [];

        for (const { path, select } of populateOptions) {
            const populateOptions: PopulateOptions = {
                path,
                select,
            };
            populateItems.push(populateOptions);
        }
        const populate = [...populateItems];

        // Build options
        const options: QueryOptions<Model> = { lean: true, populate };

        return { filter, projection, options };
    }

    findOne(criteria: ICriteria): QueryWithHelpers<Model | null, Model> {
        const { filter, projection, options } =
            this.getFindParams(criteria);

        if (!filter || !Object.keys(filter)?.length) {
            return null;
        }

        const result: QueryWithHelpers<Model | null, Model> =
            this.model.findOne(filter, projection, options);

        return result;
    }

    count(filters: IFilter[]): Promise<number> {
        const findFilter: RootFilterQuery<Model> =
            this.getQueryFilter(filters);

        const result: QueryWithHelpers<number, Model> =
            this.model.countDocuments(findFilter);

        return result;
    }

    findMany(
        findManyCriteria: IFindManyCriteria,
    ): Promise<IFindModelsResult<Model>> {
        const {
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

        if (offset) {
            skip = offset;
        }

        // Object.assign(findOptions, { skip });
        // Object.assign(findOptions, { limit });

        const options: QueryOptions<Model> = {
            skip, // parseInt
            limit, // parseInt
            ...findOptions,
        };

        // let data: Model[] = [];
        // let total = 0;

        // const findPromise = this.model.find(filter, projection, options);
        if (sorts?.length > 0) {
            const sortList: SORT_TYPE[] = sorts.map((ele) => ({
                [`${ele.column}`]: ele.direction,
            }));
            // findPromise.sort(sortList);
            options.sort = sortList;
        }

        const result = Promise.all([
            this.model.find(filter, projection, options),
            this.model.countDocuments(filter),
        ])
            .then(([data, total]) => {
                const res: IFindModelsResult<Model> = {
                    data,
                    total,
                };
                return res;
            })
            .catch((err) => {
                console.log(err);
                const data: Model[] = []; // try use "let"
                const total = 0;
                const res: IFindModelsResult<Model> = {
                    data,
                    total,
                };

                return res;
            });

        // const result: IFindModelsResult<Model> = {
        //     data,
        //     total,
        // };

        return result;
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

    async insertOne(newDocument: Model): Promise<Model> {
        // const partialEntity: QueryDeepPartialEntity<Entity>
        //     = entity as QueryDeepPartialEntity<Entity>;

        // const data = this.repository
        //     .insert(partialEntity)
        //     .then(res => res.raw[0]);

        // const data = new this.model(newDocument);
        // const result = data.save();
        const result = this.model.create<Model>(newDocument);

        return result;
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
