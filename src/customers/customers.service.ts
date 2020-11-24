/**
 * Provider Layer for customer related requests
 */

import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CustomerDto } from './customers.dto';
import { ICustomer } from './customers.interface'
import { v4 as uuid } from 'uuid';
const bcrypt = require('bcrypt');
const saltRounds = 10;

@Injectable()
export class CustomerService {

    constructor(@InjectModel('Customer') private readonly customerModel: Model<ICustomer>) { }

    /**
     * @returns list of all customers
    */ 
    async getCustomers(): Promise<ICustomer[]> {
        return await this.customerModel.find();
    }

    /**
     * Saves customer information in the database
     * @param customer : CustomerDto
     * @returns saved customer information
    */ 
    async saveCustomer(customer: CustomerDto): Promise<any> {
        try {
            let { password, alternate_drivers, vehicles } = customer;

            //Assign unique id to each driver using UUID
            alternate_drivers.forEach((driver) => {
                driver["id"] = uuid();
            });

            //Assign unique id to each vehicle using UUID
            vehicles.forEach(vehicle => {
                vehicle["id"] = uuid();
            })

            //Hash the password
            const hash = bcrypt.hashSync(password, saltRounds);
            customer["password"] = hash;

            const newCustomer = new this.customerModel(customer);
            return await newCustomer.save();
        } catch (err) {
            if (err.name === 'MongoError' && err.code === 11000) {
                //TBD: Error messages need to be refined, avoiding exposing key values in response
                return ({ status: false, message: (` '${Object.keys(err.keyValue)}' is already registered with us. Please login to continue!`) });
            } else {
                return ({ status: false, message: `${Object.keys(err.errors)[0]} : ${Object.values(err.errors)[0]}` })
            }
        }
    }
}
