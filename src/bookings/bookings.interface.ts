
import {Document} from 'mongoose';

export interface IBooking extends Document {
    booking_date: Date;
    slot?: String;
    address?: string;
    status?: string;
    branch_id?: String;
    technician_id?: [String] ;
    driver_id?: String ;
    vehicle_id?: String ;
    created_by?: String ;
    creation_date: Date ;
    last_updated_by?: String ;
    last_updated_date: Date ;
   }