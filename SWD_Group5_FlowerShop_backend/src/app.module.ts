import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { ShopModule } from './modules/shop/shop.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/user/user.module';
import { FlowerModule } from './modules/flower/flower.module';
import { CategoryModule } from './modules/category/category.module';
import { OrderModule} from './modules/order/order.module';
import { ScheduleModule } from '@nestjs/schedule';
import { WalletModule } from './modules/wallet/wallet.module';
import { AdminOrderModule } from './modules/admin-order/admin-order.module';
import { AdminRevenueModule } from './modules/admin-revenue/admin-revenue.module';
import { CartModule } from './modules/cart/cart.module';
import { ProvincesModule } from './modules/province/provinces.module';
import { VendorOrderModule } from './modules/vendor-order/vendor-order.module';

@Module({
  imports: [ScheduleModule.forRoot(),
  ConfigModule.forRoot({
    isGlobal: true,
  }),
    DatabaseModule,
  AuthModule,
  // Shop module for multi-vendor support
  ShopModule,
    UsersModule,
    FlowerModule,
    CategoryModule,
    WalletModule,
    OrderModule,
    AdminOrderModule,
    AdminRevenueModule,
    CartModule,
    ProvincesModule,
    VendorOrderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
