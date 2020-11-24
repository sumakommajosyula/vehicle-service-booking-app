/**
 * Mongoose schema for customer collection
 */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import * as mongoose from 'mongoose'
import { Vehicle } from './vehicle.schema'

export type customerDocument = Customer & Document;

@Schema({ validateBeforeSave: true})
export class Customer{

  @Prop()
  name: string;

  @Prop({
    unique: [true, 'Phone number must be unique'],
    required: [true, 'Phone number is mandatory']
  })
  phone_number: string

  @Prop()
  email_address: string

  @Prop({
    type: String,
    required: [true, 'Address is mandatory']
  })
  address: string

  @Prop({
    required: [true, 'Password is mandatory']
  })
  password: string

  //TBD: Property to be changed to save only ids. All the alternate drivers to be created as new customer
  @Prop()
  alternate_drivers: [
    {
      id: {
        type : string,
        unique : true
      },
      name: string,
      phone_number: string
    }
  ]

  @Prop({type: mongoose.Schema.Types.Array, ref: Vehicle.name })
  vehicles: Vehicle

  @Prop()
  created_by: string

  @Prop()
  creation_date: Date

  @Prop()
  last_updated_by: string

  @Prop()
  last_updated_date: Date
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);