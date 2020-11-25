/**
 * Provider Layer for customer related requests
 */

import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CustomerPersonalInfoDto } from './dto/customer-personal-info.dto';
import { VehicleDto } from './dto/vehicle.dto';
import { AlterateDriverDto } from './dto/alternate-driver.dto'
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
     * @returns Customer information if phone number exists and matches
    */
    getCustomerInfoByPhoneNumber = async (phoneNumber) => {
        return await this.customerModel.find({ 'personal_info.phone_number': phoneNumber }).exec();
    }

    /**
     * @returns Vehicle details if vehicle number plate details match
    */
    getVehicleDetails = async (vehicleNumber) => {
        return await this.customerModel.find({ 'vehicles.number_plate': vehicleNumber }).exec();
    }

    /**
     * Updates password based on id
    */
    updatePassword = async (_id, password) => {
        return await this.customerModel.findByIdAndUpdate({ _id }, { password: password }).exec();
    }

    /**
     * Promise function to call 'getCustomerInfoByPhoneNumber' method
     * @returns profile id
     */
    getCustomerInfoByPhoneNumberPromise = async (driver) => {
        return  new Promise((resolve) => {
            this.getCustomerInfoByPhoneNumber(driver.phone_number).then(responseOfADDb => {
                if (responseOfADDb.length === 0) {
                    //phone number dosent exist in db, create a new profile
                    let profileId = uuid();
                    driver.id = profileId              
                    let customer = {
                        personal_info: driver,
                        vehicles: [],
                        alternate_drivers:[]
                    }
                    const driverAsCustomer = new this.customerModel(customer);
                    driverAsCustomer.save();
                    resolve(profileId)
                }
                else {
                    //phone number exists in db, he has a profile so pick that id and save in personal info
                    resolve(responseOfADDb[0].personal_info.id)
                }           
            });
        })
    }

    /**
     * Saves customer information in the database
     * @param personalInfo : CustomerPersonalInfoDto
     * @param vehicleInfo: VehicleDto
     * @param alternateDrivers: AlterateDriverDto
     * @returns saved customer information
    */
    async saveCustomer(
        personalInfo: CustomerPersonalInfoDto,
        vehicleInfo: VehicleDto,
        alternateDrivers: AlterateDriverDto[]
    ): Promise<any> {
        try {
            let { password, phone_number: phoneNumber } = personalInfo;

            let resultOfSaveCustomer = await this.getCustomerInfoByPhoneNumber(phoneNumber)
                .then(responseFromDb => {
                    if (responseFromDb.length === 0 || (responseFromDb.length !== 0 && !responseFromDb[0].personal_info.password)) {
                    //phone number dosent exist in db indicating that the user is new to the system

                        //Hash the password
                        const hash = bcrypt.hashSync(password, saltRounds);
                        personalInfo["password"] = hash;
                        personalInfo["id"]= uuid();

                        //For each alternate driver create a profile as customer
                        let promiseArray =[];
                        alternateDrivers.forEach((driver) => {
                            promiseArray.push(this.getCustomerInfoByPhoneNumberPromise(driver))
                        });

                        return Promise.all(promiseArray)
                        .then(alternateDriverIdsResponse => {
                            let customer = {
                                personal_info: personalInfo,
                                vehicles: vehicleInfo,
                                alternate_drivers: alternateDriverIdsResponse
                            }
                            const newCustomer = new this.customerModel(customer);

                            //Return the customer added data back as response
                            return newCustomer.save();
                        })               
                    }
                    else {
                        //If phone number and password both exist, he is a registered customer 
                        let error = { status: false, message: (` You are already registered with us. Please login to continue!`) };
                        throw error;
                    }

                })
                .catch(error => {
                    let errorMsg = { status: false, message: (` You are already registered with us. Please login to continue!`) };
                    return errorMsg;
                })

            return resultOfSaveCustomer
        } catch (err) {
            //Return error to controllers
            return (err)
        }
    }
}
