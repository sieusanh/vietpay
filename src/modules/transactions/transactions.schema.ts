import { SchemaFactory } from '@nestjs/mongoose';
import { Transaction } from './transactions.model';

export const Transactionschema = SchemaFactory.createForClass(Transaction);

Transactionschema.pre<Transaction>('save', async function (next) {
    // this.constructor.findOne();
    const doc = Transaction;
    const a = 
    // const count = await doc.fin
    
    // doc.id = 'a';
    next();
});
