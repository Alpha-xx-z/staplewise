import { prisma } from './prisma';
import { AuthService } from './auth';
import { Role } from '@prisma/client';

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user
  const adminUser = await AuthService.register({
    email: 'admin@staplewise.com',
    password: 'password123',
    name: 'Admin User',
    phone: '+919876543210',
    role: Role.ADMIN,
  });
  console.log('✅ Created admin user');

  // Create sales user
  const salesUser = await AuthService.register({
    email: 'sales@staplewise.com',
    password: 'password123',
    name: 'Sales Employee',
    phone: '+919876543211',
    role: Role.SALES,
  });
  console.log('✅ Created sales user');

  // Create buyer user
  const buyerUser = await AuthService.register({
    email: 'buyer@example.com',
    password: 'password123',
    name: 'John Buyer',
    phone: '+919876543212',
    role: Role.BUYER,
    companyName: 'ABC Foods',
  });
  console.log('✅ Created buyer user');

  // Create seller user
  const sellerUser = await AuthService.register({
    email: 'seller@example.com',
    password: 'password123',
    name: 'Jane Seller',
    phone: '+919876543213',
    role: Role.SELLER,
    companyName: 'XYZ Cashews',
    gst: 'GST123456789',
  });
  console.log('✅ Created seller user');

  // Create sample products
  const products = [
    {
      name: 'W320 Cashew Kernels',
      grade: 'W320',
      pricePerKg: 85,
      location: 'Mangalore',
      stock: 50,
      image: 'https://images.pexels.com/photos/4198019/pexels-photo-4198019.jpeg?auto=compress&cs=tinysrgb&w=400',
      specifications: 'Premium quality W320 grade cashew kernels, 100% natural, 320 pieces per pound',
      deliveryTime: '3-5 business days',
      minimumOrderQuantity: 100,
      sellerId: sellerUser.user.id,
    },
    {
      name: 'W180 Cashew Kernels',
      grade: 'W180',
      pricePerKg: 95,
      location: 'Panruti',
      stock: 25,
      image: 'https://images.pexels.com/photos/1630588/pexels-photo-1630588.jpeg?auto=compress&cs=tinysrgb&w=400',
      specifications: 'Premium quality W180 grade cashew kernels, 180 pieces per pound',
      deliveryTime: '2-4 business days',
      minimumOrderQuantity: 50,
      sellerId: sellerUser.user.id,
    },
    {
      name: 'LWP Cashew Kernels',
      grade: 'LWP',
      pricePerKg: 75,
      location: 'Mumbai',
      stock: 100,
      image: 'https://images.pexels.com/photos/4110256/pexels-photo-4110256.jpeg?auto=compress&cs=tinysrgb&w=400',
      specifications: 'Large White Pieces - Broken cashew kernels, excellent for processing',
      deliveryTime: '1-3 business days',
      minimumOrderQuantity: 200,
      sellerId: sellerUser.user.id,
    },
  ];

  for (const product of products) {
    await prisma.product.create({ data: product });
  }
  console.log('✅ Created sample products');

  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });