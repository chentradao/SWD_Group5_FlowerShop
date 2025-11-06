import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class AdminOrderService {
  constructor(private readonly prisma: PrismaService) { }

  async getOrders(status?: string) {
    const query: any = {
      orderBy: { createdAt: 'desc' },
      include: {
        user: true,
        items: { include: { flower: true } },
      },
    };

    if (status && status.trim() !== '') {
      if (!Object.values(OrderStatus).includes(status as OrderStatus)) {
        throw new BadRequestException('Trạng thái đơn hàng không hợp lệ');
      }
      query.where = { status: status as OrderStatus };
    }

    const orders = await this.prisma.order.findMany(query);

    // Nếu muốn parse JSON ra object rõ ràng (không cần nếu frontend xử lý được)
    return orders.map(order => ({
      ...order,
      userAddress: order.userAddress as {
        fullName: string;
        phone: string;
        province: string;
        district: string;
        ward: string;
        addressDetail: string;
      }
    }));
  }

  async approveOrder(orderId: string) {
    return this.prisma.$transaction(async (tx) => {
      // Lấy order + items + flower
      const order = await tx.order.findUnique({
        where: { id: orderId },
        include: {
          items: {
            include: { flower: true },
          },
        },
      });

      if (!order) {
        throw new NotFoundException('Không tìm thấy đơn hàng');
      }

      if (order.status !== OrderStatus.PENDING) {
        throw new BadRequestException('Chỉ có thể duyệt đơn hàng ở trạng thái PENDING');
      }

      // Kiểm tra tồn kho trước khi duyệt
      for (const item of order.items) {
        if (item.flower.stock < item.quantity) {
          throw new BadRequestException(
            `Hoa "${item.flower.title}" không đủ tồn kho. Còn ${item.flower.stock}, cần ${item.quantity}`
          );
        }
      }

      // Trừ stock và cộng sold
      for (const item of order.items) {
        await tx.flower.update({
          where: { id: item.flowerId },
          data: {
            stock: { decrement: item.quantity },
            sold: { increment: item.quantity },
          },
        });
      }

      // Cập nhật trạng thái order sang APPROVED
      return tx.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.CONFIRMED },
        include: {
          user: true,
          items: { include: { flower: true } },
        },
      });
    });
  }

  async assignOrder(orderId: string) {
    // Tìm đơn hàng
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Không tìm thấy đơn hàng');
    }

    // Chỉ cho phép chuyển sang DELIVERED nếu đang APPROVED
    if (order.status !== OrderStatus.CONFIRMED) {
      throw new BadRequestException('Chỉ có thể giao đơn hàng đã được duyệt');
    }

    // Cập nhật trạng thái sang DELIVERED
    return this.prisma.order.update({
      where: { id: orderId },
      data: { status: OrderStatus.SHIPPING },
      include: {
        user: true,
        items: { include: { flower: true } },
      },
    });
  }

  async getOrderDetail(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: true, // Lấy thông tin user
        items: {
          include: {
            flower: true, // Lấy thông tin flower của từng item
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
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
    };
  }




}
