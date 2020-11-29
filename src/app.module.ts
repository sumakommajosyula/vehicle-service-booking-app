import { ConfigModule } from '@nestjs/config';
import { Module, NestModule, MiddlewareConsumer, RequestMethod} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomerModule } from './customers/customers.module';
import { authMiddleware } from './customers/customer.middleware';
import { BranchModule } from './branches/branches.module';
import { BookingModule } from './bookings/bookings.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    CustomerModule,
    BranchModule,
    BookingModule,
    //TBD: Move mongoose connection to config file
    MongooseModule.forRoot(`mongodb+srv://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@cluster0.fxwqa.mongodb.net/vehicle-service-booking?retryWrites=true&w=majority`),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot()
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(authMiddleware)
      .exclude('/customers/login')
      .exclude({path: '/customers', method: RequestMethod.POST})
      .exclude({path: '/customers', method: RequestMethod.GET})
  }
}