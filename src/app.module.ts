import { Module, NestModule, MiddlewareConsumer} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomerModule } from './customers/customers.module';
import { authMiddleware } from './customers/customer.middleware';
import { BranchModule } from './branches/branches.module';
import { BookingModule } from './bookings/bookings.module';


@Module({
  imports: [
    CustomerModule,
    BranchModule,
    BookingModule,
    //TBD: Move mongoose connection to config file
    MongooseModule.forRoot('mongodb+srv://Suma:suma@1234@cluster0.fxwqa.mongodb.net/vehicle-service-booking?retryWrites=true&w=majority')
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule{}
// export class AppModule implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer
//       .apply(authMiddleware)
//       .forRoutes('customer');
//   }
// }