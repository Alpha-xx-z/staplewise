import { Role } from '../types';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: Role;
  companyName?: string;
  gst?: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone: string;
  role: Role;
  companyName?: string;
  gst?: string;
}

// Mock user storage for demo purposes
const USERS_STORAGE_KEY = 'stapleWise_users';

class MockUserStorage {
  getUsers(): any[] {
    const users = localStorage.getItem(USERS_STORAGE_KEY);
    return users ? JSON.parse(users) : [];
  }

  private saveUsers(users: any[]): void {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  }

  findUserByEmail(email: string): any | null {
    const users = this.getUsers();
    return users.find(user => user.email === email) || null;
  }

  createUser(userData: any): any {
    const users = this.getUsers();
    const newUser = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...userData,
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    this.saveUsers(users);
    return newUser;
  }

  findUserById(id: string): any | null {
    const users = this.getUsers();
    return users.find(user => user.id === id) || null;
  }
}

const mockStorage = new MockUserStorage();

// Pre-seed demo users when the module loads
const initializeDemoUsers = () => {
  const demoUsers = [
    {
      id: 'admin_demo_user',
      email: 'admin@staplewise.com',
      password: 'cGFzc3dvcmQxMjNzYWx0', // password123 hashed
      name: 'Admin User',
      phone: '+919876543210',
      role: 'ADMIN' as Role,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'sales_demo_user',
      email: 'sales@staplewise.com',
      password: 'cGFzc3dvcmQxMjNzYWx0', // password123 hashed
      name: 'Sales Employee',
      phone: '+919876543211',
      role: 'SALES' as Role,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'buyer_demo_user',
      email: 'buyer@example.com',
      password: 'cGFzc3dvcmQxMjNzYWx0', // password123 hashed
      name: 'John Buyer',
      phone: '+919876543212',
      role: 'BUYER' as Role,
      companyName: 'ABC Foods',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'seller_demo_user',
      email: 'seller@example.com',
      password: 'cGFzc3dvcmQxMjNzYWx0', // password123 hashed
      name: 'Jane Seller',
      phone: '+919876543213',
      role: 'SELLER' as Role,
      companyName: 'XYZ Cashews',
      gst: 'GST123456789',
      createdAt: new Date().toISOString(),
    },
  ];

  // Check if demo users already exist
  const existingUsers = mockStorage.getUsers();
  if (existingUsers.length === 0) {
    // Save demo users to localStorage
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(demoUsers));
  }
};

// Initialize demo users when the module loads
initializeDemoUsers();

export class AuthService {
  static async hashPassword(password: string): Promise<string> {
    // Simple hash for demo - in production use proper hashing
    return btoa(password + 'salt');
  }

  static async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    const hashed = await this.hashPassword(password);
    return hashed === hashedPassword;
  }

  static generateToken(user: AuthUser): string {
    // Simple token for demo - in production use proper JWT
    return btoa(JSON.stringify({
      id: user.id,
      email: user.email,
      role: user.role,
      timestamp: Date.now()
    }));
  }

  static verifyToken(token: string): any {
    try {
      return JSON.parse(atob(token));
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  static async register(data: RegisterData): Promise<{ user: AuthUser; token: string }> {
    // Check if user already exists
    const existingUser = mockStorage.findUserByEmail(data.email);

    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    // Hash password
    const hashedPassword = await this.hashPassword(data.password);

    // Create user
    const user = mockStorage.createUser({
      email: data.email,
      password: hashedPassword,
      name: data.name,
      phone: data.phone,
      role: data.role,
      companyName: data.companyName,
      gst: data.gst,
    });

    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role,
      companyName: user.companyName || undefined,
      gst: user.gst || undefined,
    };

    const token = this.generateToken(authUser);

    return { user: authUser, token };
  }

  static async login(email: string, password: string): Promise<{ user: AuthUser; token: string }> {
    // Find user
    const user = mockStorage.findUserByEmail(email);

    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Check password
    const isValidPassword = await this.comparePassword(password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role,
      companyName: user.companyName || undefined,
      gst: user.gst || undefined,
    };

    const token = this.generateToken(authUser);

    return { user: authUser, token };
  }

  static async getUserById(id: string): Promise<AuthUser | null> {
    const user = mockStorage.findUserById(id);

    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role,
      companyName: user.companyName || undefined,
      gst: user.gst || undefined,
    };
  }
}