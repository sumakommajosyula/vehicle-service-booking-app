/**
 * Controller layer for handling Booking related HTTP requests
*/

import { Controller , Get, Post, Body, Res, HttpStatus, Param } from '@nestjs/common';
import { BookingService } from './bookings.service';
import { BookingDto } from './bookings.dto';
import { IBooking } from './bookings.interface';
import { Response } from 'express';

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
    @Post()
    async create(@Body() bookingDto: BookingDto, @Res() res: Response){
        let bookingInformation = await this.bookingService.create(bookingDto);

        if (bookingInformation.status != undefined) {
            return res.status(HttpStatus.BAD_REQUEST).json(bookingInformation);
        }
        else{
            return res.status(HttpStatus.OK).json({ status: true, data: bookingInformation });
        }
    }

    /**
     * Gets list of service history for a vheicle 
     */
    @Get('getServiceHistory/:vehicleId')
    async getVehicleHistory(@Param('vehicleId') vehicleId, @Res() res: Response){
        console.log(vehicleId)
        let bookingInformation = await this.bookingService.getBookingInfoByVehicleId(vehicleId);
        console.log(bookingInformation)
        return res.status(HttpStatus.OK).json({ status: true, data: bookingInformation });
        
    }

}
