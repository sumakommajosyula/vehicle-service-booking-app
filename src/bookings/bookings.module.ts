/**
 * Module for booking related requests
 */

import { Module } from '@nestjs/common';
import { BookingController } from './bookings.controller';
import { BookingService } from './bookings.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BookingSchema } from './bookings.schema';
import { BranchModule } from 'src/branches/branches.module';
import { CustomerModule } from 'src/customers/customers.module';

@Module({
    imports: [BranchModule, CustomerModule, MongooseModule.forFeature([{ name: 'Booking', schema: BookingSchema }])],
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule {}
