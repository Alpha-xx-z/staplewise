import { QueryType, QueryStatus, OrderStatus, Role } from '@prisma/client';

export class ProductService {
  private static baseUrl = import.meta.env.VITE_API_URL || 'https://srv943180.hstgr.cloud/api';

  static async getAllProducts(filters?: {
    grade?: string;
    location?: string;
    priceRange?: string;
    stockAvailable?: boolean;
    search?: string;
  }) {
    try {
      // Build query parameters
      const params = new URLSearchParams();
      if (filters?.grade) params.append('grade', filters.grade);
      if (filters?.location) params.append('location', filters.location);
      if (filters?.priceRange) params.append('priceRange', filters.priceRange);
      if (filters?.stockAvailable) params.append('stockAvailable', 'true');
      if (filters?.search) params.append('search', filters.search);

      const response = await fetch(`${this.baseUrl}/products?${params.toString()}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch products');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  static async getProductById(id: string) {
    try {
      const response = await fetch(`${this.baseUrl}/products/${id}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch product');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  }

  static async createProduct(data: any) {
    try {
      const response = await fetch(`${this.baseUrl}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create product');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }
}

export class QueryService {
  private static baseUrl = import.meta.env.VITE_API_URL || 'https://srv943180.hstgr.cloud/api';

  static async createQuery(data: {
    type: QueryType;
    quantity: number;
    companyName: string;
    pincode: string;
    email: string;
    phone: string;
    gst?: string;
    productId: string;
    userId?: string;
  }) {
    try {
      const response = await fetch(`${this.baseUrl}/queries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create query');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating query:', error);
      throw error;
    }
  }

  static async getAllQueries(filters?: {
    status?: QueryStatus;
    type?: QueryType;
    assignedToId?: string;
  }) {
    try {
      // Build query parameters
      const params = new URLSearchParams();
      if (filters?.status) params.append('status', filters.status);
      if (filters?.type) params.append('type', filters.type);
      if (filters?.assignedToId) params.append('assignedToId', filters.assignedToId);

      const response = await fetch(`${this.baseUrl}/admin/queries?${params.toString()}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch queries');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching queries:', error);
      throw error;
    }
  }

  static async updateQueryStatus(id: string, status: QueryStatus, assignedToId?: string) {
    try {
      const response = await fetch(`${this.baseUrl}/admin/queries/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, assignedToId }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update query status');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating query status:', error);
      throw error;
    }
  }
}

export class OrderService {
  private static baseUrl = import.meta.env.VITE_API_URL || 'https://srv943180.hstgr.cloud/api';

  static async createOrder(data: {
    orderNumber: string;
    totalAmount: number;
    buyerId: string;
    items: Array<{
      productId: string;
      quantity: number;
      pricePerKg: number;
      totalPrice: number;
    }>;
  }) {
    try {
      const response = await fetch(`${this.baseUrl}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create order');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  static async getOrdersByBuyer(buyerId: string) {
    try {
      const response = await fetch(`${this.baseUrl}/orders/buyer/${buyerId}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch buyer orders');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching buyer orders:', error);
      throw error;
    }
  }

  static async getOrdersBySeller(sellerId: string) {
    try {
      const response = await fetch(`${this.baseUrl}/orders/seller/${sellerId}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch seller orders');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching seller orders:', error);
      throw error;
    }
  }
}

export class AdminService {
  private static baseUrl = import.meta.env.VITE_API_URL || 'https://srv943180.hstgr.cloud/api';

  static async getDashboardStats() {
    try {
      const response = await fetch(`${this.baseUrl}/admin/dashboard-stats`);
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard stats');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }

  static async getQueries(filters?: { status?: string; type?: string; assignedToId?: string; }) {
    try {
      const params = new URLSearchParams();
      if (filters?.status) params.append('status', filters.status);
      if (filters?.type) params.append('type', filters.type);
      if (filters?.assignedToId) params.append('assignedToId', filters.assignedToId);

      const response = await fetch(`${this.baseUrl}/admin/queries?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch queries');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching queries:', error);
      throw error;
    }
  }

  static async getUsers() {
    try {
      const response = await fetch(`${this.baseUrl}/admin/users`);
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  static async getOrders() {
    try {
      const response = await fetch(`${this.baseUrl}/admin/orders`);
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  }

  static async createOrder(orderData: any) {
    try {
      const response = await fetch(`${this.baseUrl}/admin/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create order');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  static async getSellers() {
    try {
      const response = await fetch(`${this.baseUrl}/admin/sellers`);
      if (!response.ok) {
        throw new Error('Failed to fetch sellers');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching sellers:', error);
      throw error;
    }
  }

  static async createSalesEmployee(data: {
    name: string;
    email: string;
    password: string;
    phone: string;
    companyName?: string;
  }) {
    try {
      const response = await fetch(`${this.baseUrl}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          role: 'SALES'
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create sales employee');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating sales employee:', error);
      throw error;
    }
  }

  static async deleteUser(userId: string) {
    try {
      const response = await fetch(`${this.baseUrl}/admin/users/${userId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete user');
      }
      return await response.json();
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  static async assignQuery(queryId: string, assignedToId: string, status?: string) {
    try {
      const response = await fetch(`${this.baseUrl}/admin/queries/${queryId}/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assignedToId,
          status: status || 'ASSIGNED'
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to assign query');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error assigning query:', error);
      throw error;
    }
  }

  static async updateQueryStatus(queryId: string, status: string) {
    try {
      const response = await fetch(`${this.baseUrl}/admin/queries/${queryId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update query status');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating query status:', error);
      throw error;
    }
  }

  static async createQueryFromFrontend(data: {
    type: string;
    quantity: number;
    contactName: string;
    companyName: string;
    pincode: string;
    email: string;
    phone: string;
    gst?: string;
    productId: string;
    userId?: string;
  }) {
    try {
      const response = await fetch(`${this.baseUrl}/queries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create query');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating query:', error);
      throw error;
    }
  }

  static async deleteQuery(queryId: string) {
    try {
      const response = await fetch(`${this.baseUrl}/admin/queries/${queryId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete query');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error deleting query:', error);
      throw error;
    }
  }
}