import { useState, useEffect } from "react";
import {
  Plus,
  Settings,
  BarChart3,
  Users,
  Building2,
  FileText,
  Calendar,
  ChevronRight,
} from "lucide-react";
import museumService from "../../services/museumService";
import CreateMuseumModal from "./CreateMuseumModal";
import MuseumContentManager from "./MuseumContentManager";
import { getUserInfo } from "../../app/Localstorage";
import type { Museum, MuseumWithContent } from "../../services/museumService";

export default function AdminDashboard() {
  const [museums, setMuseums] = useState<Museum[]>([]);
  const [stats, setStats] = useState({
    totalMuseums: 0,
    totalVisits: 0,
    featuredMuseums: 0,
    recentlyAdded: 0,
  });
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [managingContent, setManagingContent] =
    useState<MuseumWithContent | null>(null);

  const userInfo = getUserInfo;
  const isAdmin = userInfo?.type === "admin";

  useEffect(() => {
    if (isAdmin) {
      fetchDashboardData();
    }
  }, [isAdmin]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const museumsResponse = await museumService.getMuseums();
      const museumsList = museumsResponse.results;

      setMuseums(museumsList);

      // Calculate stats
      const totalVisits = museumsList.reduce(
        (sum, museum) => sum + museum.view_count,
        0
      );
      const featuredCount = museumsList.filter(
        (museum) => museum.is_featured
      ).length;
      const recentDate = new Date();
      recentDate.setMonth(recentDate.getMonth() - 1);
      const recentlyAdded = museumsList.filter(
        (museum) => new Date(museum.created_at) > recentDate
      ).length;

      setStats({
        totalMuseums: museumsList.length,
        totalVisits,
        featuredMuseums: featuredCount,
        recentlyAdded,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSuccess = (newMuseum: Museum) => {
    setMuseums((prev) => [...prev, newMuseum]);
    setShowCreateModal(false);
    setStats((prev) => ({
      ...prev,
      totalMuseums: prev.totalMuseums + 1,
      recentlyAdded: prev.recentlyAdded + 1,
    }));
  };

  const handleManageContent = async (museum: Museum) => {
    try {
      const detailedMuseum = await museumService.getMuseum(museum.slug);
      setManagingContent(detailedMuseum);
    } catch (error) {
      console.error("Error loading museum details:", error);
      // Create basic structure if detailed fetch fails
      const basicMuseumWithContent: MuseumWithContent = {
        ...museum,
        sections: [],
        gallery_items: [],
        artifacts: [],
        virtual_exhibitions: [],
        additional_info: {
          id: 0,
          museum: museum.id,
          hours: "9:00 AM - 5:00 PM",
          contact: museum.phone || "",
          admission: "Contact museum for pricing",
          facilities: [],
          directions: "",
          parking_info: "",
          accessibility_info: "",
          group_booking_info: "",
          special_programs: [],
          created_at: "",
          updated_at: "",
        },
      };
      setManagingContent(basicMuseumWithContent);
    }
  };

  const handleContentUpdate = (updatedMuseum: MuseumWithContent) => {
    setManagingContent(updatedMuseum);
    // Update the museums list
    setMuseums((prev) =>
      prev.map((m) =>
        m.id === updatedMuseum.id ? { ...m, ...updatedMuseum } : m
      )
    );
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <Users className="w-16 h-16 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600">
            You need administrator privileges to access this page.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Manage museums and their content
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add New Museum
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Museums
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalMuseums}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Visits
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalVisits.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <FileText className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Featured Museums
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.featuredMuseums}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Recently Added
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.recentlyAdded}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Museums Management */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Museum Management
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Manage museum information and content
            </p>
          </div>

          <div className="p-6">
            {museums.length === 0 ? (
              <div className="text-center py-12">
                <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Museums Yet
                </h3>
                <p className="text-gray-600 mb-4">
                  Get started by creating your first museum.
                </p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create First Museum
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {museums.map((museum) => (
                  <div
                    key={museum.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                        <img
                          src={museum.main_image}
                          alt={museum.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {museum.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {museum.location}
                        </p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-xs text-gray-500">
                            {museum.view_count} views
                          </span>
                          {museum.is_featured && (
                            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                              Featured
                            </span>
                          )}
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {museum.category_name}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleManageContent(museum)}
                        className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors flex items-center gap-2"
                      >
                        <Settings className="w-4 h-4" />
                        Manage Content
                      </button>
                      <button className="text-gray-400 hover:text-gray-600">
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Museum Modal */}
      {showCreateModal && (
        <CreateMuseumModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleCreateSuccess}
        />
      )}

      {/* Museum Content Manager Modal */}
      {managingContent && (
        <MuseumContentManager
          museum={managingContent}
          onUpdate={handleContentUpdate}
          onClose={() => setManagingContent(null)}
        />
      )}
    </div>
  );
}
