/**
 * Mongoose schema for customer personal information
 */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

export type customerDocument = CustomerPersonalInfo & Document;

@Schema({ validateBeforeSave: true })
export class CustomerPersonalInfo {

    @Prop()
    id: string;
    
    @Prop()
    name: string;

    @Prop({
        required: [true, 'Phone number is mandatory']
    })
    phone_number: string

    @Prop()
    email: string

    @Prop()
    address: string

    @Prop()
    password: string
}

export const CustomerSchema = SchemaFactory.createForClass(CustomerPersonalInfo);