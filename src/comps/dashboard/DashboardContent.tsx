// components/DashboardContent.tsx
import { Package, ShoppingCart, Users, DollarSign, Plus } from 'lucide-react';

export const DashboardContent: React.FC = () => {
  const stats = [
    { label: 'Total Products', value: '124', icon: Package, color: 'bg-blue-500' },
    { label: 'Total Sales', value: '$12,350', icon: DollarSign, color: 'bg-green-500' },
    { label: 'Active Orders', value: '45', icon: ShoppingCart, color: 'bg-orange-500' },
    { label: 'Customers', value: '1,234', icon: Users, color: 'bg-purple-500' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end mb-6">
        <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white backdrop-blur-md border border-white/20 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-primary mt-1">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};