import { Module } from '@nestjs/common';
import { VendorOrderService } from './vendor-order.service';
import { VendorOrderController } from './vendor-order.controller';
import { PrismaService } from '../../database/prisma.service';

@Module({
  controllers: [VendorOrderController],
  providers: [VendorOrderService, PrismaService],
  exports: [VendorOrderService],
})
export class VendorOrderModule {}

