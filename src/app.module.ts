import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomerModule } from './customers/customers.module';

@Module({
  imports: [
    //TBD: Move mongoose connection to config file
    MongooseModule.forRoot('mongodb+srv://Suma:suma@1234@cluster0.fxwqa.mongodb.net/vehicle-service-booking?retryWrites=true&w=majority'),
    CustomerModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}