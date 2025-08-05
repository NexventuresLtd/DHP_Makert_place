import { useState, useEffect } from 'react';
import { Sidebar } from '../comps/dashboard/Sidebar';
import { Navbar } from '../comps/dashboard/newNavBar';
import { MainContent } from '../comps/dashboard/MainContent';

export const DHPDashboard: React.FC = () => {
  const storedActiveItem = localStorage.getItem('activeSidebarItem') || 'dashboard';
  const [activeItem, setActiveItem] = useState(storedActiveItem);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const handleItemClick = (itemId: string) => {
    setActiveItem(itemId);
    localStorage.setItem('activeSidebarItem', itemId);
    if (isMobile) {
      setIsSidebarOpen(false); // Close sidebar on mobile after selection
    }
  };

  const handleSearch = (query: string) => {
    console.log('Search query:', query);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(false); // Always show sidebar on larger screens
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100">
      <div className="flex h-screen">
        {/* Sidebar - hidden on mobile unless toggled */}
        <div className={`${isMobile ? 'fixed inset-0 z-40' : 'relative'} ${isMobile && !isSidebarOpen ? 'hidden' : 'block'} bg-white/80 z-50 backdrop-blur-md border-r border-white/20 w-64`}>
          <Sidebar
            activeItem={activeItem}
            onItemClick={handleItemClick}
            onClose={isMobile ? toggleSidebar : undefined}
          />
        </div>
          {isMobile && isSidebarOpen && (
            <div
              className="fixed inset-0  z-10 bg-black/50"
              onClick={toggleSidebar}
            />
          )}

        <div className="flex-1 flex flex-col overflow-hidden ">
          <Navbar
            onSearch={handleSearch}
            onMenuToggle={toggleSidebar}
            isSidebarOpen={isSidebarOpen}
          />
          <MainContent activeItem={activeItem} />
        </div>
      </div>
    </div>
  );
};

export default DHPDashboard;