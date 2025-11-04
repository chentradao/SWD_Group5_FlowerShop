import { Injectable, OnModuleInit, INestApplication, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super();
  }

  async onModuleInit() {
    try {
      await this.$connect();
    } catch (err) {
      // If DATABASE_URL is not set or database is unreachable, don't crash the whole app here.
      // Log a warning and allow the application to continue in a limited mode.
      // In production you should ensure DATABASE_URL is set and reachable.
      // eslint-disable-next-line no-console
      console.warn('[PrismaService] Could not connect to database:', err?.message || err);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async enableShutdownHooks(app: INestApplication) {
    (this as any).$on('beforeExit', async () => {
      await app.close();
    });
  }

}
