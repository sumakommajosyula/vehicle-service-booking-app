/**
 * Mongoose schema for customer collection
 */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import * as mongoose from 'mongoose'
import { CustomerPersonalInfo } from './personal-info.schema';
import { Vehicle } from './vehicle.schema'

export type customerDocument = Customer & Document;

@Schema({ validateBeforeSave: true })
export class Customer {

  @Prop()
  personal_info: CustomerPersonalInfo

  @Prop({ type: mongoose.Schema.Types.Array, ref: Vehicle.name })
  vehicles: Vehicle

  @Prop()
  alternate_drivers: [
    { id: string }
  ]

  @Prop()
  created_by: string

  @Prop({
    default: Date.now
  })
  creation_date: Date

  @Prop()
  last_updated_by: string

  @Prop({
    default: Date.now
  })
  last_updated_date: Date
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);