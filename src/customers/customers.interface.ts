/**
 * Interface for customer related HTTP requests
 */
import { Document } from 'mongoose';

export interface ICustomer extends Document {
    personal_info: {
        id: string
        name: string
        phone_number: number
        email_address: string
        address: string
        password: string
    }
    vehicles: [
        {
            number_plate: string,
            brand: string,
            model: string,
            category: string,
            fuel_type: string
        }
    ]
    alternate_drivers: [
        {
            name: string,
            phone_number: string
        }
    ]
}