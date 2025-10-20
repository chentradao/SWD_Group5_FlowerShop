import { Module } from '@nestjs/common';
import { FlowerController } from './flower.controller';
import { FlowerService } from './flower.service';
import { PrismaService } from '../../database/prisma.service';

@Module({
  controllers: [FlowerController],
  providers: [FlowerService, PrismaService],
  exports: [FlowerService],
})
export class FlowerModule {}
