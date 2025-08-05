// components/MainContent.tsx
import  DashboardContent  from './DashboardContent';
import { GenericContent } from './GenericContent';
import CategoriesDashboard from './AdminCategories/ManageCategory';
import ProductsDashboard from './AdminProduct/manageProduct';
import CustomerManagement from './AdminCustomer.tsx/CustomerMange';
import AdminCartsViewer from './AdminOrdersCarts/AllCarts';
import ProfilePage from '../sharedComps/Profile';

interface MainContentProps {
  activeItem: string;
}

export const MainContent: React.FC<MainContentProps> = ({ activeItem }) => {
  const renderContent = () => {
    switch (activeItem) {
      case 'dashboard':
        return <DashboardContent />;;
      case 'creator_dashboard':
        return <ProfilePage ShowNav={false} />;
      case 'products':
        return <ProductsDashboard />;
      case 'categories':
        return <CategoriesDashboard />;
      case 'customers':
        return <CustomerManagement />;
      case 'analytics':
        return <DashboardContent />;;
      case 'carts':
        return <AdminCartsViewer />;
      case 'settings':
        return <GenericContent title="Settings" description="Configure your account and preferences" />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <main className="flex-1 p-6 overflow-y-auto">
      {renderContent()}
    </main>
  );
};