import { prisma } from './prisma';
import { Product, Query, Order, QueryType, QueryStatus, OrderStatus, Role } from '@prisma/client';

export class ProductService {
  static async getAllProducts(filters?: {
    grade?: string;
    location?: string;
    priceRange?: string;
    stockAvailable?: boolean;
    search?: string;
  }) {
    const where: any = {
      isActive: true,
    };

    if (filters?.grade) {
      where.grade = filters.grade;
    }

    if (filters?.location) {
      where.location = filters.location;
    }

    if (filters?.stockAvailable) {
      where.stock = { gt: 0 };
    }

    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { specifications: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    if (filters?.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number);
      if (max) {
        where.pricePerKg = { gte: min, lte: max };
      } else {
        where.pricePerKg = { gte: min };
      }
    }

    return prisma.product.findMany({
      where,
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            companyName: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  static async getProductById(id: string) {
    return prisma.product.findUnique({
      where: { id },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            companyName: true,
            phone: true,
            email: true,
          },
        },
      },
    });
  }

  static async createProduct(sellerId: string, data: {
    name: string;
    grade: string;
    pricePerKg: number;
    location: string;
    stock: number;
    image: string;
    specifications: string;
    deliveryTime: string;
    minimumOrderQuantity: number;
  }) {
    return prisma.product.create({
      data: {
        ...data,
        sellerId,
      },
    });
  }

  static async updateProduct(id: string, sellerId: string, data: Partial<Product>) {
    return prisma.product.update({
      where: {
        id,
        sellerId, // Ensure only the seller can update their product
      },
      data,
    });
  }

  static async deleteProduct(id: string, sellerId: string) {
    return prisma.product.delete({
      where: {
        id,
        sellerId, // Ensure only the seller can delete their product
      },
    });
  }

  static async getProductsBySeller(sellerId: string) {
    return prisma.product.findMany({
      where: { sellerId },
      orderBy: { createdAt: 'desc' },
    });
  }
}

export class QueryService {
  static async createQuery(data: {
    type: QueryType;
    productId: string;
    quantity: number;
    companyName: string;
    pincode: string;
    email: string;
    phone: string;
    gst?: string;
    buyerId?: string;
    sellerId?: string;
  }) {
    return prisma.query.create({
      data,
      include: {
        product: true,
        buyer: true,
        seller: true,
      },
    });
  }

  static async getAllQueries(filters?: {
    status?: QueryStatus;
    type?: QueryType;
    assignedToId?: string;
  }) {
    const where: any = {};

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.type) {
      where.type = filters.type;
    }

    if (filters?.assignedToId) {
      where.assignedToId = filters.assignedToId;
    }

    return prisma.query.findMany({
      where,
      include: {
        product: true,
        buyer: true,
        seller: true,
        assignedTo: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  static async updateQueryStatus(id: string, status: QueryStatus, assignedToId?: string) {
    return prisma.query.update({
      where: { id },
      data: {
        status,
        assignedToId,
      },
    });
  }

  static async deleteQuery(id: string) {
    return prisma.query.delete({
      where: { id },
    });
  }
}

export class OrderService {
  static async createOrder(buyerId: string, items: Array<{
    productId: string;
    quantity: number;
    pricePerKg: number;
  }>) {
    const totalAmount = items.reduce((sum, item) => sum + (item.quantity * item.pricePerKg), 0);
    const orderNumber = `ORD-${Date.now()}`;

    return prisma.order.create({
      data: {
        orderNumber,
        buyerId,
        totalAmount,
        items: {
          create: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            pricePerKg: item.pricePerKg,
            totalPrice: item.quantity * item.pricePerKg,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        buyer: true,
      },
    });
  }

  static async getOrdersByBuyer(buyerId: string) {
    return prisma.order.findMany({
      where: { buyerId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  static async getOrdersBySeller(sellerId: string) {
    return prisma.order.findMany({
      where: {
        items: {
          some: {
            product: {
              sellerId,
            },
          },
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        buyer: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  static async updateOrderStatus(id: string, status: OrderStatus) {
    return prisma.order.update({
      where: { id },
      data: { status },
    });
  }
}

export class CompanyService {
  static async createOrUpdateCompanyDetails(userId: string, data: {
    name: string;
    location: string;
    street1: string;
    street2?: string;
    pincode: string;
    state: string;
    registrarName: string;
    gstin: string;
    yearEstablished: number;
  }) {
    return prisma.companyDetails.upsert({
      where: { userId },
      update: data,
      create: {
        ...data,
        userId,
      },
    });
  }

  static async getCompanyDetails(userId: string) {
    return prisma.companyDetails.findUnique({
      where: { userId },
    });
  }
}