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
          name: 'Book Paradise',
          slug: 'book-paradise',
          description: 'The best bookstore in town',
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
        name: 'Book Paradise',
        slug: 'book-paradise',
        description: 'The best bookstore in town',
        logo: 'https://example.com/logo.png',
      },
    });
  }

  // Create some authors
  const author1 = await prisma.author.create({
    data: {
      name: 'Jane Doe',
      bio: 'Best-selling author',
    }
  });

  const author2 = await prisma.author.create({
    data: {
      name: 'John Smith',
      bio: 'Award-winning writer',
    }
  });

  // Create some categories
  const category1 = await prisma.category.create({
    data: {
      name: 'Fiction',
    }
  });

  const category2 = await prisma.category.create({
    data: {
      name: 'Non-fiction',
    }
  });

  // Create some books for the vendor's shop
  const book1 = await prisma.book.create({
    data: {
      title: 'The Great Adventure',
      description: 'An epic journey through time',
      price: 29.99,
      image: 'https://example.com/book1.jpg',
      publishedAt: new Date(),
      shopId: shop.id,
      authors: {
        connect: [{ id: author1.id }]
      },
      categories: {
        connect: [{ id: category1.id }]
      },
      stock: 50
    }
  });

  const book2 = await prisma.book.create({
    data: {
      title: 'Business Success',
      description: 'Guide to business excellence',
      price: 39.99,
      image: 'https://example.com/book2.jpg',
      publishedAt: new Date(),
      shopId: shop.id,
      authors: {
        connect: [{ id: author2.id }]
      },
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
