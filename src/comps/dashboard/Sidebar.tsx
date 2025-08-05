// components/Sidebar.tsx
import { sidebarItems } from '../../types/marketTypes';
import { Package, X } from 'lucide-react';

interface SidebarProps {
  activeItem: string;
  onItemClick: (itemId: string) => void;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeItem, onItemClick, onClose }) => {
  return (
    <aside className="w-64 bg-white/70 backdrop-blur-md border-r border-white/20 h-full">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <img src="/logos/logo-circle.png" className='w-full h-full scale-150' alt=""  />
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="md:hidden p-2 absolute top-2  right-2 text-gray-500 hover:text-gray-700"
            >
              <X />
            </button>
          )}
          <div>
            <h2 className="font-bold text-primary">DHP Digital</h2>
            <p className="text-sm text-gray-400">Admin Panel</p>
          </div>
        </div>

        <nav className="space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onItemClick(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${isActive
                    ? 'bg-primary text-white '
                    : 'text-gray-500 hover:bg-white/10'
                  }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
                {item.badge && (
                  <span className={`ml-auto text-xs px-2 py-1 rounded-full ${isActive ? 'bg-white/20' : 'bg-primary/20 text-primary'
                    }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};