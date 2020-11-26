/**
 * Provider Layer for branch related requests
 */

import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { BookingDto } from './bookings.dto';
import { IBooking } from './bookings.interface';
import { BranchService } from 'src/branches/branches.service';

@Injectable()
export class BookingService {
    
    constructor(@InjectModel('Booking') private readonly bookingModel:  Model<IBooking>,
    private readonly branchService: BranchService){}

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
        return await this.bookingModel.find({branch_id : branchId}).populate('branch_id')
    }

    /**
    * Saves booking related data
    * @param booking : BookingDto
    * @returns booked information
    */   
    async create(booking: BookingDto): Promise<IBooking> {
        try{
            //Call to check which slots are booked
            let slotsInformation = await this.getBookingInfoByBranchId(booking.branch_id)
            .then( responseOfBookingData => {

                responseOfBookingData.forEach(async bookingData => {

                    if(bookingData.slot === booking.slot){
                        //slot is booked: TBD => Logic to throw error saying this slot is booked
                        console.log("sorry this slot is occupied")
                    }
                    else{

                        /** TBD =>
                         * slot is available
                         * check available technicians to assign
                         * Get booked technicians list from Booking collection for that branch
                         * Compare it with list of technicians alloted for a branch
                         * If technicians are unassigned, book one of them
                         */

                        //FS: using branch id get list of technicians
                        let getBranchInfo = await this.branchService.getBranchInfoById(booking.branch_id)
                        let listOftechniciansFromBranch = getBranchInfo[0].technicians
                        console.log(listOftechniciansFromBranch)

                        //SS: Now get list of technicians in booking collection
                        console.log("list of techs in booking table")
                        console.log(responseOfBookingData[0].technician_id)

                        if (listOftechniciansFromBranch.some(e => e.id === responseOfBookingData[0].technician_id)) {
                            console.log("Technician assigned")
                        }
                        else{
                            console.log("Technician unassigned")
                        }
                    }
                })
                
            })
            

            // .then((resFromPreviousTene)=> {

            //     //FS: using branch id get list of technicians
            //     console.log("booking.branch_id")
            //     console.log(booking.branch_id)
            //     this.getBranchInfoById(booking.branch_id)
            //     .then(responseFromBranch => {
            //         let listOftechniciansFromBranch = responseFromBranch
            //         console.log('.then response')
            //         console.log(listOftechniciansFromBranch)
                    
            //     })
            //     .catch(error)
            // })
            // .catch(error)
            const newBooking = new this.bookingModel(booking);
            //return await newBooking.save();
            return newBooking
     
        }
        catch(err){

        }
    }
}
