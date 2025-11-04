import { Module } from '@nestjs/common';
import { ShopService } from './shop.service';
import { ShopController } from './shop.controller';
import { PrismaService } from '../../database/prisma.service';

@Module({
	imports: [],
	providers: [ShopService, PrismaService],
	controllers: [ShopController],
	exports: [ShopService],
})
export class ShopModule {}
