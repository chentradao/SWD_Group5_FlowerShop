import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class FlowerService {
  constructor(private prisma: PrismaService) { }

  async getVendorShop(user: any) {
    return this.prisma.shop.findFirst({
      where: { ownerId: user.id || user.userId },
    });
  }

  async verifyVendorOwnership(flowerId: string, user: any) {
    const flower = await this.prisma.flower.findUnique({
      where: { id: flowerId },
      include: { shop: true }
    });

    if (!flower) {
      throw new NotFoundException('Flower not found');
    }

    const shop = await this.getVendorShop(user);
    if (!shop || shop.id !== flower.shopId) {
      throw new BadRequestException('You do not have permission to update this flower');
    }
  }

  async getByShopId(shopId: string) {
    const flowers = await this.prisma.flower.findMany({
      where: {
        shopId,
        status: 'AVAILABLE'
      },
      include: {
        categories: true,
        shop: true
      }
    });
    return flowers;
  }

  async createFlowerWithImage(body: any, imagePath: string, shopId: string) {
    const { title, description, price, categoryIds } = body;

    const normalizedCategoryIds = Array.isArray(categoryIds)
      ? categoryIds
      : typeof categoryIds === 'string'
        ? [categoryIds]
        : [];

    return this.prisma.flower.create({
      data: {
        title,
        image: imagePath,
        description,
        price: Number(price),
        shopId, // Always include vendor's shop
        status: 'AVAILABLE',
        stock: 0, // Initial stock
        sold: 0, // Initial sales
        categories: {
          connect: normalizedCategoryIds.map((id: string) => ({ id })),
        },
      },
      include: {
        categories: true,
        shop: true
      },
    });
  }

  async disableFlowerById(flowerId: string) {
    return this.prisma.flower.update({
      where: { id: flowerId },
      data: { status: 'DISABLE' },
    });
  }

  async getById(id: string) {
    const flower = await this.prisma.flower.findUnique({
      where: { id },
      include: {
        categories: true,
        shop: true
      },
    });

    if (!flower) {
      throw new NotFoundException(`Flower with ID ${id} not found`);
    }

    return flower;
  }

  async updateFlowerWithImage(id: string, body: any, imagePath: string | null) {
    const existingFlower = await this.prisma.flower.findUnique({ where: { id } });
    if (!existingFlower) {
      throw new NotFoundException(`Flower with ID ${id} not found`);
    }

    const { title, description, price, categoryIds } = body;

    const normalizedCategoryIds = Array.isArray(categoryIds)
      ? categoryIds
      : typeof categoryIds === 'string'
        ? [categoryIds]
        : [];

    return this.prisma.flower.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(price && { price: Number(price) }),
        ...(imagePath && { image: imagePath }),
        ...(normalizedCategoryIds.length && {
          categories: {
            set: normalizedCategoryIds.map((id: string) => ({ id })),
          },
        }),
      },
      include: {
        categories: true,
        shop: true
      },
    });
  }

  async findAllFlowers(query: any) {
    // query params come as strings from HTTP requests — normalize to numbers
    const page = query?.page ? Number(query.page) : 1;
    const limit = query?.limit ? Number(query.limit) : 10;
    const { categoryId, status } = query;

    const totalRecords = await this.prisma.flower.count({
      where: {
        ...(status && { status: status as any }),
        ...(categoryId && {
          categories: {
            some: { id: categoryId },
          },
        }),
      },
    });

    const flowers = await this.prisma.flower.findMany({
      where: {
        ...(status && { status: status as any }),
        ...(categoryId && {
          categories: {
            some: { id: categoryId },
          },
        }),
      },
      include: {
        categories: true,
        shop: true
      },
      skip: (page - 1) * limit,
      take: Math.max(1, limit),
    });

  const totalPages = Math.ceil(totalRecords / limit);

    return {
      totalRecords,
      totalPages,
      currentPage: page,
      flowers,
    };
  }
  async updateStock(id: string, stock: number) {
    const flower = await this.prisma.flower.findUnique({
      where: { id },
    });

    if (!flower) {
      throw new NotFoundException('Không tìm thấy hoa');
    }

    return this.prisma.flower.update({
      where: { id },
      data: { stock },
    });
  }

  async getBestSellers(limit: number = 5) {
    return this.prisma.flower.findMany({
      where: {
        status: 'AVAILABLE',
      },
      orderBy: {
        sold: 'desc',
      },
      take: limit,
      include: {
        categories: true,
        shop: true
      }
    });
  }

  async getNewArrivals() {
    return this.prisma.flower.findMany({
      where: {
        status: 'AVAILABLE',
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
      include: {
        categories: true,
        shop: true
      }
    });
  }

}
