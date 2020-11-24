/**
 * Interface for customer related HTTP requests
 */
import { Document } from 'mongoose';

export interface ICustomer extends Document {
    name: string
    phone_number: number
    email_address: string
    address: string
    password: string
    alternate_drivers: [
        {
            name: string,
            phone_number: string
        }
    ]
    vehicles: [
        {
            number_plate: string,
            brand: string,
            model: string,
            category: string,
            fuel_type: string
        }
    ]
}