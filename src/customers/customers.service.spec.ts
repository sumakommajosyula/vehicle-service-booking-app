import { Test } from '@nestjs/testing';

import { CustomerService } from './customers.service';
import { CustomerController } from './customers.controller';
import { AlterateDriverDto } from './dto/alternate-driver.dto';
import { CustomerPersonalInfoDto } from './dto/customer-personal-info.dto';
import { VehicleDto } from './dto/vehicle.dto';
import { AppTestModule } from '../app.test.module';

describe('Testing Customers Service', () => {
  let customerService: CustomerService
  let customerController: CustomerController

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        AppTestModule
      ]
    }).compile()

    customerService = moduleRef.get<CustomerService>(CustomerService);
    customerController = moduleRef.get<CustomerController>(CustomerController);
  })

  describe('saveCustomer', () => {
    it('should create a new customer entry in the database', async () => {
      const expectedResult = {}

      let customer = {
        personal_info: {
          "name": "Customer 2",
          "phone_number": "+60877777777",
          "email": "customer2@email.com",
          "address": "Hyderabad, Telengana",
          "password": "12345Passwrd"
        },
        vehicles: [
          {
            "number_plate": "ABC12345",
            "brand": "Mini-Cooper",
            "model": "MC-01",
            "category": "Hatchback",
            "fuel_type": "Petrol"
          }
        ],
        alternate_drivers:
          [
            {
              "name": "AD1", "phone_number": "+91222345678"
            }
          ]
      }

      let response = await customerService.saveCustomer(
        <CustomerPersonalInfoDto>customer.personal_info,
        <VehicleDto[]>customer.vehicles,
        <AlterateDriverDto[]>customer.alternate_drivers)
      console.log('response', response)


      let status = response.status
      expect(status).toBeUndefined();

    })
  })
})