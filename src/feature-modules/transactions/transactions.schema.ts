import { SchemaFactory } from '@nestjs/mongoose';
import { TransactionModel } from './transactions.model';

export const Transactionschema =
    SchemaFactory.createForClass(TransactionModel);

// Transactionschema.pre<TransactionModel>('save', async function (next) {
//     // this.constructor.findOne();
//     const doc = TransactionModel;
//     const a =
//         // const count = await doc.fin

//         // doc.id = 'a';
//         next();
// });
