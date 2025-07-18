// App.tsx
import { useState } from 'react';
import { Sidebar } from '../comps/dashboard/Sidebar';
import { Navbar } from '../comps/dashboard/newNavBar';
import { MainContent } from '../comps/dashboard/MainContent';


export const DHPDashboard: React.FC = () => {
  const [activeItem, setActiveItem] = useState('dashboard');

  const handleSearch = (query: string) => {
    console.log('Search query:', query);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100">
      <div className="flex h-screen">
        <Sidebar activeItem={activeItem} onItemClick={setActiveItem} />
        
        <div className="flex-1 flex flex-col">
          <Navbar onSearch={handleSearch} />
          <MainContent activeItem={activeItem} />
        </div>
      </div>
    </div>
  );
};

export default DHPDashboard;