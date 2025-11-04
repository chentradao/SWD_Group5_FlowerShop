import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';

@Injectable()
export class ShopService {
  constructor(private prisma: PrismaService) {}

  async createShop(ownerId: string, dto: CreateShopDto) {
    const slug = dto.slug || dto.name.toLowerCase().replace(/\s+/g, '-');
    return this.prisma.shop.create({
      data: {
        ownerId,
        name: dto.name,
        slug,
        description: dto.description,
        logo: dto.logo,
      },
    });
  }

  async getShops() {
    return this.prisma.shop.findMany({
      where: { isActive: true },
      include: { owner: true },
    });
  }

  async getShopById(id: string) {
    const shop = await this.prisma.shop.findUnique({
      where: { id },
      include: { owner: true },
    });
    if (!shop) throw new NotFoundException('Shop not found');
    return shop;
  }

  async updateShop(id: string, ownerId: string, dto: UpdateShopDto) {
    const shop = await this.prisma.shop.findUnique({ where: { id } });
    if (!shop) throw new NotFoundException('Shop not found');
    if (shop.ownerId !== ownerId) throw new NotFoundException('Not owner of shop');
    return this.prisma.shop.update({ where: { id }, data: { ...dto } });
  }
}
