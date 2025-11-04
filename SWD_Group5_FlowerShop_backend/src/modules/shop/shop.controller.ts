import { Controller, Post, Body, UseGuards, Req, Get, Param, Patch } from '@nestjs/common';
import { ShopService } from './shop.service';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('shops')
export class ShopController {
  constructor(private shopService: ShopService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createShop(@Req() req: any, @Body() dto: CreateShopDto) {
    const user = req.user;
    return this.shopService.createShop(user.userId, dto);
  }

  @Get()
  async getShops() {
    return this.shopService.getShops();
  }

  @Get(':id')
  async getShop(@Param('id') id: string) {
    return this.shopService.getShopById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateShop(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateShopDto) {
    const user = req.user;
    return this.shopService.updateShop(id, user.userId, dto);
  }
}
