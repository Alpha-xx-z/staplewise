export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'sales' | 'buyer' | 'seller';
  companyName?: string;
  gst?: string;
}

export enum Role {
  BUYER = 'BUYER',
  SELLER = 'SELLER',
  ADMIN = 'ADMIN',
  SALES = 'SALES'
}

export enum QueryType {
  BUY = 'BUY',
  SELL = 'SELL'
}

export enum QueryStatus {
  PENDING = 'PENDING',
  ASSIGNED = 'ASSIGNED',
  COMPLETED = 'COMPLETED',
  REJECTED = 'REJECTED'
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export interface Product {
  id: string;
  name: string;
  grade: string;
  pricePerKg: number;
  location: string;
  stock: number;
  image: string;
  specifications: string;
  deliveryTime: string;
}

export interface Query {
  id: string;
  type: 'buy' | 'sell';
  productId: string;
  quantity: number;
  companyName: string;
  pincode: string;
  email: string;
  phone: string;
  gst?: string;
  status: 'pending' | 'assigned' | 'completed' | 'rejected';
  assignedTo?: string;
  createdAt: Date;
}

export interface CompanyDetails {
  name: string;
  city: string;
  address: {
    street1: string;
    street2: string;
    pincode: string;
    state: string;
  };
  registrarName: string;
  gstin: string;
  yearEstablished: number;
}

export interface Order {
  id: string;
  orderName: string;
  quantity: number;
  price: number;
  status: string;
}