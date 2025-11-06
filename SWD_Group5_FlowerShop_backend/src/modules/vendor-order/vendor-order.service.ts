import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class VendorOrderService {
  constructor(private readonly prisma: PrismaService) { }

  async getVendorOrders(userId: string, status?: string) {
    // First find vendor's shop
    const shop = await this.prisma.shop.findFirst({
      where: { ownerId: userId }
    });

    if (!shop) {
      return []; // Return empty if vendor has no shop
    }

    // Then find orders that have items from vendor's shop.
    // Some historical orders may store the shop on the order item (`shopId`) or only on the flower relation (`flower.shopId`).
    // Use an OR condition to match either case.
    const where: any = {
      items: {
        some: {
          OR: [
            { shopId: shop.id },
            { flower: { shopId: shop.id } },
          ],
        },
      },
    };

    if (status && status.trim() !== '') {
      if (!Object.values(OrderStatus).includes(status as OrderStatus)) {
        throw new BadRequestException('Trạng thái đơn hàng không hợp lệ');
      }
      where.status = status as OrderStatus;
    }

    const query: any = {
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        user: true,
        items: {
          where: {
            OR: [
              { shopId: shop.id },
              { flower: { shopId: shop.id } },
            ],
          },
          include: { flower: true },
        },
      },
    };

    const orders = await this.prisma.order.findMany(query) as any[];

    // Parse userAddress và chỉ lấy items của shop này
    return orders.map(order => {
      const items = order.items || [];
      return {
        ...order,
        items,
        userAddress: order.userAddress as {
          fullName: string;
          phone: string;
          province: string;
          district: string;
          ward: string;
          addressDetail: string;
        },
        // Tính tổng tiền chỉ của items trong shop này
        shopTotal: items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0),
      };
    });
  }

  async getVendorOrderDetail(orderId: string, vendorId: string) {
    // First find vendor's shop
    const shop = await this.prisma.shop.findFirst({
      where: { ownerId: vendorId }
    });

    if (!shop) {
      throw new NotFoundException('Vendor chưa có shop');
    }

    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: true,
        items: {
          where: {
            OR: [
              { shopId: shop.id },
              { flower: { shopId: shop.id } },
            ],
          },
          include: {
            flower: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Since we filtered items in the query, if no items remain, order doesn't belong to this shop
    if (!order.items || order.items.length === 0) {
      throw new NotFoundException('Order does not belong to this shop');
    }

    return {
      ...order,
      userAddress: order.userAddress as {
        fullName: string;
        phone: string;
        province: string;
        district: string;
        ward: string;
        addressDetail: string;
      },
      items: order.items,
      shopTotal: order.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    };
  }

  async updateOrderStatus(orderId: string, vendorId: string, status: OrderStatus) {
    // Find vendor's shop
    const shop = await this.prisma.shop.findFirst({ where: { ownerId: vendorId } });

    if (!shop) {
      throw new NotFoundException('Vendor chưa có shop');
    }

    // Load order items so we can validate the shop's items exist in the order
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: { include: { flower: true } } },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

  // Consider items where either the order item has shopId set or the related flower has shopId
  const shopItems = order.items.filter(item => item.shopId === shop.id || item.flower?.shopId === shop.id);
    if (shopItems.length === 0) {
      throw new NotFoundException('Order does not belong to this shop');
    }

    // Vendor chỉ có thể cập nhật một số trạng thái nhất định
    const allowedStatuses: OrderStatus[] = [OrderStatus.CONFIRMED, OrderStatus.SHIPPING];
    if (!allowedStatuses.includes(status)) {
      throw new BadRequestException('Vendor không thể cập nhật trạng thái này');
    }

    // Kiểm tra trạng thái hiện tại
    if (order.status === OrderStatus.CANCELLED || order.status === OrderStatus.DELIVERED) {
      throw new BadRequestException('Không thể cập nhật đơn hàng đã hủy hoặc đã giao');
    }

    return this.prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: {
        user: true,
        items: {
          where: {
            OR: [
              { shopId: shop.id },
              { flower: { shopId: shop.id } },
            ],
          },
          include: { flower: true },
        },
      },
    });
  }
}

