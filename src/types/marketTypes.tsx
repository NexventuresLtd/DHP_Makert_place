// types.ts
// types.ts
import { BarChart3, Package, Settings, ShoppingCart, TrendingUp, Users } from 'lucide-react';
import type { ComponentType } from 'react';

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  status: 'active' | 'inactive' | 'pending';
  sales: number;
  rating: number;
  image: string;
  description: string;
  createdAt: string;
}

export interface SidebarItem {
  id: string;
  label: string;
  icon: ComponentType<any>;
  badge?: number;
}

export const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Premium UI Kit',
    price: 49.99,
    category: 'Design',
    status: 'active',
    sales: 156,
    rating: 4.8,
    image: 'https://via.placeholder.com/100x100/3B82F6/FFFFFF?text=UI',
    description: 'Modern UI components for React',
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    name: 'E-commerce Template',
    price: 79.99,
    category: 'Templates',
    status: 'active',
    sales: 89,
    rating: 4.6,
    image: 'https://via.placeholder.com/100x100/10B981/FFFFFF?text=EC',
    description: 'Complete e-commerce solution',
    createdAt: '2024-01-10'
  },
  {
    id: '3',
    name: 'Admin Dashboard',
    price: 129.99,
    category: 'Templates',
    status: 'pending',
    sales: 234,
    rating: 4.9,
    image: 'https://via.placeholder.com/100x100/F59E0B/FFFFFF?text=AD',
    description: 'Professional admin panel',
    createdAt: '2024-01-08'
  }
];

export const sidebarItems: SidebarItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { id: 'categories', label: 'Categories', icon: ShoppingCart, badge: 3 },
  { id: 'products', label: 'Products', icon: Package, badge: 12 },
  { id: 'customers', label: 'Customers', icon: Users },
//   { id: 'analytics', label: 'Analytics', icon: TrendingUp },
//   { id: 'settings', label: 'Settings', icon: Settings }
];