import { Controller, Get, Post, Body, Res, HttpStatus, HttpException } from '@nestjs/common';
import {BranchService} from './branches.service';
import{ BranchDto} from './branches.dto';
import {IBranch} from './branches.interface';
import { Response } from 'express';

@Controller('branches')
export class BranchController {
    constructor(private readonly branchService: BranchService) {}

    //Get the list of all branches
    @Get('listAllBranches')
    findAll(): Promise<IBranch[]> {
     return this.branchService.findAll();
    }

    //Register customer and his vehicle details
    @Post('addBranchDetails')
    create(@Res() res: Response, @Body() branchDto: BranchDto): Promise<IBranch> {
            res.status(HttpStatus.OK).json({status: true, message: "Your branch details have been registered with us!"});
            return this.branchService.create(branchDto);
       
    }
}

