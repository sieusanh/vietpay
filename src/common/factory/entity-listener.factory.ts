import {
    // DataSource,
    EntitySubscriberInterface,
    EventSubscriber,
    InsertEvent,
} from 'typeorm';
// import { InjectDatsaSource } from '@nestjs/typeorm';
import { BaseEntity } from 'src/feature-modules/base';

@EventSubscriber() // UserSubscriber
export class EntityListenerService<Entity extends BaseEntity, DataSource>
    implements EntitySubscriberInterface
{
    // @InjectDataSource()
    // protected dataSource: DataSource;

    constructor(private dataSource: DataSource) {
        // this.dataSource.subscribers.push(this);
    }

    listenTo() {
        return BaseEntity;
    }

    beforeInsert(event: InsertEvent<Entity>) {
        console.log(`BEFORE USER INSERTED: `, event.entity);
    }
}
