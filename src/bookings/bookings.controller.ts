import { Controller , Get, Post, Body, Injectable} from '@nestjs/common';
import { BookingService } from './bookings.service';
import { BookingDto } from './bookings.dto';
import { IBooking } from './bookings.interface';
@Controller('bookings')
export class BookingController {

    constructor(private readonly bookingService: BookingService) {}

    @Get('getAllBookings')
    findAll(): Promise<IBooking[]> {
     return this.bookingService.findAll();
    }

    @Post('addBooking')
    create(@Body() bookingDto: BookingDto): Promise<IBooking> {
     return this.bookingService.create(bookingDto);
    }
}
