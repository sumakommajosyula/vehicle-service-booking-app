/**
 * Controller layer for handling Branch related HTTP requests
*/
import { Controller, Get, Post, Body, Res, HttpStatus, HttpException } from '@nestjs/common';
import {BranchService} from './branches.service';
import{ BranchDto} from './branches.dto';
import {IBranch} from './branches.interface';
import { Response } from 'express';

@Controller('branches')
export class BranchController {
    constructor(private readonly branchService: BranchService) {}

    /**
     * @returns list of all customers
     */
    @Get()
    findAll(): Promise<IBranch[]> {
     return this.branchService.findAll();
    }

    /**
     * Registers a branch along with technician and slot details
     * @param res : (default param) Express response object for sending the API response
     * @param branchDto : Request body object to be sent to the API
     * Format: 
     * {
        "name": (string) Name of the branch,
        "phone_number": (string) Contact number of the branch,
        "slots": (Array) List of slots in a branch,
        "address": (string) Address of the branch,
        "technicians": (Array)[  
            {
                "name": (string) Name of the alternate driver of the vehicle,
                "phone_number": (string) Contact number of the alternate driver
            }
        ]
    }
    */
    @Post()
    async create(@Res() res: Response, @Body() branchDto: BranchDto): Promise<any> {
        let response = await this.branchService.create(branchDto);
        console.log(response)
        res.status(HttpStatus.OK).json({status: true, message: "Your branch details have been registered with us!"});      
    }
}

