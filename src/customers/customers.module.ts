/**
 * Module to import all customer related controllers, providers & mongoose schema
 */

import { Module } from '@nestjs/common';
import { CustomerController } from './customers.controller';
import { CustomerService } from './customers.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomerSchema } from './schema/customers.schema';
import { VehicleSchema } from './schema/vehicle.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Customer',
        schema: CustomerSchema
      },
      {
        name: 'Vehicle',
        schema: VehicleSchema
      }
    ])
  ],
  controllers: [CustomerController],
  providers: [CustomerService],
})

export class CustomerModule { }
