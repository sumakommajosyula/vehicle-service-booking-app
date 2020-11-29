/**
 * Interface for branches related HTTP requests
 */
import { Document } from 'mongoose';

export interface IBranch extends Document {
    id: string
    name:string
    slots: []
    technicians: [
      { 
        name: string, 
        phone_number: string
      }
    ]
}

