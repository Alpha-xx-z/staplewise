// Mock authentication service for frontend
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: 'ADMIN' | 'SALES' | 'BUYER' | 'SELLER';
  companyName?: string;
  gst?: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone: string;
  role: 'ADMIN' | 'SALES' | 'BUYER' | 'SELLER';
  companyName?: string;
  gst?: string;
}

// Mock users for demo
const mockUsers: (AuthUser & { password: string })[] = [
  {
    id: '1',
    email: 'admin@staplewise.com',
    password: 'password123',
    name: 'Admin User',
    phone: '+91 98765 43210',
    role: 'ADMIN',
    companyName: 'StapleWise Admin'
  },
  {
    id: '2',
    email: 'sales@staplewise.com',
    password: 'password123',
    name: 'Sales Manager',
    phone: '+91 98765 43211',
    role: 'SALES',
    companyName: 'StapleWise Sales'
  },
  {
    id: '3',
    email: 'buyer@example.com',
    password: 'password123',
    name: 'John Buyer',
    phone: '+91 98765 43212',
    role: 'BUYER',
    companyName: 'ABC Trading Co.'
  },
  {
    id: '4',
    email: 'seller@example.com',
    password: 'password123',
    name: 'Jane Seller',
    phone: '+91 98765 43213',
    role: 'SELLER',
    companyName: 'XYZ Exports',
    gst: '29ABCDE1234F1Z5'
  }
];

export class MockAuthService {
  static async login(email: string, password: string): Promise<{ user: AuthUser; token: string }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = mockUsers.find(u => u.email === email && u.password === password);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const { password: _, ...authUser } = user;
    const token = `mock-token-${user.id}-${Date.now()}`;

    return { user: authUser, token };
  }

  static async register(data: RegisterData): Promise<{ user: AuthUser; token: string }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email === data.email);
    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    // Create new user
    const newUser: AuthUser & { password: string } = {
      id: (mockUsers.length + 1).toString(),
      email: data.email,
      password: data.password,
      name: data.name,
      phone: data.phone,
      role: data.role,
      companyName: data.companyName,
      gst: data.gst,
    };

    mockUsers.push(newUser);

    const { password: _, ...authUser } = newUser;
    const token = `mock-token-${newUser.id}-${Date.now()}`;

    return { user: authUser, token };
  }

  static async getUserById(id: string): Promise<AuthUser | null> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const user = mockUsers.find(u => u.id === id);
    if (!user) return null;

    const { password: _, ...authUser } = user;
    return authUser;
  }
}