
import { Document } from 'mongoose';

export interface IBranch extends Document {
    name?:string;
    slots: []
     technicians: [{ name?: String, phone_number: Number}]
   }

