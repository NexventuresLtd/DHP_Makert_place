import { useState, useEffect } from "react";
import {
  Home,
  MapPin,
  ArrowRight,
  Search,
  Filter,
  Edit,
  Trash2,
  Settings,
} from "lucide-react";
import MuseumDetailView from "./DigMuseumDetails";
import museumService from "../../services/museumService";
import { getUserInfo } from "../../app/Localstorage";
import CreateMuseumModal from "./CreateMuseumModal";
import MuseumContentManager from "./MuseumContentManager";
import type {
  Museum,
  MuseumCategory,
  MuseumWithContent,
} from "../../services/museumService";

const categories = [
  "All",
  "Historical",
  "Cultural",
  "History",
  "Memorial",
  "Art",
];

export default function MuseumsGallery() {
  const [selectedMuseum, setSelectedMuseum] =
    useState<MuseumWithContent | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [museums, setMuseums] = useState<Museum[]>([]);
  const [_, setMuseumCategories] = useState<MuseumCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingMuseum, setEditingMuseum] = useState<Museum | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loadingMuseumDetail, setLoadingMuseumDetail] = useState(false);
  const [managingContent, setManagingContent] =
    useState<MuseumWithContent | null>(null);

  // Get user info to check if admin
  const userInfo = getUserInfo;

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch museums and categories in parallel
        const [museumsResponse, categoriesResponse] = await Promise.all([
          museumService.getMuseums(),
          museumService.getCategories(),
        ]);

        setMuseums(museumsResponse.results);
        setMuseumCategories(categoriesResponse);
      } catch (err) {
        console.error("Error fetching museum data:", err);
        setError("Failed to load museum data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredMuseums = museums.filter((museum) => {
    const matchesCategory =
      selectedCategory === "All" || museum.category_name === selectedCategory;
    const matchesSearch =
      museum.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      museum.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      museum.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Handle museum selection and record visit
  const handleMuseumSelect = async (museum: Museum) => {
    try {
      setLoadingMuseumDetail(true);

      // Fetch detailed museum data with all content
      const detailedMuseum = await museumService.getMuseum(museum.slug);

      // Record the visit in the backend
      await museumService.recordVisit(museum.slug);

      setSelectedMuseum(detailedMuseum);
    } catch (err) {
      console.error("Error loading museum details:", err);
      // Still try to show basic museum info even if detailed fetch fails
      // Create a basic MuseumWithContent object
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
      setSelectedMuseum(basicMuseumWithContent);
    } finally {
      setLoadingMuseumDetail(false);
    }
  };

  // Handle edit museum
  const handleEditMuseum = (museum: Museum, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the museum visit
    setEditingMuseum(museum);
    setShowEditModal(true);
  };

  // Handle delete museum
  const handleDeleteMuseum = async (museum: Museum, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the museum visit

    if (
      window.confirm(
        `Are you sure you want to delete "${museum.name}"? This action cannot be undone.`
      )
    ) {
      try {
        await museumService.deleteMuseum(museum.slug);
        // Remove from local state
        setMuseums((prevMuseums) =>
          prevMuseums.filter((m) => m.id !== museum.id)
        );
        alert("Museum deleted successfully");
      } catch (err) {
        console.error("Error deleting museum:", err);
        alert("Failed to delete museum. Please try again.");
      }
    }
  };

  // Handle successful museum update
  const handleUpdateSuccess = (updatedMuseum: Museum) => {
    // Update the museum in the local state
    setMuseums((prevMuseums) =>
      prevMuseums.map((m) => (m.id === updatedMuseum.id ? updatedMuseum : m))
    );
    setShowEditModal(false);
    setEditingMuseum(null);
  };

  // Handle content management
  const handleManageContent = async (museum: Museum, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the museum visit

    try {
      setLoadingMuseumDetail(true);
      // Fetch detailed museum data for content management
      const detailedMuseum = await museumService.getMuseum(museum.slug);
      setManagingContent(detailedMuseum);
    } catch (err) {
      console.error(
        "Error loading museum details for content management:",
        err
      );
      // Create a basic MuseumWithContent object for content management
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
    } finally {
      setLoadingMuseumDetail(false);
    }
  };

  // Handle content update from content manager
  const handleContentUpdate = (updatedMuseum: MuseumWithContent) => {
    setManagingContent(updatedMuseum);
    // Also update the selected museum if it's the same one
    if (selectedMuseum && selectedMuseum.id === updatedMuseum.id) {
      setSelectedMuseum(updatedMuseum);
    }
    // Update the basic museum data in the museums list
    setMuseums((prevMuseums) =>
      prevMuseums.map((m) =>
        m.id === updatedMuseum.id ? { ...m, ...updatedMuseum } : m
      )
    );
  };

  // Check if user is admin
  const isAdmin = true;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading museums...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <Search className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Error Loading Museums
          </h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {!selectedMuseum ? (
        <div className="min-h-screen bg-gray-50">
          {/* Header */}
          <div className="bg-white border-b border-gray-200">
            <div className="max-w-full md:max-w-10/12 mx-auto px-4 sm:px-6 lg:px-8">
              {/* Breadcrumb */}
              <div className="flex items-center py-4 text-sm text-gray-500">
                <Home className="w-4 h-4 mr-2" />
                <span className="text-primary font-medium">Museums</span>
                <span className="px-1 flex">{">"} </span>
                <span className="text-primary font-medium">
                  {selectedCategory}
                </span>
              </div>

              {/* Main Header */}
              <div className="pb-6">
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                  Museums
                </h1>

                {/* Search and Filter Bar */}
                <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                  {/* Search */}
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search museums..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Category Filter */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
                    <Filter className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                          selectedCategory === category
                            ? "bg-primary text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-full md:max-w-10/12 mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {filteredMuseums.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No museums found
                </h3>
                <p className="text-gray-500">
                  Try adjusting your search terms or category filter.
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {filteredMuseums.map((museum, index) => (
                  <div
                    key={museum.id}
                    className={`bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 ${
                      index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                    } flex flex-col lg:flex`}
                  >
                    {/* Image Section */}
                    <div className="lg:w-1/2 relative overflow-hidden min-h-72">
                      <img
                        src={museum.main_image}
                        alt={museum.name}
                        className="w-full h-full lg:h-full object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-white/90 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                          {museum.category_name}
                        </span>
                      </div>
                      {museum.is_featured && (
                        <div className="absolute top-4 right-4">
                          <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                            Featured
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content Section */}
                    <div className="lg:w-1/2 p-6 lg:p-8 flex flex-col justify-between">
                      <div>
                        {/* Location */}
                        <div className="flex items-center text-primary mb-3">
                          <MapPin className="w-4 h-4 mr-2" />
                          <span className="text-sm font-medium">
                            {museum.location}
                          </span>
                        </div>

                        {/* Museum Name */}
                        <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">
                          {museum.name}
                        </h2>

                        {/* Description */}
                        <p className="text-gray-600 mb-4 leading-relaxed">
                          {museum.description}
                        </p>

                        {/* Long Description */}
                        <p className="text-gray-500 text-sm leading-relaxed mb-6">
                          {museum.long_description}
                        </p>

                        {/* Additional Info */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {museum.established_year && (
                            <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                              Est. {museum.established_year}
                            </span>
                          )}
                          {museum.has_guided_tours && (
                            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                              Guided Tours
                            </span>
                          )}
                          {museum.is_wheelchair_accessible && (
                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                              Accessible
                            </span>
                          )}
                          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                            {museum.view_count} views
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex justify-start gap-3">
                        <button
                          onClick={() => handleMuseumSelect(museum)}
                          className="bg-primary hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors group"
                        >
                          Visit
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>

                        {isAdmin && (
                          <>
                            <button
                              onClick={(e) => handleEditMuseum(museum, e)}
                              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                              Edit
                            </button>
                            <button
                              onClick={(e) => handleManageContent(museum, e)}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
                            >
                              <Settings className="w-4 h-4" />
                              Manage Content
                            </button>
                            <button
                              onClick={(e) => handleDeleteMuseum(museum, e)}
                              className="bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <MuseumDetailView
          museum={selectedMuseum}
          onBack={() => setSelectedMuseum(null)}
          onMuseumUpdate={handleContentUpdate}
        />
      )}

      {/* Edit Museum Modal */}
      {showEditModal && editingMuseum && (
        <CreateMuseumModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSuccess={handleUpdateSuccess}
          initialData={editingMuseum}
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
    </>
  );
}
