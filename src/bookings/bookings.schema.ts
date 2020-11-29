/**
 * Mongoose schema for bookings collection
 */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {Document} from 'mongoose';
import * as mongoose from 'mongoose';
import {Branch} from '../branches/branches.schema';
import {CustomerPersonalInfo} from '../customers/schema/personal-info.schema';
import {Vehicle} from '../customers/schema/vehicle.schema';


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

@Prop({ type: mongoose.Schema.Types.Array, ref: Branch.name})
technician_id: [Branch]

@Prop({ type: String, ref: CustomerPersonalInfo.name})
driver_id: CustomerPersonalInfo

@Prop({ type: String, ref: Vehicle.name})
vehicle_id: Vehicle

@Prop()
created_by: String

@Prop({
    default: Date.now
}) 
creation_date: Date

@Prop()
last_updated_by: String

@Prop({
    default: Date.now
}) 
last_updated_date: Date
}
export const BookingSchema = SchemaFactory.createForClass(Booking);

