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

var jwt = require('jsonwebtoken');
const tokenPassword = process.env.TOKEN_PASSWORD;

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
    * @returns get a customer's details
    */
    async getCustomerDetails(customerId: string): Promise<ICustomer[]> {
        return await this.customerModel.find({ 'personal_info.id': customerId });
    }
    
    /**
     * @returns Customer information if phone number exists and matches
    */
    getCustomerInfoByPhoneNumber = async (phoneNumber) => {
        return await this.customerModel.find({ 'personal_info.phone_number': phoneNumber }).exec();
    }

    /**
     * @returns Vehicle details if vehicle number plate match
    */
    getVehicleDetails = async (vehicleNumber) => {
        return await this.customerModel.find({ 'vehicles.number_plate': vehicleNumber }).exec();
    }

    /**
     * @returns Vehicle details if vehicle number plate match
    */
    getVehicleDetailsById = async (vehicleId) => {
        console.log("vehicle id: customer")
        console.log(vehicleId)
        return await this.customerModel.find({ 'vehicles.id': vehicleId }).exec();
    }

    /**
     * Updates password based on id
    */
    updatePassword = async (id, password, alternateDrivers, vehicleInfo) => {
        return await this.customerModel.findOneAndUpdate({'personal_info.id': id}, { 'personal_info.password': password, 
            alternate_drivers: alternateDrivers, vehicles: vehicleInfo}).exec();
    }

    /**
     * Updates token based on phone number
    */
    updateToken = async (phone_number, token) => {
    return await this.customerModel.findOneAndUpdate({'personal_info.phone_number': phone_number}, 
    { 'personal_info.token': token}).exec();
    }
    /**
     * Promise function to call 'getVehicleDetails' method
     * @returns profile id
     */
    getVehicleDetailsPromise= async (vehicle) => {
        console.log("inside veh promise")
        return  new Promise((resolve) => {
            this.getVehicleDetails(vehicle).then(responseVehicleDetails => {
                if (responseVehicleDetails.length === 0) {
                    console.log("new vehicle")
                    resolve(true)
                }
                else {
                    //vehicle number exists in db
                    console.log("old vehicle")
                    resolve(false)
                }           
            });
        })
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
     * Login the customer using mobile number and password
    */
    async loginCustomer(loginData: CustomerPersonalInfoDto) : Promise<any>{
        try{
            let {phone_number, password} = loginData
            let customerData = await this.getCustomerInfoByPhoneNumber(phone_number)
            .then( async responseFromDb => {
                if(responseFromDb.length === 0){
                    //No data present for phone number
                    console.log("Invalid login details")
                    let error = { status: false, message: (`Invalid Login details`) };
                    return error;
                }
                else{
                    let passwordMatch = bcrypt.compareSync(password, responseFromDb[0].personal_info.password);
                    console.log("password match", passwordMatch)
                    if(passwordMatch){
                        var token = jwt.sign({ phone_number: phone_number }, tokenPassword);
                
                        //save new token in db 
                        let updatedData = await this.updateToken(phone_number, token);

                        let obj = {
                            personalInfo: updatedData.personal_info
                        }
                        delete obj.personalInfo['address']
                        delete obj.personalInfo['name']
                        delete obj.personalInfo['password']
                        delete obj.personalInfo['email']
                        delete obj.personalInfo['phone_number']

                        console.log(obj)
                      
                        return (obj)
                    }
                    else{
                        let error = { status: false, message: (`Invalid Login details`) };
                        return error;
                    }                   
                }
            })
            return customerData
        }catch(err){
            return(err)
        }
    }

    /**
     * Find the token
    */
    verifyToken = async (token) => {
        return await this.customerModel.find({ 'personal_info.token': token }).exec();
    }

    /**
     * Fucnction to validate phone number
     * @param: Phone number
     * @returns: true / false
     */
    validatePhoneNumber = (phoneNumber) =>{
        const regex =/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
       //const regex = /^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/
       console.log(regex.test(phoneNumber))
       return(regex.test(phoneNumber))

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
        vehicleInfo: VehicleDto[],
        alternateDrivers: AlterateDriverDto[]
    ): Promise<any> {
        try {
            let { password, phone_number: phoneNumber } = personalInfo;

            //let validatePhoneNumber = this.validatePhoneNumber(phoneNumber);
            let resultOfSaveCustomer = await this.getCustomerInfoByPhoneNumber(phoneNumber)
                .then(responseFromDb => {
                    //if(validatePhoneNumber){
                        let callVehiclePromise;
                        vehicleInfo.forEach((vehicle) => {
                            vehicle["id"] = uuid();
                            callVehiclePromise = this.getVehicleDetailsPromise(vehicle.number_plate)
                        })
                        return Promise.all([callVehiclePromise])
                        .then( vehicleInfoResponse => {
                            if(vehicleInfoResponse[0]){
                                //Vehicle is new and not registered
                                if (responseFromDb.length === 0 ) {
                                    //phone number dosent exist in db indicating that the user is new to the system
                
                                        //Hash the password
                                        const hash = bcrypt.hashSync(password, saltRounds);
                                        personalInfo["password"] = hash;
                                        personalInfo["id"]= uuid();
                
                                        //For each alternate driver create a profile as customer
                                        let callPromise;
                                        alternateDrivers.forEach((driver) => {
                                            callPromise= (this.getCustomerInfoByPhoneNumberPromise(driver))
                                        });
                                    
                                        return Promise.all([callPromise])
                                        .then(alternateDriverIdsResponse => {
                                            console.log("response from promise");
                                            console.log(alternateDriverIdsResponse)
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
                                    else if(!responseFromDb[0].personal_info.password){
                                        //Phone number is present and password is not present => AD user
                                        //Pick id from db and update the password, assign his own set of Ads and vehicles, if any
                
                                        //For each alternate driver create a profile as customer
                                        let promiseArray =[];
                                        alternateDrivers.forEach((driver) => {
                                            promiseArray.push(this.getCustomerInfoByPhoneNumberPromise(driver))
                                        });
                
                                        return Promise.all(promiseArray)
                                        .then(alternateDriverIdsResponse => {
                
                                            //Hash the password
                                            const hash = bcrypt.hashSync(password, saltRounds);
                                            personalInfo.password = hash
                                            return this.updatePassword(responseFromDb[0].personal_info.id, hash, alternateDriverIdsResponse, vehicleInfo)
                                            
                                        })        
                
                                    }
                                    else {
                                        //If phone number and password both exist, he is a registered customer 
                                        let error = { status: false, message: (` You are already registered with us. Please login to continue!`) };
                                        throw error;
                                    }
                
                            }
                            else{
                                //vehicle is already registered
                                console.log("its old vehicle")
                                let error = { status: false, message: (` Vehicle is already registered with an owner.`) };
                                throw error;
                            }
                        })
                    //}
                    // else{
                    //     let errorMsg =  "Please enter valid phone number, with no spaces and country code";
                    //     throw errorMsg
                    // }
                })
                .catch(error => {
                    let errorMsg = { status: false, message: error };
                    return errorMsg;
                })

            return resultOfSaveCustomer
        } catch (err) {
            //Return error to controllers
            return (err)
        }
    }
}
