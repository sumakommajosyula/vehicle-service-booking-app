/**
 * Data transfer object for booking related information
 */
export class BookingDto {    
    booking_date: Date
    slot: string
    branch_id: string
    driver_id: string
    vehicle_id: string
    technician_id: any[]
    address: string
    status: string
  }