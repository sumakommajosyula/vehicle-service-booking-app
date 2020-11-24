/**
 * Mongoose schema for customers' vehicle property
 */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type VehicleDocument = Vehicle & Document;

@Schema({ validateBeforeSave: true})
export class Vehicle{
    @Prop()
    id: string
    
    @Prop()
    number_plate: string
    
    @Prop()
    brand: string
    
    @Prop()
    model: string
    
    @Prop()
    category: string
}

export const VehicleSchema = SchemaFactory.createForClass(Vehicle);