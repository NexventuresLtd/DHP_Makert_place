// components/MainContent.tsx
import { DashboardContent } from './DashboardContent';
import { GenericContent } from './GenericContent';
import CategoriesDashboard from './AdminCategories/ManageCategory';
import ProductsDashboard from './AdminProduct/manageProduct';
import CustomerManagement from './AdminCustomer.tsx/CustomerMange';

interface MainContentProps {
  activeItem: string;
}

export const MainContent: React.FC<MainContentProps> = ({ activeItem }) => {
  const renderContent = () => {
    switch (activeItem) {
      case 'dashboard':
        return <DashboardContent />;
      case 'products':
        return <ProductsDashboard />;
      case 'categories':
        return <CategoriesDashboard />;
      case 'customers':
        return <CustomerManagement />;
      case 'analytics':
        return <GenericContent title="Analytics" description="Analyze your sales and performance" />;
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