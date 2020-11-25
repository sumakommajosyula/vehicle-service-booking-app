import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { BookingDto } from './bookings.dto';
import { IBooking } from './bookings.interface';
@Injectable()
export class BookingService {
    
    constructor(@InjectModel('Booking') private readonly bookingModel:  Model<IBooking>) {}
 
    async findAll(): Promise<IBooking[]> {
        let result = await this.bookingModel.find();
        
        console.log(result);
        return result;
    }
    async create(booking: BookingDto): Promise<IBooking> {
        const newBooking = new this.bookingModel(booking);
        return await newBooking.save();
       }
     
    
}
