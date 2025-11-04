import {
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import {
  ApiSuccessResponse,
  ApiErrorResponse,
} from '../../common/dto/api-response.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';
import { FlowerService } from './flower.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Prisma } from '@prisma/client';
import { BookFilterDto } from './dto/book-filter.dto';

@ApiTags('Flowers')
@Controller('flowers')
export class FlowerController {
  constructor(private readonly flowerService: FlowerService) {}

  @Get('shop/:shopId')
  @ApiOperation({ summary: 'Get flowers by shop ID' })
  @ApiParam({ name: 'shopId', required: true })
  async getByShopId(@Param('shopId') shopId: string) {
    return this.flowerService.getByShopId(shopId);
  }

  @Get('best-sellers')
  async getBestSellers() {
    const limitNumber = 5;
    return this.flowerService.getBestSellers(limitNumber);
  }

  @Get('new-arrivals')
  async getNewArrivals() {
    return this.flowerService.getNewArrivals();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get book by ID' })
  @ApiParam({ name: 'id', required: true })
  getById(@Param('id') id: string) {
    return this.flowerService.getById(id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all flowers with optional filters' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'categoryId', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, enum: ['AVAILABLE','OUT_OF_STOCK','DISCONTINUED','DISABLE'] })
  async getFlowers(@Query() query: any) {
    const result = await this.flowerService.findAllFlowers(query);
    return {
      totalRecords: result.totalRecords,
      totalPages: result.totalPages,
      currentPage: result.currentPage,
      flowers: result.flowers,
    };
  }

  @Patch(':id/disable')
  @ApiOperation({ summary: 'Disable a flower by ID (soft delete)' })
  disableFlower(@Param('id') id: string) {
    return this.flowerService.disableFlowerById(id);
  }

  @Post('create-flower')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Upload image and create flower' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        description: { type: 'string' },
        price: { type: 'number' },
        categoryIds: {
          type: 'array',
          items: { type: 'string' },
        },
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/books',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )

  async uploadFlowerImage(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
  ) {
    if (!file) {
      throw new BadRequestException('Image file is required');
    }
    const imagePath = `/uploads/flowers/${file.filename}`;
    return this.flowerService.createFlowerWithImage(body, imagePath);
  }

  @Patch(':id/update')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update flower with optional image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        description: { type: 'string' },
        price: { type: 'number' },
        categoryIds: {
          type: 'array',
          items: { type: 'string' },
        },
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/books',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  async updateFlowerWithImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
  ) {
    const imagePath = file ? `/uploads/flowers/${file.filename}` : null;
    return this.flowerService.updateFlowerWithImage(id, body, imagePath);
  }
  @Patch(':id/stock')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cập nhật tồn kho sách' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        stock: { type: 'number', example: 10 },
      },
    },
  })
  async updateStock(@Param('id') id: string, @Body('stock') stock: number) {
    if (isNaN(stock) || stock < 0) {
      throw new BadRequestException('Số lượng tồn kho không hợp lệ');
    }
    return this.flowerService.updateStock(id, stock);
  }

}
