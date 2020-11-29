/**
 * Provider Layer for branch related requests
 */

import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { BookingDto } from './bookings.dto';
import { IBooking } from './bookings.interface';
import { BranchService } from 'src/branches/branches.service';
import { CustomerService } from 'src/customers/customers.service';

const accountSid = 'ACdd4bc29c648a99750b2a454dd24f8caa'
const authToken = '51fd0505b665abbc63fa1a8ca43ac99e'
let client = require('twilio')(accountSid, authToken);

@Injectable()
export class BookingService {
    
    constructor(@InjectModel('Booking') private readonly bookingModel:  Model<IBooking>,
    private readonly branchService: BranchService, private readonly customerService: CustomerService){}

    /**
     * @returns list of all bookings made
    */
    async findAll(): Promise<IBooking[]> {
        let result = await this.bookingModel.find();
        return result;
    }

    /**
     * @returns list of all booking information for a branch
    */
    getBookingInfoByBranchId = async (branchId) => {
        return await this.bookingModel.find({branch_id : branchId}).exec()
    }

    /**
     * @returns list of all booking information for a branch
    */
    getBookingInfoByVehicleId = async (vehicleId) => {
        return await this.bookingModel.find({vehicle_id : vehicleId}).exec()
    }

    /**
     * Format all dates to get a standard format for comparison
     */
    formatDate = (date) => {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
    
        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;
    
        return [year, month, day].join('-');
    }

    /**
    * Saves booking related data
    * @param booking : BookingDto
    * @returns booked information
    */   
    async create(booking: BookingDto): Promise<any> {
        try{
            let currentdate = this.formatDate(Date.now());
            let UIBookingDate = this.formatDate(booking.booking_date);
            if(UIBookingDate === currentdate || UIBookingDate < currentdate){
                return({status: false, message: "You cannot book for current / previous dates"}) 
            }
            else{

                let slotsInformation = await this.getBookingInfoByBranchId(booking.branch_id)
                .then( async responseOfBookingData => {
                    let listOftechniciansBooked = [];

                    //Loop through booked information list
                    responseOfBookingData.forEach(async bookingData => {
                        let bookedDate = this.formatDate(bookingData.booking_date)
                        
                        //check if technician is booked or free
                        if(UIBookingDate === bookedDate){
                            console.log("This technician is booked")
                            listOftechniciansBooked.push(bookingData)
                        }
                        else{
                            console.log("This technician is free")
                        }

                    })
                    //Call to get get list of technicians in branch collection using branch id 
                    let getBranchInfo = await this.branchService.getBranchInfoById(booking.branch_id)
                    getBranchInfo.technicians.forEach(element => {
                        element["technician_id"] = element.id;
                        delete element["id"]; 
                    });
                    let listOftechniciansFromBranch = getBranchInfo.technicians;

                    //Function to compare booked technicians list and available list
                    function comparer(otherArray){
                        return function(current){
                            return otherArray.filter(function(other){
                                return other.technician_id == current.technician_id
                            }).length == 0;
                        }
                    }
                            
                    let onlyInA = listOftechniciansFromBranch.filter(comparer(listOftechniciansBooked));
                    let onlyInB = listOftechniciansBooked.filter(comparer(listOftechniciansFromBranch));
                      
                    //Gets array of technicians that are still available
                    let result = onlyInA.concat(onlyInB);

                    //Get vehicle list using vehicle id and check wether vehicle category is SUV
                    //if SUV assign 2 technicians
                    let vehicleCategory;
                    let vehicleList = await this.customerService.getVehicleDetailsById(booking.vehicle_id);
                    (vehicleList[0].vehicles).forEach((vc) => {
                        console.log("vc")
                        console.log(vc["id"])
                        if(vc.category === "SUV" && vc["id"] === booking.vehicle_id) vehicleCategory = vc.category
                    })
                    console.log(vehicleCategory)

                        if(result.length > 1 && vehicleCategory === "SUV"){
                            //Technicians are available
                            booking["technician_id"]= [];
                            booking.technician_id.push(result[0].technician_id, result[1].technician_id);
                            const newBooking = new this.bookingModel(booking);
                            return await newBooking.save();                                                       
                        }
                        else if(result.length != 0){
                            console.log("in else if loop of SUV ---")
                            booking["technician_id"] = result[0].technician_id
                            const newBooking = new this.bookingModel(booking);
                            return await newBooking.save();  
                        }
                        else{
                            //No technicians available
                            console.log("No technicians available for this slot");
                            return({status: false, message: "no technicians available for this slot"}) 
                        }  
                                                
                })       
                return slotsInformation
            }
        }
        catch(err){
            return (err)
        }
    }
       

    //TBD => get service history with all ids decoded
    async getServiceHistory(booking): Promise<any> {
        try{
            let id = booking.vehicle_id
            console.log(id)
            let bookingData = await this.getBookingInfoByVehicleId(id)
            .then(async bookingDetailsResponse => {
                console.log("response booking db")
                console.log(bookingDetailsResponse)
                let vehicleServiceHistoryObject = [];
                bookingDetailsResponse.forEach( async booking => {
                    let vehicleData = await this.customerService.getVehicleDetailsById(booking.vehicle_id)
                })


            })
        }
        catch{

        }
    }

}
