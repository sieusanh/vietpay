import { SchemaFactory } from '@nestjs/mongoose';
import { BaseModel } from './base.mongoose.model';

export const BaseSchema = SchemaFactory.createForClass(BaseModel);

BaseSchema.pre('save', function (err, doc) {
    console.log('============== post save hook doc ', doc);
    const leanObject = doc.toString();
    console.log('============== post save hook leanObject ', leanObject);

    return leanObject;
});
