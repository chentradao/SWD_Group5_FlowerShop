import { Controller, Get, Query, Put, Param, Body, UseGuards, Req, NotFoundException } from '@nestjs/common';
import { VendorOrderService } from './vendor-order.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OrderStatus } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';

@Controller('vendor/order')
export class VendorOrderController {
  constructor(
    private readonly vendorOrderService: VendorOrderService,
    private readonly prisma: PrismaService,
  ) { }

  @UseGuards(JwtAuthGuard)
  @Get('shop')
  async getMyShop(@Req() req: any) {
    const user = req.user;
    const ownerId = user.id || user.userId || user.sub;
    const shop = await this.prisma.shop.findFirst({ where: { ownerId } });
    if (!shop) return { message: 'No shop' };
    return shop;
  }

  @UseGuards(JwtAuthGuard)
  @Get('get')
  async getOrders(
    @Req() req: any,
    @Query('status') status?: string
  ) {
    const user = req.user;
    const ownerId = user.id || user.userId || user.sub;
    
    // Just pass the vendor's user ID directly - no need to get shop first
    return this.vendorOrderService.getVendorOrders(ownerId, status);
  }

  @UseGuards(JwtAuthGuard)
  @Get('detail/:orderId')
  async getOrderDetail(@Param('orderId') orderId: string, @Req() req: any) {
    const user = req.user;
    const ownerId = user.id || user.userId || user.sub;
    // Pass vendor user id to service; service will resolve the vendor's shop
    return this.vendorOrderService.getVendorOrderDetail(orderId, ownerId);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':orderId/status')
  async updateOrderStatus(
    @Param('orderId') orderId: string,
    @Body('status') status: OrderStatus,
    @Req() req: any
  ) {
    const user = req.user;
    const ownerId = user.id || user.userId || user.sub;
    // Pass vendor user id to service; service will resolve the vendor's shop
    return this.vendorOrderService.updateOrderStatus(orderId, ownerId, status);
  }

  // Debug endpoint: return raw order and which items belong to the vendor's shop
  @UseGuards(JwtAuthGuard)
  @Get('debug/:orderId')
  async debugOrder(@Param('orderId') orderId: string, @Req() req: any) {
    const user = req.user;
    const ownerId = user.id || user.userId || user.sub;
    // Use the same service logic to return order detail scoped to the vendor's shop
    try {
      const detail = await this.vendorOrderService.getVendorOrderDetail(orderId, ownerId);
      return { order: detail, shopId: detail.items?.[0]?.shopId || null, shopItems: detail.items, hasShopItems: (detail.items || []).length > 0 };
    } catch (err) {
      return { message: err?.message || 'Order not found or does not belong to this vendor' };
    }
  }
}

