import { Module } from '@nestjs/common';
import { BranchController } from './branches.controller';
import { BranchService } from './branches.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BranchSchema } from './branches.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'Branch', schema: BranchSchema }])],
  controllers: [BranchController],
  providers: [BranchService],
  exports: [BranchService]
})
export class BranchModule {}
