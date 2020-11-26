/**
 * Mongoose schema for branch collection
 */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type branchDocument = Branch & Document;

@Schema({ validateBeforeSave: true})
export class Branch{

    @Prop({
        required: true,
        unique: true
    })
    name: string;

    @Prop({
        required: true
    })
    slots: [];

    @Prop()
    technicians: [
        { 
            id: { 
                type : string,
                unique : true
            }, 
            name: string, 
            phone_number: string
        }
    ]

    @Prop()
    created_by: string

    @Prop()
    creation_date: Date


    @Prop()
    last_updated_by: string

    @Prop()
    last_updated_date: Date
}

export const BranchSchema = SchemaFactory.createForClass(Branch);