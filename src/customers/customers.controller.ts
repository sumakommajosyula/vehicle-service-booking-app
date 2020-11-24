/**
 * Controller layer for handling customer related HTTP requests
 */

import { Controller, Get, Post, Body, Res, HttpStatus} from '@nestjs/common';
import {CustomerService} from './customers.service';
import{ CustomerDto} from './customers.dto';
import {ICustomer} from './customers.interface';
import { Response } from 'express';

@Controller('customer')
export class CustomerController {
    constructor(private readonly customerService: CustomerService) {}

    /**
     * @returns list of all customers
     */
    @Get()
    getCustomers(): Promise<ICustomer[]> {
        return this.customerService.getCustomers();
    }

    /**
     * Registers a customer along with his/her vehicle and alternate driver details
     * @param res : (default param) Express response object for sending the API response
     * @param customerDto : Request body object to be sent to the API
     * Format: 
     * {
        "name": (string) Name of the customer,
        "phone_number": (string) Contact number of the customer,
        "email_address": (string) Email id of the customer,
        "address": (string) Address of the customer,
        "password": (string) Sign In password,
        "vehicles": [
            {
                "number_plate": (string) Vehicle number as on the number plate, 
                "brand": (string) Brand of the vehicle (e.g. BMW), 
                "model": (string) Model of the selected vehicle brand,
                "category": (string) Hatchback/Sedan/SUV,
                "fuel_type": (string) Petrol/Diesel/Electric
            }
        ],
        "alternate_drivers": (Array)[  
            {
                "name": (string) Name of the alternate driver of the vehicle,
                "phone_number": (string) Contact number of the alternate driver
            }
        ]
    }
    */
    @Post()
    async saveCustomer(@Res() res: Response, @Body() customerDto: CustomerDto) {
           
        let customerDetails = await this.customerService.saveCustomer(customerDto);

        if(!customerDetails.status){
            return res.status(HttpStatus.BAD_REQUEST).json(customerDetails);
        }
        else{
            return res.status(HttpStatus.OK).json({status: true, data: customerDetails});
        }          
    }
}