import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class FlowerService {
  constructor(private prisma: PrismaService) { }

  async getByShopId(shopId: string) {
    const flowers = await this.prisma.book.findMany({
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

  async createFlowerWithImage(body: any, imagePath: string) {
    const { title, description, price, categoryIds } = body;

    const normalizedCategoryIds = Array.isArray(categoryIds)
      ? categoryIds
      : typeof categoryIds === 'string'
        ? [categoryIds]
        : [];

    return this.prisma.book.create({
      data: {
        title,
        image: imagePath,
        description,
        price: Number(price),
        ...(body.shopId && { shopId: body.shopId }),
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
    return this.prisma.book.update({
      where: { id: flowerId },
      data: { status: 'DISABLE' },
    });
  }

  async getById(id: string) {
    const flower = await this.prisma.book.findUnique({
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
    const existingFlower = await this.prisma.book.findUnique({ where: { id } });
    if (!existingFlower) {
      throw new NotFoundException(`Flower with ID ${id} not found`);
    }

    const { title, description, price, categoryIds } = body;

    const normalizedCategoryIds = Array.isArray(categoryIds)
      ? categoryIds
      : typeof categoryIds === 'string'
        ? [categoryIds]
        : [];

    return this.prisma.book.update({
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
    const { page = 1, limit = 10, categoryId, status } = query;

    const totalRecords = await this.prisma.book.count({
      where: {
        ...(status && { status: status as any }),
        ...(categoryId && {
          categories: {
            some: { id: categoryId },
          },
        }),
      },
    });

    const flowers = await this.prisma.book.findMany({
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
      take: limit,
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
    const flower = await this.prisma.book.findUnique({
      where: { id },
    });

    if (!flower) {
      throw new NotFoundException('Không tìm thấy hoa');
    }

    return this.prisma.book.update({
      where: { id },
      data: { stock },
    });
  }

  async getBestSellers(limit: number = 5) {
    return this.prisma.book.findMany({
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
    return this.prisma.book.findMany({
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
