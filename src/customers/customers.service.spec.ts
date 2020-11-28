import { Test, TestingModule } from '@nestjs/testing';
import { CustomerService } from './customers.service';
import { AlterateDriverDto } from './dto/alternate-driver.dto';
import { CustomerPersonalInfoDto} from './dto/customer-personal-info.dto';
import { VehicleDto } from './dto/vehicle.dto';
import {CustomerModule} from './customers.module'
import { MongooseModule } from '@nestjs/mongoose';
import { CustomerSchema} from './schema/customers.schema'
import { VehicleSchema} from './schema/vehicle.schema'


describe('customer', () => {
  let service: CustomerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CustomerModule, 
        MongooseModule.forRoot('mongodb+srv://Suma:suma@1234@cluster0.fxwqa.mongodb.net/vehicle-service-booking-test?retryWrites=true&w=majority'),
        MongooseModule.forFeature([
          {
            name: 'Customer',
            schema: CustomerSchema
          },
          {
            name: 'Vehicle',
            schema: VehicleSchema
          }
        ])
      ],
      providers: [CustomerService],
    }).compile();

    service = module.get<CustomerService>(CustomerService);
  });

//   it('should be able to get the list of all customers', async() => {
//     const expectedOutput = 
//         {"_id":
//         {"$oid":"5fbfacdf34291219d71e855c"},
//         "alternate_drivers":["e3e33488-3b91-4833-b7cd-66efeb2609de","cb353101-b74b-4250-93da-0c12dc7d0049"],"vehicles":[{"number_plate":"67839-90-TS","registration_num":"RE713","brand":"Mini-Cooper","model":"Mo2","category":"Hatchback","fuel_type":"petrol","id":"cb353101-b74b-4250-93da-0c12dc7d0049"}],"personal_info":{"name":"Alina","phone_number":"889","email":"alex@gmail.com","address":"Hyderabad, Telengana","password":"$2b$10$yv7y1m4wRYabZrPV7t92rujb52CTkYkqAQ1SQewgnDyIB5yc6h28a","id":"3b1e4166-6d99-432b-a872-ec69b20f2187","token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZV9udW1iZXIiOiI4ODkiLCJpYXQiOjE2MDY1MDM2NjZ9._Jg2AhTXef-E9k0QlMqK0DinBNTuOHxsPj6a0wGP1o0"},"__v":{"$numberInt":"0"}}
    
//     const customerData = await service.getCustomers()
//     expect(service).toBeDefined();
//   });

  it('should be able to save a customer', async() => {
    //const expectedOutput 

    let personal_info = {
        "id": "123",
    "name": "Alina",
    "phone_number": "889",
    "email": "alex@gmail.com",
    "address": "Hyderabad, Telengana",
    "password": "12345Passwrd"
    }
    let vehicleInfo = [
    {
        "number_plate": "67839-90-TS",
        "registration_num": "RE713", 
        "brand": "Mini-Cooper",
        "model": "Mo2",
        "category": "Hatchback",
        "fuel_type": "petrol"
    }
]
    let alternateDrivers = [
        {"name": "Soumya", "phone_number": "12213"}
    ]
let pinfo = Object.assign(new CustomerPersonalInfoDto, personal_info)
let vinfo = Object.assign(new VehicleDto, vehicleInfo)
let adinfo = Object.assign(new AlterateDriverDto, alternateDrivers )

// dtoObjecct.name = "Alina",
// dtoObjecct.phone_number = "9920369726",
// dtoObjecct.password = "1234",
// dtoObjecct.email = "kaysuma05@g.com",
// dtoObjecct.address = "Hyderabad"

// let dtoVheicleObject = new VehicleDto()

// dtoVheicleObject[0].brand = "Mini-Cooper"
// dtoVheicleObject[0].category = "Hatchback"
// dtoVheicleObject[0].fuel_type = "petrol"
// dtoVheicleObject[0].model =  "Mo2"
// dtoVheicleObject[0].number_plate = "67839-90-TS"

// let dtoADObject = new AlterateDriverDto()

// dtoADObject.name = "Soumya",
// dtoADObject.phone_number= "88867121"
//expect(service).toBeDefined();
const customerData = await service.saveCustomer(pinfo,vinfo,adinfo)
console.log("Test : customerData");
console.log(customerData)
//expect(service).toEqual();
 });
});
