// types.ts
// types.ts
import { BarChart3, ListOrdered, Package, ShoppingBag, ShoppingCart, Users } from 'lucide-react';
import type { ComponentType } from 'react';

export interface ProductImage {
    image: string;
    is_primary: boolean;
    product?: number;
}
export interface Product {
    id: number;
    images: ProductImage[];
    name: string;
    slug: string;
    description: string;
    price: string;
    original_price: string;
    condition: "new" | "used" | "refurbished";
    stock: number;
    rating: string;
    review_count: number;
    created_at: string;
    updated_at: string;
    is_featured: boolean;
    is_active: boolean;
    seller: number;
    category: number;
}
export interface SidebarItem {
  id: string;
  label: string;
  icon: ComponentType<any>;
  badge?: number;
}



export const sidebarItems: SidebarItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { id: 'categories', label: 'Categories', icon: ShoppingCart, },
  { id: 'products', label: 'Products', icon: Package, },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'orders', label: 'orders', icon: ListOrdered },
  { id: 'carts', label: 'carts', icon: ShoppingBag },
//   { id: 'settings', label: 'Settings', icon: Settings ,badge: 3 }
];