import React, { useEffect, useState } from 'react';
import { 
  Users, 
  FileText, 
  Building2, 
  // Eye, 
  TrendingUp, 
  Star,
  Activity,
  PieChart,
  Archive,
  User,
  LineChart,
  Library,
  BookOpen,
  Clock,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';
import mainAxios from '../Instance/mainAxios';
import AdminCartsViewer from './AdminOrdersCarts/AllCarts';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

type StatCardProps = {
  icon: React.ElementType;
  title: string;
  value: number;
  subtitle?: string;
  trend?: number;
  className?: string;
};

const StatCard = ({ icon: Icon, title, value, subtitle, trend, className = '' }: StatCardProps) => (
  <div className={`bg-white border border-gray-100 rounded-lg p-5 hover:border-blue-200 transition-colors ${className}`}>
    <div className="flex items-start justify-between">
      <div className="flex items-start space-x-4">
        <div className="p-3 bg-blue-50 rounded-lg">
          <Icon className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className="text-2xl font-semibold text-gray-900 mt-1">{value}</p>
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        </div>
      </div>
      {trend !== undefined && (
        <div className={`flex items-center text-xs font-medium ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {trend >= 0 ? (
            <TrendingUp className="h-4 w-4 mr-1" />
          ) : (
            <TrendingUp className="h-4 w-4 mr-1 transform rotate-180" />
          )}
          <span>{Math.abs(trend).toFixed(2)}%</span>
        </div>
      )}
    </div>
  </div>
);

const SectionHeader = ({ title, icon: Icon, action }: { title: string; icon?: React.ElementType; action?: React.ReactNode }) => (
  <div className="flex items-center justify-between mb-4">
    <div className="flex items-center">
      {Icon && <Icon className="h-5 w-5 text-gray-400 mr-2" />}
      <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
    </div>
    {action}
  </div>
);

const TableSection = ({ 
  title, 
  children, 
  className = '' 
}: { 
  title: string; 
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`bg-white border border-gray-100 rounded-lg overflow-hidden ${className}`}>
    <div className="px-5 py-4 border-b border-gray-100">
      <h3 className="text-base font-medium text-gray-800">{title}</h3>
    </div>
    <div className="overflow-x-auto">
      {children}
    </div>
  </div>
);

interface DigitalRepoData {
  overview: {
    total_users: number;
    total_content_items: number;
    total_views: number;
    total_downloads: number;
    total_visitors: number;
    generated_at: string;
  };
  users: {
    total: number;
    active_today: number;
    active_this_week: number;
    active_this_month: number;
    new_today: number;
    new_this_week: number;
    new_this_month: number;
    top_contributors: Array<{
      username: string;
      first_name: string;
      last_name: string;
      total_uploads: number;
      artworks: number;
      documents: number;
      museums: number;
    }>;
  };
  content: {
    artworks: {
      total: number;
      public: number;
      private: number;
      featured: number;
      added_today: number;
      added_this_week: number;
      added_this_month: number;
      total_views: number;
      by_category: Array<{
        name: string;
        museum_count: number;
      }>;
      top_viewed: Array<{
        name: string;
        view_count: number;
        slug: string;
      }>;
    };
    documents: {
      total: number;
      public: number;
      restricted: number;
      private: number;
      featured: number;
      downloadable: number;
      added_today: number;
      added_this_week: number;
      added_this_month: number;
      total_views: number;
      total_downloads: number;
      by_type: Array<any>;
      top_viewed: Array<any>;
      top_downloaded: Array<any>;
    };
    museums: {
      total: number;
      active: number;
      featured: number;
      added_today: number;
      added_this_week: number;
      added_this_month: number;
      total_views: number;
      total_visitors: number;
      by_category: Array<{
        name: string;
        museum_count: number;
      }>;
      top_viewed: Array<{
        name: string;
        view_count: number;
        slug: string;
      }>;
    };
    collections: {
      total: number;
      featured: number;
      added_today: number;
      added_this_week: number;
      added_this_month: number;
    };
    library_collections: {
      total: number;
      featured: number;
    };
  };
  growth_trends: Array<{
    month: string;
    users: number;
    artworks: number;
    documents: number;
    museums: number;
  }>;
}

const DigitalRepoStatistics = () => {
  const [data, setData] = useState<DigitalRepoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await mainAxios.get('/digital-repo/admin/statistics/');
        if (!response) {
          throw new Error(`HTTP error! status: ${response}`);
        }
        const jsonData = await response.data;
        setData(jsonData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
          <p className="mt-2 text-gray-600">Loading statistics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white border border-red-100 rounded-lg p-6 max-w-md text-center">
          <h2 className="text-lg font-medium text-red-600">Error Loading Data</h2>
          <p className="mt-2 text-gray-600">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white border border-gray-100 rounded-lg p-6 max-w-md text-center">
          <h2 className="text-lg font-medium text-gray-800">No Data Available</h2>
          <p className="mt-2 text-gray-600">Unable to load statistics data</p>
        </div>
      </div>
    );
  }

  // Prepare data for charts
  const userGrowthData = {
    labels: data.growth_trends.map(trend => trend.month),
    datasets: [
      {
        label: 'Users',
        data: data.growth_trends.map(trend => trend.users),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.3,
        fill: true
      }
    ]
  };

  const museumGrowthData = {
    labels: data.growth_trends.map(trend => trend.month),
    datasets: [
      {
        label: 'Museums',
        data: data.growth_trends.map(trend => trend.museums),
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.3,
        fill: true
      }
    ]
  };

  const museumCategoryData = {
    labels: data.content.museums.by_category.map(cat => cat.name),
    datasets: [
      {
        data: data.content.museums.by_category.map(cat => cat.museum_count),
        backgroundColor: [
          'rgba(59, 130, 246, 0.7)',
          'rgba(16, 185, 129, 0.7)',
          'rgba(245, 158, 11, 0.7)',
          'rgba(139, 92, 246, 0.7)',
          'rgba(244, 63, 94, 0.7)'
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(139, 92, 246, 1)',
          'rgba(244, 63, 94, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  const activityData = {
    labels: ['Today', 'This Week', 'This Month'],
    datasets: [
      {
        label: 'Active Users',
        data: [
          data.users.active_today,
          data.users.active_this_week,
          data.users.active_this_month
        ],
        backgroundColor: 'rgba(59, 130, 246, 0.7)'
      },
      {
        label: 'New Users',
        data: [
          data.users.new_today,
          data.users.new_this_week,
          data.users.new_this_month
        ],
        backgroundColor: 'rgba(16, 185, 129, 0.7)'
      }
    ]
  };

  // Calculate trends
  const userGrowthTrend = data.growth_trends.length >= 2 
    ? ((data.growth_trends[data.growth_trends.length - 1].users - data.growth_trends[data.growth_trends.length - 2].users) / 
      data.growth_trends[data.growth_trends.length - 2].users * 100)
    : 0;

  const museumGrowthTrend = data.growth_trends.length >= 2
    ? ((data.growth_trends[data.growth_trends.length - 1].museums - data.growth_trends[data.growth_trends.length - 2].museums) / 
      (data.growth_trends[data.growth_trends.length - 2].museums || 1)) * 100
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
      <div className="w-full mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white border border-gray-100 rounded-lg p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Digital Repository Dashboard</h1>
              <p className="text-gray-500 mt-1">Comprehensive analytics for your digital repository</p>
            </div>
            <div className="mt-4 lg:mt-0 flex items-center space-x-2 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Last updated: {formatDate(data.overview.generated_at)}</span>
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          <StatCard
            icon={Users}
            title="Total Users"
            value={data.overview.total_users}
            subtitle="Registered accounts"
            trend={userGrowthTrend}
          />
          <StatCard
            icon={Archive}
            title="Content Items"
            value={data.overview.total_content_items}
            subtitle="Total digital assets"
            trend={museumGrowthTrend}
          />
          {/* <StatCard
            icon={Eye}
            title="Total Views"
            value={data.overview.total_views}
            subtitle="Content views"
          />
          <StatCard
            icon={Activity}
            title="Visitors"
            value={data.overview.total_visitors}
            subtitle="Unique visitors"
          /> */}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* User Growth Chart */}
          <div className="bg-white border border-gray-100 rounded-lg p-4">
            <SectionHeader 
              title="User Growth" 
              icon={LineChart}
              action={
                <div className="flex items-center text-xs text-blue-600">
                  <span>Last 12 months</span>
                  <ChevronRight className="h-4 w-4" />
                </div>
              }
            />
            <div className="h-64">
              <Line 
                data={userGrowthData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true
                    }
                  }
                }}
              />
            </div>
          </div>

          {/* Museum Growth Chart */}
          <div className="bg-white border border-gray-100 rounded-lg p-4">
            <SectionHeader 
              title="Museum Growth" 
              icon={Building2}
              action={
                <div className="flex items-center text-xs text-green-600">
                  <span>Last 12 months</span>
                  <ChevronRight className="h-4 w-4" />
                </div>
              }
            />
            <div className="h-64">
              <Line 
                data={museumGrowthData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true
                    }
                  }
                }}
              />
            </div>
          </div>

          {/* Museum Categories */}
          <div className="bg-white border border-gray-100 rounded-lg p-4">
            <SectionHeader 
              title="Museum Categories" 
              icon={PieChart}
            />
            <div className="h-64">
              <Pie 
                data={museumCategoryData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'right'
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* User Activity and Content Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* User Activity */}
          <div className="bg-white border border-gray-100 rounded-lg p-4">
            <SectionHeader 
              title="User Activity" 
              icon={Activity}
            />
            <div className="h-64">
              <Bar 
                data={activityData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true
                    }
                  }
                }}
              />
            </div>
          </div>

          {/* Content Distribution */}
          <div className="bg-white border border-gray-100 rounded-lg p-4">
            <SectionHeader 
              title="Content Distribution" 
              icon={PieChart}
            />
            <div className="grid grid-cols-2 gap-4">
              <StatCard
                icon={Building2}
                title="Museums"
                value={data.content.museums.total}
                subtitle={`${data.content.museums.featured} featured`}
                className="col-span-1"
              />
              <StatCard
                icon={FileText}
                title="Documents"
                value={data.content.documents.total}
                subtitle={`${data.content.documents.public} public`}
                className="col-span-1"
              />
              <StatCard
                icon={BookOpen}
                title="Artworks"
                value={data.content.artworks.total}
                subtitle={`${data.content.artworks.public} public`}
                className="col-span-1"
              />
              <StatCard
                icon={Library}
                title="Collections"
                value={data.content.collections.total}
                subtitle={`${data.content.collections.featured} featured`}
                className="col-span-1"
              />
            </div>
          </div>
        </div>

        {/* Detailed Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Top Contributors */}
          <TableSection title="Top Contributors">
            <table className="w-full divide-y divide-gray-100">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uploads</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Museums</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.users.top_contributors.map((user, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <User className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {user.first_name || user.username}
                          </div>
                          <div className="text-xs text-gray-500">@{user.username}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {user.total_uploads}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {user.museums}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableSection>

          {/* Museum Categories */}
          <TableSection title="Museum Categories">
            <table className="w-full divide-y divide-gray-100">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Count</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">% of Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.content.museums.by_category.map((category, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      {category.name}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {category.museum_count}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(category.museum_count / data.content.museums.total) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500">
                          {Math.round((category.museum_count / data.content.museums.total) * 100)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableSection>
        </div>

        {/* Museum List */}
        <TableSection title="All Museums">
          <table className="w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Museum</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.content.museums.top_viewed.map((museum, index) => {
                const category = data.content.museums.by_category[index % data.content.museums.by_category.length];
                return (
                  <tr key={index}>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <Building2 className="flex-shrink-0 h-5 w-5 text-gray-400" />
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{museum.name}</div>
                          <div className="text-xs text-gray-500">{museum.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {category?.name || 'N/A'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {museum.view_count}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </TableSection>

        {/* Recent Growth Trends */}
        <TableSection title="Recent Growth Trends">
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Monthly Metrics</h4>
                <div className="space-y-3">
                  {data.growth_trends.slice(-3).reverse().map((trend, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{trend.month}</p>
                          <p className="text-xs text-gray-500">Monthly snapshot</p>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div className="text-center">
                            <p className="font-medium text-gray-900">{trend.users}</p>
                            <p className="text-gray-500">Users</p>
                          </div>
                          <div className="text-center">
                            <p className="font-medium text-gray-900">{trend.museums}</p>
                            <p className="text-gray-500">Museums</p>
                          </div>
                          <div className="text-center">
                            <p className="font-medium text-gray-900">{trend.documents}</p>
                            <p className="text-gray-500">Docs</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Key Insights</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg mr-3">
                        <TrendingUp className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">User Growth</p>
                        <p className="text-xs text-gray-500">
                          {userGrowthTrend >= 0 ? '+' : ''}{Math.round(userGrowthTrend)}% from last month
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="p-2 bg-green-100 rounded-lg mr-3">
                        <Building2 className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">New Museums</p>
                        <p className="text-xs text-gray-500">
                          {data.content.museums.added_this_month} added this month
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="p-2 bg-purple-100 rounded-lg mr-3">
                        <Star className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Featured Content</p>
                        <p className="text-xs text-gray-500">
                          {data.content.museums.featured} of {data.content.museums.total} museums featured
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TableSection>
        <AdminCartsViewer />
      </div>
    </div>
  );
};

export default DigitalRepoStatistics;