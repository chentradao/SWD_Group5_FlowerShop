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
  UseGuards,
  Req,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
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
import { CreateFlowerDto } from './dto/create-flower.dto';
import { UpdateFlowerDto } from './dto/update-flower.dto';
import { Prisma } from '@prisma/client';
import { FlowerFilterDto } from './dto/flower-filter.dto';

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
  @ApiOperation({ summary: 'Get flower by ID' })
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
  @UseGuards(JwtAuthGuard)
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
        destination: './uploads/flowers',
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
    @Req() req: any,
  ) {
    if (!file) {
      throw new BadRequestException('Image file is required');
    }

    // Get vendor's shop
    const shop = await this.flowerService.getVendorShop(req.user);
    if (!shop) {
      throw new BadRequestException('Vendor must have a shop to create flowers');
    }

    const imagePath = `/uploads/flowers/${file.filename}`;
    return this.flowerService.createFlowerWithImage(body, imagePath, shop.id);
  }

  @Patch(':id/update')
  @UseGuards(JwtAuthGuard)
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
        destination: './uploads/flowers',
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
    @Req() req: any,
  ) {
    // Verify vendor owns this flower
    await this.flowerService.verifyVendorOwnership(id, req.user);

    const imagePath = file ? `/uploads/flowers/${file.filename}` : null;
    return this.flowerService.updateFlowerWithImage(id, body, imagePath);
  }
  @Patch(':id/stock')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cập nhật tồn kho hoa' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        stock: { type: 'number', example: 10 },
      },
    },
  })
  async updateStock(
    @Param('id') id: string, 
    @Body('stock') stock: number,
    @Req() req: any
  ) {
    if (isNaN(stock) || stock < 0) {
      throw new BadRequestException('Số lượng tồn kho không hợp lệ');
    }

    // Verify vendor owns this flower before updating stock
    await this.flowerService.verifyVendorOwnership(id, req.user);
    
    return this.flowerService.updateStock(id, stock);
  }

}
