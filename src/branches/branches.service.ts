/**
 * Provider Layer for branch related requests
 */
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { BranchDto } from './branches.dto';
import { IBranch } from './branches.interface'
import { v4 as uuid } from 'uuid';

@Injectable()
export class BranchService {
    
    constructor(@InjectModel('Branch') private readonly branchModel:  Model<any>) {}

    /**
     * @returns list of all branches and its technicians
    */
    async findAll(): Promise<IBranch[]> {
        return await this.branchModel.find();
    }

    /**
    * @returns branch information for a particular branch using its Id
    */
    getBranchInfoById = async (branchId) => {
        console.log("branch id in method");
        console.log(branchId)
        return await this.branchModel.find({_id: branchId}).exec();
    }

    /**
    * Saves customer information in the database
    * @param branchInfo : BranchDto
    * @returns saved branch information
    */    
    async create(branch: BranchDto): Promise<IBranch> {
        
        try{
            //Assign unique id to each technician using UUID
            (branch.technicians).forEach((technician) => {
                technician["id"] = uuid();
            });
            console.log(branch);
            const newBranch = new this.branchModel(branch);
            return await newBranch.save()
            
       } catch(err){
         //Return error to controllers
         return (err)
        }
    }
}
