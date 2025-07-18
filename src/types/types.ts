// src/types/types.ts
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
  icon: React.ComponentType<any>;
  badge?: number;
}

export interface NavbarProps {
  onSearch: (query: string) => void;
}

export interface SidebarProps {
  activeItem: string;
  onItemClick: (itemId: string) => void;
}