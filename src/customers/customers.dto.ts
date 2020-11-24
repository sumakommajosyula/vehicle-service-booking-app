/**
 * Data transfer object for customer related HTTP requests
 */
export class CustomerDto {
    name: string
    phone_number: string
    email_address: string
    address: string
    password: string
    alternate_drivers: [
      {
        name: string,
        phone_number: string
      }
    ]
    vehicles: [
      {
        number_plate: string,
        brand: string,
        model: string, 
        category: string, 
        fuel_type: string
      }
    ]
  }