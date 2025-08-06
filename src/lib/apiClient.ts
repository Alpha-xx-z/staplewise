// API client for frontend to communicate with backend
export class ApiClient {
  private static baseUrl = import.meta.env.VITE_API_URL || 'https://srv943180.hstgr.cloud/api';

  static async login(email: string, password: string) {
    const response = await fetch(`${this.baseUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }

    return data;
  }

  static async register(userData: any) {
    const response = await fetch(`${this.baseUrl}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Registration failed');
    }

    return data;
  }

  static async forgotPassword(email: string) {
    const response = await fetch(`${this.baseUrl}/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to send reset email');
    }

    return data;
  }

  static async resetPassword(resetToken: string, newPassword: string) {
    const response = await fetch(`${this.baseUrl}/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ resetToken, newPassword }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to reset password');
    }

    return data;
  }

  static async saveCompanyDetails(companyData: any) {
    const token = localStorage.getItem('stapleWiseToken');
    const response = await fetch(`${this.baseUrl}/company-details`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'user-id': JSON.parse(localStorage.getItem('stapleWiseUser') || '{}').id || 'default-user-id'
      },
      body: JSON.stringify(companyData),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to save company details');
    }

    return data;
  }

  static async getCompanyDetails() {
    const token = localStorage.getItem('stapleWiseToken');
    const response = await fetch(`${this.baseUrl}/company-details`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'user-id': JSON.parse(localStorage.getItem('stapleWiseUser') || '{}').id || 'default-user-id'
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch company details');
    }

    return data;
  }

  // Product-related methods
  static async createProduct(productData: any) {
    const token = localStorage.getItem('stapleWiseToken');
    const response = await fetch(`${this.baseUrl}/seller/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'user-id': JSON.parse(localStorage.getItem('stapleWiseUser') || '{}').id || 'default-user-id'
      },
      body: JSON.stringify(productData),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to create product');
    }

    return data;
  }

  static async getSellerProducts() {
    const token = localStorage.getItem('stapleWiseToken');
    const response = await fetch(`${this.baseUrl}/seller/products`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'user-id': JSON.parse(localStorage.getItem('stapleWiseUser') || '{}').id || 'default-user-id'
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch products');
    }

    return data;
  }

  static async updateProduct(productId: string, productData: any) {
    const token = localStorage.getItem('stapleWiseToken');
    const response = await fetch(`${this.baseUrl}/seller/products/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'user-id': JSON.parse(localStorage.getItem('stapleWiseUser') || '{}').id || 'default-user-id'
      },
      body: JSON.stringify(productData),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to update product');
    }

    return data;
  }

  static async deleteProduct(productId: string) {
    const token = localStorage.getItem('stapleWiseToken');
    const response = await fetch(`${this.baseUrl}/seller/products/${productId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'user-id': JSON.parse(localStorage.getItem('stapleWiseUser') || '{}').id || 'default-user-id'
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to delete product');
    }

    return data;
  }

  static async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    
    const token = localStorage.getItem('stapleWiseToken');
    const response = await fetch(`${this.baseUrl}/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to upload image');
    }

    return data.fileUrl;
  }

  // Order-related methods
  static async createOrder(orderData: any) {
    const token = localStorage.getItem('stapleWiseToken');
    const response = await fetch(`${this.baseUrl}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'user-id': JSON.parse(localStorage.getItem('stapleWiseUser') || '{}').id || 'default-user-id'
      },
      body: JSON.stringify(orderData),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to create order');
    }

    return data;
  }

  static async getOrderDetails(orderId: string) {
    const token = localStorage.getItem('stapleWiseToken');
    const response = await fetch(`${this.baseUrl}/orders/${orderId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'user-id': JSON.parse(localStorage.getItem('stapleWiseUser') || '{}').id || 'default-user-id'
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch order details');
    }

    return data;
  }

  static async updateOrder(orderId: string, orderData: any) {
    const token = localStorage.getItem('stapleWiseToken');
    const response = await fetch(`${this.baseUrl}/orders/${orderId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'user-id': JSON.parse(localStorage.getItem('stapleWiseUser') || '{}').id || 'default-user-id'
      },
      body: JSON.stringify(orderData),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to update order');
    }

    return data;
  }

  static async deleteOrder(orderId: string) {
    const token = localStorage.getItem('stapleWiseToken');
    const response = await fetch(`${this.baseUrl}/orders/${orderId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'user-id': JSON.parse(localStorage.getItem('stapleWiseUser') || 'default-user-id')
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to delete order');
    }

    return data;
  }

  static async getSellerOrders(sellerId: string) {
    const token = localStorage.getItem('stapleWiseToken');
    const response = await fetch(`${this.baseUrl}/orders/seller/${sellerId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'user-id': JSON.parse(localStorage.getItem('stapleWiseUser') || '{}').id || 'default-user-id'
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch orders');
    }

    return data;
  }

}