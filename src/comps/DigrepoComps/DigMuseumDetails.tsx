import { useState, useEffect } from "react";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Users,
  Camera,
  BookOpen,
  Globe,
  Play,
  Edit,
  Plus,
  Trash2,
  Save,
  X,
} from "lucide-react";
import museumService, {
  type MuseumWithContent,
  type MuseumSection as ApiMuseumSection,
  type MuseumInfo as ApiMuseumInfo,
} from "../../services/museumService";
import { getUserInfo } from "../../app/Localstorage";

interface MuseumDetailViewProps {
  museum: MuseumWithContent;
  onBack: () => void;
  onMuseumUpdate?: (updatedMuseum: MuseumWithContent) => void;
}

const navigationItems = [
  { id: "overview", label: "Overview", icon: BookOpen },
  { id: "gallery", label: "Gallery", icon: Camera },
  { id: "artifacts", label: "Artifacts", icon: Users },
  { id: "cultural-heritage", label: "Cultural Heritage", icon: Globe },
  { id: "natural-history", label: "Natural History", icon: Clock },
  { id: "virtual-exhibitions", label: "Virtual Exhibitions", icon: Play },
];

export default function MuseumDetailView({
  museum,
  onBack,
  onMuseumUpdate,
}: MuseumDetailViewProps) {
  const [activeSection, setActiveSection] = useState("overview");
  const [currentMuseum, setCurrentMuseum] = useState<MuseumWithContent>(museum);
  const [loading, setLoading] = useState(false);

  // Admin states
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAddForm, setShowAddForm] = useState<string | null>(null);

  // Check if user is admin
  useEffect(() => {
    const userInfo = getUserInfo;
    setIsAdmin(userInfo?.type === "admin");
  }, []);

  // Update current museum when prop changes
  useEffect(() => {
    setCurrentMuseum(museum);
  }, [museum]);

  // Function to refresh museum data with all content
  const refreshMuseumData = async () => {
    try {
      setLoading(true);
      const updatedMuseum = await museumService.getMuseum(currentMuseum.slug);
      setCurrentMuseum(updatedMuseum);
      onMuseumUpdate?.(updatedMuseum);
    } catch (error) {
      console.error("Error refreshing museum data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Refresh data when component mounts to ensure we have latest content
  useEffect(() => {
    refreshMuseumData();
  }, []);

  // Helper function to get section by type
  const getSection = (sectionType: string): ApiMuseumSection | undefined => {
    return currentMuseum.sections?.find(
      (section) => section.section_type === sectionType
    );
  };

  // Helper function to get museum info with fallback
  const getMuseumInfo = (): ApiMuseumInfo => {
    return (
      currentMuseum.additional_info || {
        id: 0,
        museum: currentMuseum.id,
        hours: "9:00 AM - 5:00 PM",
        contact: currentMuseum.phone || "+250 XXX XXX XXX",
        admission: "Contact museum for pricing",
        facilities: [
          "Guided Tours",
          "Gift Shop",
          "Parking",
          "Accessibility Access",
        ],
        directions: "",
        parking_info: "",
        accessibility_info: "",
        group_booking_info: "",
        special_programs: [],
        created_at: "",
        updated_at: "",
      }
    );
  };

  const handleCreateSection = async (sectionData: any) => {
    try {
      await museumService.createMuseumSection({
        ...sectionData,
        museum: currentMuseum.id,
      });

      // Refresh museum data to get updated content
      await refreshMuseumData();
      setShowAddForm(null);
    } catch (error: any) {
      console.error("Error creating section:", error);

      // Provide more specific error messages
      if (error.response?.status === 401) {
        alert(
          "Authentication required. Please log in as an admin to create content."
        );
      } else if (error.response?.status === 403) {
        alert(
          "Permission denied. You need admin privileges to create content."
        );
      } else if (error.response?.data?.detail) {
        alert(`Failed to create section: ${error.response.data.detail}`);
      } else {
        alert("Failed to create section. Please try again.");
      }
    }
  };

  const handleCreateGalleryItem = async (formData: FormData) => {
    try {
      await museumService.createGalleryItem(formData);

      // Refresh museum data to get updated content
      await refreshMuseumData();
      setShowAddForm(null);
    } catch (error) {
      console.error("Error creating gallery item:", error);
      alert("Failed to create gallery item");
    }
  };

  const handleCreateArtifact = async (formData: FormData) => {
    try {
      await museumService.createArtifact(formData);

      // Refresh museum data to get updated content
      await refreshMuseumData();
      setShowAddForm(null);
    } catch (error) {
      console.error("Error creating artifact:", error);
      alert("Failed to create artifact");
    }
  };

  const handleCreateVirtualExhibition = async (formData: FormData) => {
    try {
      await museumService.createVirtualExhibition(formData);

      // Refresh museum data to get updated content
      await refreshMuseumData();
      setShowAddForm(null);
    } catch (error) {
      console.error("Error creating virtual exhibition:", error);
      alert("Failed to create virtual exhibition");
    }
  };

  const handleDeleteItem = async (type: string, id: number) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      switch (type) {
        case "section":
          await museumService.deleteMuseumSection(id);
          break;
        case "gallery":
          await museumService.deleteGalleryItem(id);
          break;
        case "artifact":
          await museumService.deleteArtifact(id);
          break;
        case "virtual-exhibition":
          await museumService.deleteVirtualExhibition(id);
          break;
      }

      // Refresh museum data to get updated content
      await refreshMuseumData();
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
      alert(`Failed to delete ${type}`);
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        const overviewSection = getSection("overview");
        return (
          <div className="space-y-8">
            {/* Admin Section Header */}
            {isAdmin && (
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-gray-900">Overview</h3>
                <button
                  onClick={() => setShowAddForm("overview")}
                  className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Edit Content
                </button>
              </div>
            )}

            {/* Hero Section */}
            <div className="relative">
              <div className="relative h-64 md:h-80 lg:h-96 rounded-2xl overflow-hidden">
                <img
                  src={currentMuseum.main_image}
                  alt={currentMuseum.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <div className="bg-green-600/90 backdrop-blur-sm rounded-lg p-6">
                    <h2 className="text-2xl font-bold mb-2">
                      {currentMuseum.name}
                    </h2>
                    <p className="text-green-100 mb-4">
                      {currentMuseum.description}
                    </p>
                    <p className="text-green-50 text-sm">
                      {currentMuseum.long_description}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="prose prose-lg max-w-none">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {overviewSection?.title || `Discover ${currentMuseum.name}`}
              </h3>

              {overviewSection?.content?.map((paragraph, index) => (
                <p key={index} className="text-gray-700 leading-relaxed mb-6">
                  {paragraph}
                </p>
              )) || (
                <div className="space-y-6">
                  {!overviewSection && isAdmin && (
                    <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                      <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h4 className="text-lg font-medium text-gray-900 mb-2">
                        No Overview Content
                      </h4>
                      <p className="text-gray-600 mb-4">
                        Add overview content to help visitors discover this
                        museum.
                      </p>
                      <button
                        onClick={() => setShowAddForm("overview")}
                        className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Add Overview Content
                      </button>
                    </div>
                  )}
                  {!overviewSection && !isAdmin && (
                    <div className="text-center py-12">
                      <p className="text-gray-600">
                        Overview content will be available soon.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Dynamic Subsections */}
              {overviewSection?.subsections?.map(
                (subsection: any, index: number) => (
                  <div
                    key={index}
                    className={`rounded-2xl p-8 my-8 ${
                      subsection.type === "cta"
                        ? "bg-gray-900 text-white"
                        : "bg-gray-50"
                    }`}
                  >
                    <h4 className="text-xl font-bold mb-4">
                      {subsection.title}
                    </h4>
                    <p
                      className={`mb-6 ${
                        subsection.type === "cta"
                          ? "text-gray-300"
                          : "text-gray-700"
                      }`}
                    >
                      {subsection.content}
                    </p>
                    {subsection.buttonText && (
                      <button
                        className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                          subsection.type === "cta"
                            ? "bg-white text-gray-900 hover:bg-gray-100"
                            : "bg-primary text-white "
                        }`}
                      >
                        {subsection.buttonText}
                      </button>
                    )}
                  </div>
                )
              )}

              {/* Virtual Tour CTA if available */}
              {currentMuseum.virtual_tour_url && (
                <div className="rounded-2xl p-8 my-8 bg-gray-900 text-white">
                  <h4 className="text-xl font-bold mb-4">
                    Take a Virtual Tour
                  </h4>
                  <p className="text-gray-300 mb-6">
                    Experience {currentMuseum.name} from anywhere in the world
                    with our interactive virtual tour.
                  </p>
                  <a
                    href={currentMuseum.virtual_tour_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-6 py-3 bg-white text-gray-900 hover:bg-gray-100 rounded-lg font-semibold transition-colors"
                  >
                    Start Virtual Tour
                  </a>
                </div>
              )}

              {/* Add Section Form */}
              {isAdmin && showAddForm === "overview" && (
                <SectionForm
                  sectionType="overview"
                  museumId={currentMuseum.id}
                  onSubmit={handleCreateSection}
                  onCancel={() => setShowAddForm(null)}
                />
              )}
            </div>
          </div>
        );

      case "gallery":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold text-gray-900">Gallery</h3>
              {isAdmin && (
                <button
                  onClick={() => setShowAddForm("gallery")}
                  className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Image
                </button>
              )}
            </div>

            {currentMuseum.gallery_items &&
            currentMuseum.gallery_items.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentMuseum.gallery_items.map((item) => (
                  <div key={item.id} className="group relative">
                    <div className="aspect-square rounded-lg overflow-hidden">
                      <img
                        src={item.image_url || item.image}
                        alt={item.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    {isAdmin && (
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleDeleteItem("gallery", item.id)}
                          className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    <div className="mt-3">
                      <h4 className="font-medium text-gray-900">
                        {item.title}
                      </h4>
                      {item.description && (
                        <p className="text-sm text-gray-600 mt-1">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  No Gallery Items
                </h4>
                <p className="text-gray-600">
                  Gallery items will be displayed here once added.
                </p>
                {isAdmin && (
                  <button
                    onClick={() => setShowAddForm("gallery")}
                    className="mt-4 bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add First Gallery Item
                  </button>
                )}
              </div>
            )}

            {showAddForm === "gallery" && (
              <GalleryItemForm
                museumId={currentMuseum.id}
                onSubmit={handleCreateGalleryItem}
                onCancel={() => setShowAddForm(null)}
              />
            )}
          </div>
        );

      case "artifacts":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold text-gray-900">Artifacts</h3>
              {isAdmin && (
                <button
                  onClick={() => setShowAddForm("artifacts")}
                  className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Artifact
                </button>
              )}
            </div>

            {currentMuseum.artifacts && currentMuseum.artifacts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentMuseum.artifacts.map((artifact) => (
                  <div
                    key={artifact.id}
                    className="bg-white border border-gray-200 rounded-lg p-6 relative group"
                  >
                    {isAdmin && (
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() =>
                            handleDeleteItem("artifact", artifact.id)
                          }
                          className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    <div className="w-full h-48 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                      {artifact.image_url || artifact.image ? (
                        <img
                          src={artifact.image_url || artifact.image}
                          alt={artifact.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <Camera className="w-12 h-12 text-gray-400" />
                      )}
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-900">
                        {artifact.name}
                      </h4>
                      <p className="text-sm text-blue-600 font-medium">
                        {artifact.category_display || artifact.category}
                      </p>
                      {artifact.historical_period && (
                        <p className="text-xs text-gray-500">
                          {artifact.historical_period}
                        </p>
                      )}
                      <p className="text-gray-600 text-sm mt-2">
                        {artifact.description}
                      </p>
                      {artifact.materials && (
                        <p className="text-xs text-gray-500">
                          Materials: {artifact.materials}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  No Artifacts
                </h4>
                <p className="text-gray-600">
                  Artifacts will be displayed here once added.
                </p>
                {isAdmin && (
                  <button
                    onClick={() => setShowAddForm("artifacts")}
                    className="mt-4 bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add First Artifact
                  </button>
                )}
              </div>
            )}

            {showAddForm === "artifacts" && (
              <ArtifactForm
                museumId={currentMuseum.id}
                onSubmit={handleCreateArtifact}
                onCancel={() => setShowAddForm(null)}
              />
            )}
          </div>
        );

      case "cultural-heritage":
        const culturalSection = getSection("cultural-heritage");
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold text-gray-900">
                {culturalSection?.title || "Cultural Heritage"}
              </h3>
              {isAdmin && (
                <button
                  onClick={() => setShowAddForm("cultural-heritage")}
                  className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Edit Section
                </button>
              )}
            </div>
            <div className="prose prose-lg max-w-none">
              {culturalSection?.content?.map((paragraph, index) => (
                <p key={index} className="text-gray-700 leading-relaxed mb-4">
                  {paragraph}
                </p>
              )) || (
                <div className="space-y-4">
                  {!culturalSection && isAdmin && (
                    <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                      <Globe className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h4 className="text-lg font-medium text-gray-900 mb-2">
                        No Cultural Heritage Content
                      </h4>
                      <p className="text-gray-600 mb-4">
                        Add content about the cultural heritage and traditions
                        associated with this museum.
                      </p>
                      <button
                        onClick={() => setShowAddForm("cultural-heritage")}
                        className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Add Cultural Heritage Content
                      </button>
                    </div>
                  )}
                  {!culturalSection && !isAdmin && (
                    <div className="text-center py-12">
                      <p className="text-gray-600">
                        Cultural heritage content will be available soon.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Add Section Form */}
              {isAdmin && showAddForm === "cultural-heritage" && (
                <SectionForm
                  sectionType="cultural-heritage"
                  museumId={currentMuseum.id}
                  onSubmit={handleCreateSection}
                  onCancel={() => setShowAddForm(null)}
                />
              )}
            </div>
          </div>
        );

      case "natural-history":
        const naturalSection = getSection("natural-history");
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold text-gray-900">
                {naturalSection?.title || "Natural History"}
              </h3>
              {isAdmin && (
                <button
                  onClick={() => setShowAddForm("natural-history")}
                  className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Edit Section
                </button>
              )}
            </div>
            <div className="prose prose-lg max-w-none">
              {naturalSection?.content?.map((paragraph, index) => (
                <p key={index} className="text-gray-700 leading-relaxed mb-4">
                  {paragraph}
                </p>
              )) || (
                <div className="space-y-4">
                  {!naturalSection && isAdmin && (
                    <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                      <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h4 className="text-lg font-medium text-gray-900 mb-2">
                        No Natural History Content
                      </h4>
                      <p className="text-gray-600 mb-4">
                        Add content about the natural environment and history
                        associated with this museum.
                      </p>
                      <button
                        onClick={() => setShowAddForm("natural-history")}
                        className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Add Natural History Content
                      </button>
                    </div>
                  )}
                  {!naturalSection && !isAdmin && (
                    <div className="text-center py-12">
                      <p className="text-gray-600">
                        Natural history content will be available soon.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Add Section Form */}
              {isAdmin && showAddForm === "natural-history" && (
                <SectionForm
                  sectionType="natural-history"
                  museumId={currentMuseum.id}
                  onSubmit={handleCreateSection}
                  onCancel={() => setShowAddForm(null)}
                />
              )}
            </div>
          </div>
        );

      case "virtual-exhibitions":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold text-gray-900">
                Virtual Exhibitions
              </h3>
              {isAdmin && (
                <button
                  onClick={() => setShowAddForm("virtual-exhibitions")}
                  className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Exhibition
                </button>
              )}
            </div>

            {currentMuseum.virtual_exhibitions &&
            currentMuseum.virtual_exhibitions.length > 0 ? (
              <div className="space-y-4">
                {currentMuseum.virtual_exhibitions.map((exhibition) => (
                  <div
                    key={exhibition.id}
                    className={`rounded-lg p-6 relative group ${
                      exhibition.is_featured
                        ? "bg-gray-900 text-white"
                        : "bg-gray-100"
                    }`}
                  >
                    {isAdmin && (
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() =>
                            handleDeleteItem(
                              "virtual-exhibition",
                              exhibition.id
                            )
                          }
                          className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <Play
                            className={`w-5 h-5 mr-2 ${
                              exhibition.is_featured
                                ? "text-white"
                                : "text-gray-400"
                            }`}
                          />
                          <span
                            className={`text-xs px-2 py-1 rounded ${
                              exhibition.is_featured
                                ? "bg-white/20 text-white"
                                : "bg-blue-100 text-primary"
                            }`}
                          >
                            {exhibition.exhibition_type_display ||
                              exhibition.exhibition_type.toUpperCase()}
                          </span>
                          {exhibition.duration && (
                            <span
                              className={`text-xs ml-2 ${
                                exhibition.is_featured
                                  ? "text-gray-300"
                                  : "text-gray-500"
                              }`}
                            >
                              {exhibition.duration}
                            </span>
                          )}
                        </div>
                        <h4
                          className={`text-lg font-semibold mb-2 ${
                            exhibition.is_featured
                              ? "text-white"
                              : "text-gray-900"
                          }`}
                        >
                          {exhibition.title}
                        </h4>
                        <p
                          className={`mb-4 ${
                            exhibition.is_featured
                              ? "text-gray-300"
                              : "text-gray-600"
                          }`}
                        >
                          {exhibition.description}
                        </p>
                        {exhibition.access_instructions && (
                          <p
                            className={`text-xs mb-2 ${
                              exhibition.is_featured
                                ? "text-gray-400"
                                : "text-gray-500"
                            }`}
                          >
                            {exhibition.access_instructions}
                          </p>
                        )}
                      </div>
                      <a
                        href={exhibition.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`ml-4 px-4 py-2 rounded-lg font-semibold transition-colors ${
                          exhibition.is_featured
                            ? "bg-white text-gray-900 hover:bg-gray-100"
                            : "bg-primary text-white hover:bg-blue-700"
                        }`}
                        onClick={() => {
                          // You can add analytics tracking here
                          console.log(
                            `Accessing virtual exhibition: ${exhibition.title}`
                          );
                        }}
                      >
                        {exhibition.exhibition_type === "tour"
                          ? "Start Tour"
                          : "View Exhibition"}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Play className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  No Virtual Exhibitions
                </h4>
                <p className="text-gray-600">
                  Virtual exhibitions will be displayed here once added.
                </p>
                {isAdmin && (
                  <button
                    onClick={() => setShowAddForm("virtual-exhibitions")}
                    className="mt-4 bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add First Virtual Exhibition
                  </button>
                )}
              </div>
            )}

            {showAddForm === "virtual-exhibitions" && (
              <VirtualExhibitionForm
                museumId={currentMuseum.id}
                onSubmit={handleCreateVirtualExhibition}
                onCancel={() => setShowAddForm(null)}
              />
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-full md:max-w-10/12 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-6">
            <button
              onClick={onBack}
              className="flex items-center text-gray-600 hover:text-gray-900 mr-6"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Museums
            </button>
            <h1 className="text-2xl font-bold text-gray-900">{museum.name}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-full md:max-w-10/12 mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <nav className="space-y-1">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full flex items-center px-4 py-3 text-left text-sm font-medium transition-colors ${
                        activeSection === item.id
                          ? "bg-orange-100 text-orange-700 border-r-2 border-orange-500"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      <Icon className="w-4 h-4 mr-3" />
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Museum Info Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Location
                    </p>
                    <p className="text-sm text-gray-600">{museum.location}</p>
                    {museum.address && (
                      <p className="text-xs text-gray-500 mt-1">
                        {museum.address}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-start">
                  <Clock className="w-5 h-5 text-gray-400 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Hours</p>
                    <p className="text-sm text-gray-600">
                      {getMuseumInfo().hours}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Users className="w-5 h-5 text-gray-400 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Category
                    </p>
                    <p className="text-sm text-gray-600">
                      {museum.category_name}
                    </p>
                  </div>
                </div>

                {getMuseumInfo().admission && (
                  <div className="flex items-start">
                    <div className="w-5 h-5 flex items-center justify-center mt-0.5 mr-3">
                      <span className="text-gray-400 text-xs">$</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Admission
                      </p>
                      <p className="text-sm text-gray-600">
                        {getMuseumInfo().admission}
                      </p>
                    </div>
                  </div>
                )}

                {museum.phone && (
                  <div className="flex items-start">
                    <div className="w-5 h-5 flex items-center justify-center mt-0.5 mr-3">
                      <span className="text-gray-400 text-xs">📞</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Contact
                      </p>
                      <p className="text-sm text-gray-600">{museum.phone}</p>
                    </div>
                  </div>
                )}

                {/* Facilities */}
                {getMuseumInfo().facilities &&
                  getMuseumInfo().facilities.length > 0 && (
                    <div className="border-t pt-4">
                      <p className="text-sm font-medium text-gray-900 mb-2">
                        Facilities
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {getMuseumInfo().facilities.map((facility, index) => (
                          <span
                            key={index}
                            className="inline-block px-2 py-1 bg-gray-100 text-xs text-gray-700 rounded"
                          >
                            {facility}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 lg:p-8 relative">
              {loading && (
                <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-50 rounded-lg">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                    <p className="text-sm text-gray-600">Loading content...</p>
                  </div>
                </div>
              )}
              {renderContent()}
            </div>
            {/* <RelatedSuggestionsDemo /> */}
          </div>
        </div>
      </div>
    </div>
  );
}

// Form Components for Admin
function GalleryItemForm({
  museumId,
  onSubmit,
  onCancel,
}: {
  museumId: number;
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    order: 0,
    is_featured: false,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append("museum", museumId.toString());
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("order", formData.order.toString());
    data.append("is_featured", formData.is_featured.toString());

    if (selectedFile) {
      data.append("image", selectedFile);
    } else if (imageUrl) {
      data.append("image_url", imageUrl);
    }

    onSubmit(data);
  };

  return (
    <div className="bg-gray-50 border rounded-lg p-6 mt-6">
      <h4 className="text-lg font-semibold mb-4">Add Gallery Item</h4>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Order</label>
            <input
              type="number"
              value={formData.order}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  order: parseInt(e.target.value),
                }))
              }
              className="w-full p-2 border rounded"
              min="0"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            className="w-full p-2 border rounded"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            className="w-full p-2 border rounded"
          />
          <div className="text-center my-2 text-gray-500">OR</div>
          <input
            type="url"
            placeholder="Image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="gallery_featured"
            checked={formData.is_featured}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                is_featured: e.target.checked,
              }))
            }
            className="mr-2"
          />
          <label htmlFor="gallery_featured" className="text-sm font-medium">
            Featured
          </label>
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-primary text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Add Gallery Item
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

function ArtifactForm({
  museumId,
  onSubmit,
  onCancel,
}: {
  museumId: number;
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "other",
    historical_period: "",
    origin: "",
    materials: "",
    dimensions: "",
    acquisition_method: "",
    order: 0,
    is_on_display: true,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");

  const categories = [
    { value: "royal-regalia", label: "Royal Regalia" },
    { value: "ceremonial-weapons", label: "Ceremonial Weapons" },
    { value: "musical-instruments", label: "Musical Instruments" },
    { value: "domestic-items", label: "Domestic Items" },
    { value: "religious-objects", label: "Religious Objects" },
    { value: "artwork", label: "Artwork" },
    { value: "tools", label: "Tools" },
    { value: "textiles", label: "Textiles" },
    { value: "jewelry", label: "Jewelry" },
    { value: "pottery", label: "Pottery" },
    { value: "other", label: "Other" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append("museum", museumId.toString());
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value.toString());
    });

    if (selectedFile) {
      data.append("image", selectedFile);
    } else if (imageUrl) {
      data.append("image_url", imageUrl);
    }

    onSubmit(data);
  };

  return (
    <div className="bg-gray-50 border rounded-lg p-6 mt-6">
      <h4 className="text-lg font-semibold mb-4">Add Artifact</h4>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, category: e.target.value }))
              }
              className="w-full p-2 border rounded"
              required
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            className="w-full p-2 border rounded"
            rows={3}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Historical Period
            </label>
            <input
              type="text"
              value={formData.historical_period}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  historical_period: e.target.value,
                }))
              }
              className="w-full p-2 border rounded"
              placeholder="e.g., 18th Century"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Origin</label>
            <input
              type="text"
              value={formData.origin}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, origin: e.target.value }))
              }
              className="w-full p-2 border rounded"
              placeholder="Place of origin"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Materials</label>
            <input
              type="text"
              value={formData.materials}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, materials: e.target.value }))
              }
              className="w-full p-2 border rounded"
              placeholder="e.g., Wood, Metal, Cloth"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Dimensions</label>
            <input
              type="text"
              value={formData.dimensions}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, dimensions: e.target.value }))
              }
              className="w-full p-2 border rounded"
              placeholder="e.g., 30cm x 20cm x 15cm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            className="w-full p-2 border rounded"
          />
          <div className="text-center my-2 text-gray-500">OR</div>
          <input
            type="url"
            placeholder="Image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="artifact_display"
            checked={formData.is_on_display}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                is_on_display: e.target.checked,
              }))
            }
            className="mr-2"
          />
          <label htmlFor="artifact_display" className="text-sm font-medium">
            On Display
          </label>
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-primary text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Add Artifact
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

function VirtualExhibitionForm({
  museumId,
  onSubmit,
  onCancel,
}: {
  museumId: number;
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    exhibition_type: "tour",
    url: "",
    duration: "",
    is_featured: false,
    is_active: true,
    requires_registration: false,
    access_instructions: "",
    technical_requirements: "",
    order: 0,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState("");

  const exhibitionTypes = [
    { value: "tour", label: "Virtual Tour" },
    { value: "experience", label: "360° Experience" },
    { value: "exhibition", label: "Digital Exhibition" },
    { value: "interactive", label: "Interactive Experience" },
    { value: "documentary", label: "Documentary" },
    { value: "audio-guide", label: "Audio Guide" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append("museum", museumId.toString());
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value.toString());
    });

    if (selectedFile) {
      data.append("thumbnail_image", selectedFile);
    } else if (thumbnailUrl) {
      data.append("thumbnail_url", thumbnailUrl);
    }

    onSubmit(data);
  };

  return (
    <div className="bg-gray-50 border rounded-lg p-6 mt-6">
      <h4 className="text-lg font-semibold mb-4">Add Virtual Exhibition</h4>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Exhibition Type
            </label>
            <select
              value={formData.exhibition_type}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  exhibition_type: e.target.value,
                }))
              }
              className="w-full p-2 border rounded"
              required
            >
              {exhibitionTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            className="w-full p-2 border rounded"
            rows={3}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">URL</label>
            <input
              type="url"
              value={formData.url}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, url: e.target.value }))
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Duration</label>
            <input
              type="text"
              value={formData.duration}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, duration: e.target.value }))
              }
              className="w-full p-2 border rounded"
              placeholder="e.g., 45 minutes"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Thumbnail Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            className="w-full p-2 border rounded"
          />
          <div className="text-center my-2 text-gray-500">OR</div>
          <input
            type="url"
            placeholder="Thumbnail URL"
            value={thumbnailUrl}
            onChange={(e) => setThumbnailUrl(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Access Instructions
          </label>
          <textarea
            value={formData.access_instructions}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                access_instructions: e.target.value,
              }))
            }
            className="w-full p-2 border rounded"
            rows={2}
            placeholder="Instructions for accessing this virtual exhibition"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="ve_featured"
              checked={formData.is_featured}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  is_featured: e.target.checked,
                }))
              }
              className="mr-2"
            />
            <label htmlFor="ve_featured" className="text-sm font-medium">
              Featured
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="ve_active"
              checked={formData.is_active}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  is_active: e.target.checked,
                }))
              }
              className="mr-2"
            />
            <label htmlFor="ve_active" className="text-sm font-medium">
              Active
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="ve_registration"
              checked={formData.requires_registration}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  requires_registration: e.target.checked,
                }))
              }
              className="mr-2"
            />
            <label htmlFor="ve_registration" className="text-sm font-medium">
              Requires Registration
            </label>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-primary text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Add Virtual Exhibition
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

function SectionForm({
  sectionType,
  section,
  museumId,
  onSubmit,
  onCancel,
}: {
  sectionType: string;
  section?: any;
  museumId: number;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    section_type: sectionType,
    title: section?.title || "",
    content: section?.content || [""],
    order: section?.order || 0,
    is_active: section?.is_active ?? true,
  });

  const sectionTypes = [
    { value: "overview", label: "Overview" },
    { value: "cultural-heritage", label: "Cultural Heritage" },
    { value: "natural-history", label: "Natural History" },
    { value: "history", label: "History" },
    { value: "exhibitions", label: "Exhibitions" },
    { value: "custom", label: "Custom Section" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      museum: museumId,
    });
  };

  const addParagraph = () => {
    setFormData((prev) => ({
      ...prev,
      content: [...prev.content, ""],
    }));
  };

  const updateParagraph = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      content: prev.content.map((p: string, i: number) =>
        i === index ? value : p
      ),
    }));
  };

  const removeParagraph = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      content: prev.content.filter((_: string, i: number) => i !== index),
    }));
  };

  return (
    <div className="bg-gray-50 border rounded-lg p-6 mt-6">
      <h4 className="text-lg font-semibold mb-4">
        {section ? "Edit" : "Add"}{" "}
        {sectionType.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}{" "}
        Section
      </h4>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Section Type
            </label>
            <select
              value={formData.section_type}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  section_type: e.target.value,
                }))
              }
              className="w-full p-2 border rounded"
              required
            >
              {sectionTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium">
              Content Paragraphs
            </label>
            <button
              type="button"
              onClick={addParagraph}
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              Add Paragraph
            </button>
          </div>
          {formData.content.map((paragraph: string, index: number) => (
            <div key={index} className="flex gap-2 mb-2">
              <textarea
                value={paragraph}
                onChange={(e) => updateParagraph(index, e.target.value)}
                className="flex-1 p-2 border rounded"
                rows={3}
                placeholder={`Paragraph ${index + 1}`}
              />
              {formData.content.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeParagraph(index)}
                  className="text-red-600 hover:bg-red-50 p-1 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Order</label>
            <input
              type="number"
              value={formData.order}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  order: parseInt(e.target.value),
                }))
              }
              className="w-full p-2 border rounded"
              min="0"
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  is_active: e.target.checked,
                }))
              }
              className="mr-2"
            />
            <label htmlFor="is_active" className="text-sm font-medium">
              Active
            </label>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-primary text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {section ? "Update" : "Create"} Section
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
