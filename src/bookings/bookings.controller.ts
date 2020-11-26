/**
 * Controller layer for handling Booking related HTTP requests
*/

import { Controller , Get, Post, Body, Injectable} from '@nestjs/common';
import { BookingService } from './bookings.service';
import { BookingDto } from './bookings.dto';
import { IBooking } from './bookings.interface';
@Controller('bookings')
export class BookingController {

    constructor(private readonly bookingService: BookingService) {}

    /**
     * @returns list of all bookings
     */
    @Get()
    findAll(): Promise<IBooking[]> {
     return this.bookingService.findAll();
    }

    /**
     * Creates a booking 
     */
    @Post('addBooking')
    create(@Body() bookingDto: BookingDto): Promise<IBooking> {
     return this.bookingService.create(bookingDto);
    }
}
