// import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {Document} from 'mongoose';
import * as mongoose from 'mongoose';
import {Branch} from '../branches/branches.schema';
import {Customer} from '../customers/schema/customers.schema';



export type BookingDocument = Booking & Document;

@Schema()
export class Booking{

@Prop()
booking_date: Date;

@Prop()
slot: String;

@Prop()
address: string;

@Prop()
status: string;

@Prop({ type: mongoose.Schema.Types.ObjectId, ref: Branch.name})
branch_id: Branch

// @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Branch.name})
// technician_id: [Branch]

// @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Customer.name})
// driver_id: Customer

// @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Customer.name})
// vehicle_id: Customer

@Prop()
created_by: String

@Prop()
creation_date: Date


@Prop()
last_updated_by: String

@Prop()
last_updated_date: Date
}
export const BookingSchema = SchemaFactory.createForClass(Booking);

