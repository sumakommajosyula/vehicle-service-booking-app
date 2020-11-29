/**
 * Mongoose schema for customers' vehicle property
 */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { validate, Contains, IsDate } from 'class-validator';

export type VehicleDocument = Vehicle & Document;

@Schema({ validateBeforeSave: true})
export class Vehicle{
    @Prop()
    id: string
    
    @Prop({
        type: String,
        unique: [true, 'Phone number must be unique'],
        required: [true, 'Vehicle Number is mandatory']
      })
    number_plate: string
    
    @Prop({
        type: String,
        required: [true, 'Vehicle brand is mandatory']
      })
    brand: string
    
    @Prop({
        type: String,
        required: [true, 'Vehicle brand model is mandatory']
      })
    model: string
    
    @Prop({
        type: String,
        required: [true, 'Vehicle category is mandatory']
      })
    category: string

}

export const VehicleSchema = SchemaFactory.createForClass(Vehicle);