import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ICustomer } from './customers.interface';
import { CustomerPersonalInfoDto } from './dto/customer-personal-info.dto';
const bcrypt = require('bcrypt');

@Injectable()
export class authMiddleware implements NestMiddleware {
    
    constructor(@InjectModel('Customer') private readonly customerModel: Model<ICustomer>) { }
    
    getCustomerInfoByPhoneNumber = async (phoneNumber) => {
        return await this.customerModel.find({ 'personal_info.phone_number': phoneNumber }).exec();
    }

    use( req: Request,res: Response, next: Function ){
        console.log('Requested middleware...');

        try {
            let { password, phone_number: phoneNumber } = req.body;

            this.getCustomerInfoByPhoneNumber(phoneNumber)
            .then(responseFromDb => {
                if(responseFromDb.length === 0){
                    //No data of user present for this mobile number
                }
                else{
                    let passwordMatch = bcrypt.compareSync(password, responseFromDb[0].personal_info.password); // true
                    console.log("password match", passwordMatch)

                }
            })
        }
        catch(err){

        }
    }

//   use(req: Request, res: Response, next: Function) {
//     console.log(req.body)

 
//     console.log('Requested middleware...');
//     next();
//   }
}

