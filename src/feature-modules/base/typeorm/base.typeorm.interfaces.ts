import { BaseEntity } from './base.typeorm.entity';
import { CODE } from 'src/common';
import {
    FindManyOptions,
    FindOneOptions,
    InsertResult,
    UpdateResult,
    DeleteResult,
} from 'typeorm';

export interface IFindEntitiesResult<Entity extends BaseEntity> {
    data: Entity[];
    total: number;
}

export interface IBaseRepository<Entity extends BaseEntity> {
    insertOne(entity: Entity): Promise<Entity>;
    insertMany(entities: Entity[]): Promise<InsertResult>;
    findOne(options: FindOneOptions<Entity>): Promise<Entity>;
    findMany(
        options: FindManyOptions<Entity>,
    ): Promise<IFindEntitiesResult<Entity>>;
    updateOne(id: CODE, entity: Entity): Promise<UpdateResult>;
    deleteOne(id: CODE): Promise<DeleteResult>;
}
