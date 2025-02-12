import { SchemaFactory } from '@nestjs/mongoose';
import { AccountModel } from './accounts.model';

export const AccountSchema = SchemaFactory.createForClass(AccountModel);
