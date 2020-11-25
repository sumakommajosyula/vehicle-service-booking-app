import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { BranchDto } from './branches.dto';
import { IBranch } from './branches.interface'
import { v4 as uuid } from 'uuid';

@Injectable()
export class BranchService {
    
    constructor(@InjectModel('Branch') private readonly branchModel:  Model<IBranch>) {}

    // getAlternateDrivers(){
    //     let jsonobj = {"Alternate Drivers" : "I am returning from customer service"}
    //     return jsonobj
    // }
    // registerCustomer(objFromUI){
    //     console.log("obj from UI ", objFromUI)
    //     let jsonobj = {"Customer" : "Your customer details are posted (service)"}
    //     return jsonobj
    // }
    
    async findAll(): Promise<IBranch[]> {
        return await this.branchModel.find();
    }

    //Create branch document in db
    async create(branch: BranchDto): Promise<IBranch> {
        

        //Assign unique id to each technician using UUID
        (branch.technicians).forEach((driver) => {
            driver["id"] = uuid();
        });
        console.log(branch);


        const newBranch = new this.branchModel(branch);
        return await newBranch.save(function (err, res) {
            if(err) {
                return err
            }
            else{
                return true
            }
        })
      
        
       }
     
    
}
