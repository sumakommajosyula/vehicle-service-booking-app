import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 as uuid } from 'uuid';

export type branchDocument = Branch & Document;
@Schema({ validateBeforeSave: true})
export class Branch{

@Prop()
name: string;

@Prop()
slots: [];

@Prop()
technicians: [{id: { type : String , unique : true}, name: String, phone_number: String}]


@Prop()
created_by: String

@Prop()
creation_date: Date


@Prop()
last_updated_by: String

@Prop()
last_updated_date: Date
    

}
export const BranchSchema = SchemaFactory.createForClass(Branch);