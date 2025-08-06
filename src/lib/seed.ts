import { PrismaClient, Role, ProductCategory, QueryType, QueryStatus, OrderStatus, PaymentStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.query.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  console.log('🗑️ Cleared existing data');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@staplewise.com',
      password: adminPassword,
      name: 'Admin User',
      phone: '+919876543210',
      role: Role.ADMIN,
      companyName: 'StapleWise',
      isActive: true,
      isVerified: true
    }
  });

  // Create sales users
  const salesPassword = await bcrypt.hash('sales123', 12);
  const salesUser1 = await prisma.user.create({
    data: {
      email: 'sales1@staplewise.com',
      password: salesPassword,
      name: 'John Sales',
      phone: '+919876543211',
      role: Role.SALES,
      companyName: 'StapleWise',
      isActive: true,
      isVerified: true
    }
  });

  const salesUser2 = await prisma.user.create({
    data: {
      email: 'sales2@staplewise.com',
      password: salesPassword,
      name: 'Sarah Sales',
      phone: '+919876543212',
      role: Role.SALES,
      companyName: 'StapleWise',
      isActive: true,
      isVerified: true
    }
  });

  // Create seller users
  const sellerPassword = await bcrypt.hash('seller123', 12);
  const seller1 = await prisma.user.create({
    data: {
      email: 'premium@cashews.com',
      password: sellerPassword,
      name: 'Arjun Nair',
      phone: '+919876543213',
      role: Role.SELLER,
      companyName: 'Premium Cashews Ltd',
      gstin: 'GST456789123',
      isActive: true,
      isVerified: true
    }
  });

  const seller2 = await prisma.user.create({
    data: {
      email: 'golden@kernel.com',
      password: sellerPassword,
      name: 'Priya Sharma',
      phone: '+919876543214',
      role: Role.SELLER,
      companyName: 'Golden Kernel Exports',
      gstin: 'GST789123456',
      isActive: true,
      isVerified: true
    }
  });

  const seller3 = await prisma.user.create({
    data: {
      email: 'coastal@cashew.com',
      password: sellerPassword,
      name: 'Kavitha Reddy',
      phone: '+919876543215',
      role: Role.SELLER,
      companyName: 'Coastal Cashew Co',
      gstin: 'GST321654987',
      isActive: true,
      isVerified: true
    }
  });

  // Create buyer users
  const buyerPassword = await bcrypt.hash('buyer123', 12);
  const buyer1 = await prisma.user.create({
    data: {
      email: 'abc@foods.com',
      password: buyerPassword,
      name: 'Rajesh Kumar',
      phone: '+919876543216',
      role: Role.BUYER,
      companyName: 'ABC Foods Ltd',
      gstin: 'GST987654321',
      isActive: true,
      isVerified: true
    }
  });

  const buyer2 = await prisma.user.create({
    data: {
      email: 'food@corp.com',
      password: buyerPassword,
      name: 'Meera Patel',
      phone: '+919876543217',
      role: Role.BUYER,
      companyName: 'Food Corp Ltd',
      gstin: 'GST654321987',
      isActive: true,
      isVerified: true
    }
  });

  const buyer3 = await prisma.user.create({
    data: {
      email: 'spice@traders.com',
      password: buyerPassword,
      name: 'Vikram Singh',
      phone: '+919876543218',
      role: Role.BUYER,
      companyName: 'Spice Traders Inc',
      gstin: 'GST123789456',
      isActive: true,
      isVerified: true
    }
  });

  console.log('👥 Created users');

  // Create products for premium@cashews.com
  const product1 = await prisma.product.create({
    data: {
      sellerId: seller1.id,
      name: 'Premium W-240 Cashew Kernels',
      category: ProductCategory.CASHEWS,
      grade: 'W-240',
      description: 'High-quality premium cashew kernels',
      specifications: 'Size: W-240, Color: White, Moisture: <5%',
      specificationsAndGrade: 'Premium W-240 grade cashew kernels with 240 pieces per pound. Natural white color with excellent taste and texture.',
      qualityAssurance: '1. ISO 22000 Certified\n2. HACCP Compliant\n3. Regular Quality Checks\n4. Premium Grade Selection\n5. Food Safety Standards',
      packagingAndDelivery: '1. Vacuum Sealed Packaging\n2. Express Delivery Available\n3. Bulk Packaging Options\n4. Temperature Controlled Shipping\n5. Insurance Coverage',
      pricePerKg: 850.00,
      minimumOrderQuantity: 100,
      location: 'Mangalore, Karnataka',
      deliveryTime: '7-10 days',
      packagingType: 'Vacuum Packed',
      primaryImage: 'https://images.pexels.com/photos/4198019/pexels-photo-4198019.jpeg?auto=compress&cs=tinysrgb&w=400',
      isActive: true,
      isVerified: true
    }
  });

  const product2 = await prisma.product.create({
    data: {
      sellerId: seller1.id,
      name: 'Organic W-320 Cashew Kernels',
      category: ProductCategory.CASHEWS,
      grade: 'W-320',
      description: 'Organic certified cashew kernels',
      specifications: 'Size: W-320, Organic Certified, Moisture: <4%',
      specificationsAndGrade: 'Organic W-320 grade cashew kernels with 320 pieces per pound. Certified organic with superior quality.',
      qualityAssurance: '1. Organic Certification\n2. Pesticide Free\n3. Regular Testing\n4. Premium Organic Selection\n5. Sustainable Farming',
      packagingAndDelivery: '1. Organic Certified Packaging\n2. Fast Delivery Available\n3. Eco-friendly Packaging\n4. Cold Chain Logistics\n5. Full Traceability',
      pricePerKg: 920.00,
      minimumOrderQuantity: 50,
      location: 'Mangalore, Karnataka',
      deliveryTime: '5-7 days',
      packagingType: 'Organic Packing',
      primaryImage: 'https://images.pexels.com/photos/1630588/pexels-photo-1630588.jpeg?auto=compress&cs=tinysrgb&w=400',
      isActive: true,
      isVerified: true
    }
  });

  const product3 = await prisma.product.create({
    data: {
      sellerId: seller1.id,
      name: 'Premium W-180 Cashew Kernels',
      category: ProductCategory.CASHEWS,
      grade: 'W-180',
      description: 'Premium large cashew kernels',
      specifications: 'Size: W-180, Color: White, Moisture: <5%',
      specificationsAndGrade: 'Premium W-180 grade cashew kernels with 180 pieces per pound. Largest commercial size with excellent presentation.',
      qualityAssurance: '1. Premium Grade Selection\n2. Size Consistency\n3. Color Uniformity\n4. Taste Testing\n5. Quality Assurance',
      packagingAndDelivery: '1. Premium Packaging\n2. Express Shipping\n3. Bulk Container Options\n4. Temperature Control\n5. Insurance Included',
      pricePerKg: 980.00,
      minimumOrderQuantity: 200,
      location: 'Mangalore, Karnataka',
      deliveryTime: '7-10 days',
      packagingType: 'Premium Packing',
      primaryImage: 'https://images.pexels.com/photos/4110256/pexels-photo-4110256.jpeg?auto=compress&cs=tinysrgb&w=400',
      isActive: true,
      isVerified: true
    }
  });

  const product4 = await prisma.product.create({
    data: {
      sellerId: seller1.id,
      name: 'LWP Cashew Kernels',
      category: ProductCategory.CASHEWS,
      grade: 'LWP',
      description: 'Large White Pieces cashew kernels',
      specifications: 'Size: LWP, Color: White, Moisture: <5%',
      specificationsAndGrade: 'Large White Pieces (LWP) cashew kernels. Broken pieces of premium quality, perfect for processing.',
      qualityAssurance: '1. Premium Quality Pieces\n2. Consistent Size\n3. Clean Processing\n4. Quality Control\n5. Food Grade Standards',
      packagingAndDelivery: '1. Industrial Packaging\n2. Bulk Delivery\n3. Palletized Shipping\n4. Fast Processing\n5. Cost Effective',
      pricePerKg: 750.00,
      minimumOrderQuantity: 500,
      location: 'Mangalore, Karnataka',
      deliveryTime: '5-7 days',
      packagingType: 'Industrial Packing',
      primaryImage: 'https://images.pexels.com/photos/4198020/pexels-photo-4198020.jpeg?auto=compress&cs=tinysrgb&w=400',
      isActive: true,
      isVerified: true
    }
  });

  const product5 = await prisma.product.create({
    data: {
      sellerId: seller1.id,
      name: 'SWP Cashew Kernels',
      category: ProductCategory.CASHEWS,
      grade: 'SWP',
      description: 'Small White Pieces cashew kernels',
      specifications: 'Size: SWP, Color: White, Moisture: <5%',
      specificationsAndGrade: 'Small White Pieces (SWP) cashew kernels. Ideal for bakery, confectionery, and food processing.',
      qualityAssurance: '1. Consistent Small Pieces\n2. Clean Processing\n3. Food Grade Quality\n4. Regular Testing\n5. Quality Assurance',
      packagingAndDelivery: '1. Food Grade Packaging\n2. Bulk Options Available\n3. Fast Delivery\n4. Cost Effective\n5. Reliable Supply',
      pricePerKg: 680.00,
      minimumOrderQuantity: 1000,
      location: 'Mangalore, Karnataka',
      deliveryTime: '3-5 days',
      packagingType: 'Food Grade Packing',
      primaryImage: 'https://images.pexels.com/photos/4110257/pexels-photo-4110257.jpeg?auto=compress&cs=tinysrgb&w=400',
      isActive: true,
      isVerified: true
    }
  });

  const product6 = await prisma.product.create({
    data: {
      sellerId: seller2.id,
      name: 'Golden W-180 Cashew Kernels',
      category: ProductCategory.CASHEWS,
      grade: 'W-180',
      description: 'Premium golden cashew kernels',
      specifications: 'Size: W-180, Color: Golden, Moisture: <5%',
      specificationsAndGrade: 'Golden W-180 grade cashew kernels with 180 pieces per pound. Premium golden color with excellent taste.',
      qualityAssurance: '1. Premium Golden Grade\n2. Color Consistency\n3. Size Uniformity\n4. Taste Testing\n5. Quality Control',
      packagingAndDelivery: '1. Premium Golden Packaging\n2. Express Delivery\n3. Bulk Container Options\n4. Temperature Control\n5. Insurance Coverage',
      pricePerKg: 950.00,
      minimumOrderQuantity: 200,
      location: 'Kochi, Kerala',
      deliveryTime: '10-15 days',
      packagingType: 'Premium Packing',
      primaryImage: 'https://images.pexels.com/photos/4110258/pexels-photo-4110258.jpeg?auto=compress&cs=tinysrgb&w=400',
      isActive: true,
      isVerified: true
    }
  });

  const product7 = await prisma.product.create({
    data: {
      sellerId: seller3.id,
      name: 'Black Pepper',
      category: ProductCategory.PEPPER,
      grade: 'Premium',
      description: 'High-quality black pepper',
      specifications: 'Size: 4mm, Moisture: <12%, Purity: 99%',
      specificationsAndGrade: 'Premium black pepper with 4mm size, low moisture content, and 99% purity.',
      qualityAssurance: '1. Premium Grade Selection\n2. Purity Testing\n3. Moisture Control\n4. Size Consistency\n5. Quality Assurance',
      packagingAndDelivery: '1. Jute Bag Packaging\n2. Bulk Delivery\n3. Fast Shipping\n4. Cost Effective\n5. Reliable Supply',
      pricePerKg: 450.00,
      minimumOrderQuantity: 500,
      location: 'Goa',
      deliveryTime: '3-5 days',
      packagingType: 'Jute Bags',
      primaryImage: 'https://images.pexels.com/photos/4198021/pexels-photo-4198021.jpeg?auto=compress&cs=tinysrgb&w=400',
      isActive: true,
      isVerified: true
    }
  });

  console.log('📦 Created products');

  // Create queries
  const query1 = await prisma.query.create({
    data: {
      type: QueryType.BUY,
      quantity: 500,
      companyName: 'ABC Foods Ltd',
      contactName: 'Rajesh Kumar',
      email: 'rajesh@abc.com',
      phone: '+919876543219',
      pincode: '400001',
      gst: 'GST987654321',
      productId: product1.id,
      userId: buyer1.id,
      status: QueryStatus.PENDING,
      message: 'Looking for bulk order of premium cashews'
    }
  });

  const query2 = await prisma.query.create({
    data: {
      type: QueryType.BUY,
      quantity: 1000,
      companyName: 'Food Corp Ltd',
      contactName: 'Meera Patel',
      email: 'meera@foodcorp.com',
      phone: '+919876543220',
      pincode: '500001',
      gst: 'GST654321987',
      productId: product2.id,
      userId: buyer2.id,
      status: QueryStatus.ASSIGNED,
      assignedToId: salesUser1.id,
      message: 'Need organic cashews for export'
    }
  });

  const query3 = await prisma.query.create({
    data: {
      type: QueryType.SELL,
      quantity: 2000,
      companyName: 'Spice Traders Inc',
      contactName: 'Vikram Singh',
      email: 'vikram@spice.com',
      phone: '+919876543221',
      pincode: '600001',
      gst: 'GST123789456',
      productId: product6.id,
      userId: buyer3.id,
      status: QueryStatus.COMPLETED,
      message: 'Selling premium cashews'
    }
  });

  const query4 = await prisma.query.create({
    data: {
      type: QueryType.BUY,
      quantity: 300,
      companyName: 'Restaurant Chain',
      contactName: 'Amit Shah',
      email: 'amit@restaurant.com',
      phone: '+919876543222',
      pincode: '700001',
      productId: product7.id,
      status: QueryStatus.PENDING,
      message: 'Looking for black pepper for restaurant use'
    }
  });

  const query5 = await prisma.query.create({
    data: {
      type: QueryType.BULK_ORDER,
      quantity: 1500,
      companyName: 'Export Company',
      contactName: 'Neha Gupta',
      email: 'neha@export.com',
      phone: '+919876543223',
      pincode: '800001',
      gst: 'GST456123789',
      productId: product1.id,
      status: QueryStatus.IN_PROGRESS,
      assignedToId: salesUser2.id,
      message: 'Bulk order for international export'
    }
  });

  console.log('❓ Created queries');

  // Create orders
  const order1 = await prisma.order.create({
    data: {
      orderNumber: 'ORD-2024-001',
      totalAmount: 425000.00,
      totalQuantity: 500,
      buyerId: buyer1.id,
      status: OrderStatus.CONFIRMED,
      paymentStatus: PaymentStatus.PAID,
      shippingAddress: 'ABC Foods Ltd, Mumbai, Maharashtra - 400001',
      billingAddress: 'ABC Foods Ltd, Mumbai, Maharashtra - 400001',
      items: {
        create: {
          productId: product1.id,
          quantity: 500,
          pricePerKg: 850.00,
          totalPrice: 425000.00
        }
      }
    }
  });

  const order2 = await prisma.order.create({
    data: {
      orderNumber: 'ORD-2024-002',
      totalAmount: 460000.00,
      totalQuantity: 500,
      buyerId: buyer2.id,
      status: OrderStatus.PROCESSING,
      paymentStatus: PaymentStatus.PAID,
      shippingAddress: 'Food Corp Ltd, Hyderabad, Telangana - 500001',
      billingAddress: 'Food Corp Ltd, Hyderabad, Telangana - 500001',
      items: {
        create: {
          productId: product2.id,
          quantity: 500,
          pricePerKg: 920.00,
          totalPrice: 460000.00
        }
      }
    }
  });

  const order3 = await prisma.order.create({
    data: {
      orderNumber: 'ORD-2024-003',
      totalAmount: 225000.00,
      totalQuantity: 500,
      buyerId: buyer3.id,
      status: OrderStatus.DELIVERED,
      paymentStatus: PaymentStatus.PAID,
      shippingAddress: 'Spice Traders Inc, Kolkata, West Bengal - 600001',
      billingAddress: 'Spice Traders Inc, Kolkata, West Bengal - 600001',
      items: {
        create: {
          productId: product4.id,
          quantity: 500,
          pricePerKg: 450.00,
          totalPrice: 225000.00
        }
      }
    }
  });

  console.log('📋 Created orders');

  console.log('✅ Database seeding completed!');
  console.log('\n📊 Summary:');
  console.log(`- Users: ${await prisma.user.count()}`);
  console.log(`- Products: ${await prisma.product.count()}`);
  console.log(`- Queries: ${await prisma.query.count()}`);
  console.log(`- Orders: ${await prisma.order.count()}`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });