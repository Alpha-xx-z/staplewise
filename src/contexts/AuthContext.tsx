import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ApiClient } from '../lib/apiClient';

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

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: RegisterData) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const storedUser = localStorage.getItem('stapleWiseUser');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { user: authUser, token } = await ApiClient.login(email, password);
      setUser(authUser);
      localStorage.setItem('stapleWiseUser', JSON.stringify(authUser));
      localStorage.setItem('stapleWiseToken', token);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };



  const logout = () => {
    setUser(null);
    localStorage.removeItem('stapleWiseUser');
    localStorage.removeItem('stapleWiseToken');
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    try {
      const { user: authUser, token } = await ApiClient.register(userData);
      setUser(authUser);
      localStorage.setItem('stapleWiseUser', JSON.stringify(authUser));
      localStorage.setItem('stapleWiseToken', token);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};