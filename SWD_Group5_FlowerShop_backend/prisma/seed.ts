import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create sample users
  const hashedPassword = await bcrypt.hash('password123', 10);
  const adminPassword = await bcrypt.hash('123456', 10);
  const vendorPassword = await bcrypt.hash('vendor123', 10);

  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      passwordHash: hashedPassword,
      name: 'John abc',
      role: 'USER',
    },
  });

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      passwordHash: adminPassword,
      name: 'Admin User',
      role: 'ADMIN',
    },
  });

  const user1 = await prisma.user.upsert({
    where: { email: 'user1@example.com' },
    update: {},
    create: {
      email: 'user1@example.com',
      passwordHash: hashedPassword,
      name: 'Alice user',
      role: 'USER',
    },
  });

  // Create vendor user and their shop
  const vendor = await prisma.user.upsert({
    where: { email: 'vendor@example.com' },
    update: {},
    create: {
      email: 'vendor@example.com',
      passwordHash: vendorPassword,
      name: 'Vendor User',
      role: 'VENDOR',
      shops: {
        create: {
          name: 'Flower Paradise',
          slug: 'flower-paradise',
          description: 'The best flower shop in town',
          logo: 'https://example.com/logo.png',
        }
      }
    },
  });

  // Get the shop we just created
  let shop = await prisma.shop.findFirst({
    where: { ownerId: vendor.id },
  });

  // If for some reason the shop wasn't created via upsert relation, create it
  if (!shop) {
    shop = await prisma.shop.create({
      data: {
        ownerId: vendor.id,
        name: 'Flower Paradise',
        slug: 'flower-paradise',
        description: 'The best flower shop in town',
        logo: 'https://example.com/logo.png',
      },
    });
  }

  // Create some categories (use upsert to be idempotent)
  const category1 = await prisma.category.upsert({
    where: { name: 'Roses' },
    update: {},
    create: { name: 'Roses' },
  });

  const category2 = await prisma.category.upsert({
    where: { name: 'Tulips' },
    update: {},
    create: { name: 'Tulips' },
  });

  // Additional sample categories
  const category3 = await prisma.category.upsert({
    where: { name: 'Lilies' },
    update: {},
    create: { name: 'Lilies' },
  });

  const category4 = await prisma.category.upsert({
    where: { name: 'Orchids' },
    update: {},
    create: { name: 'Orchids' },
  });

  const category5 = await prisma.category.upsert({
    where: { name: 'Sunflowers' },
    update: {},
    create: { name: 'Sunflowers' },
  });

  // Create some flowers for the vendor's shop
  const flower1 = await prisma.flower.create({
    data: {
      title: 'Red Rose Bouquet',
      description: 'Beautiful red roses perfect for any occasion',
      price: 29.99,
      image: 'https://example.com/flower1.jpg',
      shopId: shop.id,
      categories: {
        connect: [{ id: category1.id }]
      },
      stock: 50
    }
  });

  const flower2 = await prisma.flower.create({
    data: {
      title: 'Yellow Tulip Bouquet',
      description: 'Bright yellow tulips to brighten your day',
      price: 39.99,
      image: 'https://example.com/flower2.jpg',
      shopId: shop.id,
      categories: {
        connect: [{ id: category2.id }]
      },
      stock: 30
    }
  });

  console.log('Seed data created successfully');
  console.log('Vendor account:');
  console.log('Email: vendor@example.com');
  console.log('Password: vendor123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
