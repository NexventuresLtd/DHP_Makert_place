// components/ProductsContent.tsx
import { useState } from 'react';
import { Plus, Filter, Grid, List, Eye, Edit, Trash2 } from 'lucide-react';
import {  type Product } from '../../types/marketTypes';


export const ProductsContent: React.FC = () => {
  const [products] = useState<Product[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredProducts = products.filter(product => 
    filterStatus === 'all' || product.status === filterStatus
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-primary">Products</h2>
        <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
        </button>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="inactive">Inactive</option>
          </select>
          
          <button className="flex items-center space-x-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-primary hover:bg-white/20 transition-colors">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'grid' ? 'bg-primary text-white' : 'text-primary hover:bg-white/10'
            }`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'list' ? 'bg-primary text-white' : 'text-primary hover:bg-white/10'
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
        {filteredProducts.map((product) => (
          <div key={product.id} className={`bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 ${
            viewMode === 'list' ? 'flex items-center space-x-6' : ''
          }`}>
            <img 
              src={product.images.length > 0 ? product.images[0].image : 'https://via.placeholder.com/150'} 
              alt={product.name} 
              className={viewMode === 'list' ? 'w-20 h-20 rounded-lg' : 'w-full h-48 rounded-lg mb-4 object-cover'}
            />
            
            <div className={viewMode === 'list' ? 'flex-1' : ''}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-primary">{product.name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(product.status)}`}>
                  {product.status}
                </span>
              </div>
              
              <p className="text-gray-400 text-sm mb-4">{product.description}</p>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-primary">${product.price}</p>
                  <p className="text-sm text-gray-400">{product.sales} sales</p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-primary hover:bg-white/10 rounded-lg transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-primary hover:bg-white/10 rounded-lg transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};