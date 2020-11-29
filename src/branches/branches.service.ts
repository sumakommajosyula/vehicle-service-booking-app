/**
 * Provider Layer for branch related requests
 */
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { BranchDto } from './branches.dto';
import { IBranch } from './branches.interface'
import { v4 as uuid } from 'uuid';
import { Cron } from '@nestjs/schedule';
const accountSid = 'ACdd4bc29c648a99750b2a454dd24f8caa'
const authToken = '51fd0505b665abbc63fa1a8ca43ac99e'
let client = require('twilio')(accountSid, authToken);
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
        return await this.branchModel.findById(branchId).exec();
    }

    /**
    * Saves customer information in the database
    * @param branchInfo : BranchDto
    * @returns saved branch information
    */    
    async create(branch: BranchDto): Promise<any> {
        
        try{
            if(branch.slots.length <10 || branch.slots.length > 10){
                let error = {status: false, message: "Branch should have 10 slots"}
                return error
            }
            if(branch.technicians.length <10 || branch.technicians.length > 10){
                let error = {status: false, message: "Branch should have 10 technicians"}
                return error
            }
            else{
                //Assign unique id to each technician using UUID
                (branch.technicians).forEach((technician) => {
                technician["id"] = uuid();
                });
                console.log(branch);
                const newBranch = new this.branchModel(branch);
                return await newBranch.save()
            }
            
       } catch(err){
         //Return error to controllers
         return (err)
        }
    }

    // /**
    // * @returns technician information for a particular branch using its Id
    // */
    getTechnicianInfoById = async (branchDetails) => {
        let techId = branchDetails.technicianId
    let ans = await this.branchModel.find({'technicians.id': techId}).select({ "technicians.phone_number": 1});
        if(ans.length !==0 && ans[0].technicians[0].phone_number === `${process.env.PHONE_NUMBER}`){
            this.handleCron(process.env.PHONE_NUMBER)
            return ans
        }
        else if(ans.length === 0){
            return false
        }
    }
    
    /**
    * Runs a cron job every minute to send SMS notification
    * @param : phone Number
    * @returns : Booking details to technician
    * Note: Details re hardcoded for testing
    */ 
    @Cron('45 * * * * *')
    async handleCron(phoneNumber) {
      console.log('***cron job is running every minute- for notification to technician.******')
        try {
            let ans = await client.messages.create({
              body: `Booking date: 5th Dec 2020, Slot: 10 am, Vehicle Number: TS-1156, Address: B block, FARC, Mumbai`  ,
              from: +12565989472,
              to: process.env.PHONE_NUMBER,
            });
            return ans
          }
        catch(err){
            return err
        }
    
    }
}
