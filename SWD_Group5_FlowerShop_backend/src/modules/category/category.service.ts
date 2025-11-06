import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';


@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async create(createBookDto: CreateCategoryDto) {
    const { name } = createBookDto;

    return this.prisma.category.create({
      data: {
        name,
      },
      include: {
        flowers: true,
      },
    });
  }

  async findAllCategories() {
    return this.prisma.category.findMany({
      include: {
        flowers: true,
      },
    });
  }
  async getCategoryById(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        flowers: true,
      },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }
  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
    });

    return {
      success: true,
      data: category,
    };
  }

  async getAllCategories() {
    return this.prisma.category.findMany({
      orderBy: { name: 'asc' }
    });
  }
}
