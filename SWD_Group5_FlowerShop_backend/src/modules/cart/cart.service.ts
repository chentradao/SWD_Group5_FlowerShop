import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  // Thêm sản phẩm vào giỏ hàng
  async addToCart(userId: string, flowerId: string, quantity: number = 1) {
    // Kiểm tra hoa có tồn tại không
    const flower = await this.prisma.flower.findUnique({ where: { id: flowerId } });
    if (!flower) {
      throw new NotFoundException(`Flower with ID ${flowerId} not found`);
    }
    if (flower.status !== 'AVAILABLE') {
      throw new BadRequestException('Flower is not available for sale');
    }

    // Kiểm tra ràng buộc: tất cả item trong giỏ phải cùng shop
    const userCart = await this.prisma.cartItem.findMany({
      where: { userId },
      include: { flower: true },
    });

    if (userCart.length > 0) {
      const existingShopId = userCart[0].flower?.shopId || null;
      // If current flower belongs to a different shop, forbid adding
      if (existingShopId && flower.shopId && existingShopId !== flower.shopId) {
        throw new BadRequestException(
          'Không thể đặt nhiều sản phẩm từ các shop khác nhau trong cùng 1 đơn. Vui lòng xóa giỏ hàng hoặc mua riêng từng shop.'
        );
      }
    }

    // Kiểm tra nếu đã có trong giỏ thì tăng số lượng
    const existingItem = await this.prisma.cartItem.findFirst({
      where: { userId, flowerId },
    });

    if (existingItem) {
      return this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
        include: { flower: true },
      });
    }

    // Nếu chưa có thì tạo mới
    return this.prisma.cartItem.create({
      data: {
        userId,
        flowerId,
        quantity,
      },
      include: { flower: true },
    });
  }

  // Lấy giỏ hàng của user
  async getCart(userId: string) {
    return this.prisma.cartItem.findMany({
      where: { userId },
      include: { flower: true },
      orderBy: { addedAt: 'desc' },
    });
  }

  // Cập nhật số lượng sản phẩm
  async updateQuantity(userId: string, cartItemId: string, quantity: number) {
    if (quantity <= 0) {
      throw new BadRequestException('Quantity must be greater than 0');
    }

    const item = await this.prisma.cartItem.findFirst({
      where: { id: cartItemId, userId },
    });
    if (!item) {
      throw new NotFoundException('Cart item not found');
    }

    return this.prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
      include: { flower: true },
    });
  }

  // Xóa 1 sản phẩm khỏi giỏ
  async removeItem(userId: string, cartItemId: string) {
    const item = await this.prisma.cartItem.findFirst({
      where: { id: cartItemId, userId },
    });
    if (!item) {
      throw new NotFoundException('Cart item not found');
    }

    await this.prisma.cartItem.delete({ where: { id: cartItemId } });
    return { message: 'Item removed successfully' };
  }

  // Xóa toàn bộ giỏ hàng
  async clearCart(userId: string) {
    await this.prisma.cartItem.deleteMany({ where: { userId } });
    return { message: 'Cart cleared successfully' };
  }
}
