import { Module } from '@nestjs/common';
import { BookingController } from './bookings.controller';
import { BookingService } from './bookings.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BookingSchema } from './bookings.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'Booking', schema: BookingSchema }])],
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule {}
