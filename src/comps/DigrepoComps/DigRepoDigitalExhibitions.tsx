import { useState } from "react";
import {
  Search,
  Filter,
  Calendar,
  MapPin,
  Clock,
  Eye,
  Star,
  Heart,
  Share2,
  BookOpen,
  Home,
  ArrowRight,
  Play,
} from "lucide-react";
import museumService, {
  type MuseumExhibition,
} from "../../services/museumService";
import { useApi } from "../../hooks/useApi";

// Define Exhibition type based on MuseumExhibition
type Exhibition = MuseumExhibition & {
  status: "active" | "upcoming" | "past";
  location: string;
  is_virtual: boolean;
  main_image: string;
};

// Helper function to determine exhibition status
const getExhibitionStatus = (
  startDate: string,
  endDate: string
): "active" | "upcoming" | "past" => {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (now < start) return "upcoming";
  if (now > end) return "past";
  return "active";
};

export default function DigitalExhibitionsGallery() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedExhibition, setSelectedExhibition] =
    useState<Exhibition | null>(null);

  // Fetch exhibitions
  const { data: exhibitionsData, loading: exhibitionsLoading } = useApi(() =>
    museumService.getExhibitions()
  );

  const exhibitions = (exhibitionsData?.results || []).map(
    (exhibition: MuseumExhibition) => ({
      ...exhibition,
      status: getExhibitionStatus(exhibition.start_date, exhibition.end_date),
      location: "Virtual Space", // Simplified location
      is_virtual: Math.random() > 0.5, // Simulate virtual exhibitions
      main_image: "/images/default-exhibition.jpg", // Default image
    })
  );

  // Exhibition statuses for filtering
  const exhibitionStatuses = ["All", "active", "upcoming", "past"];

  const filteredExhibitions = exhibitions.filter((exhibition: Exhibition) => {
    const matchesStatus =
      selectedStatus === "All" || exhibition.status === selectedStatus;
    const matchesSearch =
      exhibition.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exhibition.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (selectedExhibition) {
    return (
      <ExhibitionDetail
        exhibition={selectedExhibition}
        onBack={() => setSelectedExhibition(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 top-0 z-0">
        <div className="max-w-full md:max-w-10/12 mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center py-4 text-sm text-gray-500">
            <Home className="w-4 h-4 mr-2" />
            <span className="text-primary font-medium">Digital Repository</span>
            <ArrowRight className="w-4 h-4 mx-2" />
            <span className="text-primary font-medium">
              Digital Exhibitions
            </span>
          </div>

          {/* Main Header */}
          <div className="pb-6">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Digital Exhibitions
            </h1>

            {/* Search and Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search exhibitions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
                <Filter className="w-5 h-5 text-gray-400 flex-shrink-0" />
                {exhibitionStatuses.map((status) => (
                  <button
                    key={status}
                    onClick={() => setSelectedStatus(status)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                      selectedStatus === status
                        ? "bg-purple-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {status === "All"
                      ? "All"
                      : status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-full md:max-w-10/12 mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {exhibitionsLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            <span className="ml-3 text-gray-600">Loading exhibitions...</span>
          </div>
        ) : filteredExhibitions.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <BookOpen className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No exhibitions found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search terms or status filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredExhibitions.map((exhibition: Exhibition) => (
              <div
                key={exhibition.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
                onClick={() => setSelectedExhibition(exhibition)}
              >
                {/* Image */}
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={
                      exhibition.main_image || "/images/default-exhibition.jpg"
                    }
                    alt={exhibition.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Status Badge */}
                  <div className="absolute top-4 left-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        exhibition.status === "active"
                          ? "bg-green-500 text-white"
                          : exhibition.status === "upcoming"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-500 text-white"
                      }`}
                    >
                      {exhibition.status.charAt(0).toUpperCase() +
                        exhibition.status.slice(1)}
                    </span>
                  </div>

                  {/* Virtual Badge */}
                  {exhibition.is_virtual && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                        <Play className="w-3 h-3" />
                        Virtual
                      </span>
                    </div>
                  )}

                  {/* Quick Actions */}
                  <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors">
                      <Heart className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors">
                      <Share2 className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">
                    {exhibition.title}
                  </h3>

                  {/* Dates */}
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(exhibition.start_date).toLocaleDateString()}
                      </span>
                    </div>
                    <span>-</span>
                    <span>
                      {new Date(exhibition.end_date).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-1 text-sm text-gray-600 mb-4">
                    <MapPin className="w-4 h-4" />
                    <span>{exhibition.location}</span>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
                    {exhibition.description}
                  </p>

                  {/* Action Button */}
                  <button className="w-full bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
                    {exhibition.is_virtual ? (
                      <Play className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                    <span>
                      {exhibition.is_virtual ? "Virtual Tour" : "View Details"}
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Exhibition Detail Component
function ExhibitionDetail({
  exhibition,
  onBack,
}: {
  exhibition: Exhibition;
  onBack: () => void;
}) {
  const [currentSection, setCurrentSection] = useState("overview");

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-full md:max-w-10/12 mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              <span>Back to Exhibitions</span>
            </button>

            <div className="flex items-center gap-2">
              <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                <Heart className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-purple-600 transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <img
          src={exhibition.main_image || "/images/default-exhibition.jpg"}
          alt={exhibition.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        <div className="absolute bottom-8 left-0 right-0">
          <div className="max-w-full md:max-w-10/12 mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4 mb-4">
              <span
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  exhibition.status === "active"
                    ? "bg-green-500 text-white"
                    : exhibition.status === "upcoming"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-500 text-white"
                }`}
              >
                {exhibition.status.charAt(0).toUpperCase() +
                  exhibition.status.slice(1)}
              </span>

              {exhibition.is_virtual && (
                <span className="bg-purple-500 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                  <Play className="w-4 h-4" />
                  Virtual Exhibition
                </span>
              )}
            </div>

            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              {exhibition.title}
            </h1>

            <div className="flex items-center gap-6 text-white/90">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>
                  {new Date(exhibition.start_date).toLocaleDateString()} -{" "}
                  {new Date(exhibition.end_date).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span>{exhibition.location}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <div className="max-w-full md:max-w-10/12 mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {["overview", "timeline", "highlights"].map((section) => (
              <button
                key={section}
                onClick={() => setCurrentSection(section)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  currentSection === section
                    ? "border-purple-500 text-purple-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-full md:max-w-10/12 mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentSection === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                About This Exhibition
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                {exhibition.description}
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Exhibition Highlights
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Curated collection of digital artifacts</li>
                <li>• Interactive multimedia presentations</li>
                <li>• Virtual reality experiences</li>
                <li>• Educational resources and materials</li>
              </ul>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Exhibition Details
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Duration:</span>
                    <span className="font-medium">
                      {Math.ceil(
                        (new Date(exhibition.end_date).getTime() -
                          new Date(exhibition.start_date).getTime()) /
                          (1000 * 60 * 60 * 24)
                      )}{" "}
                      days
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Type:</span>
                    <span className="font-medium">
                      {exhibition.is_virtual ? "Virtual" : "Physical"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Status:</span>
                    <span
                      className={`font-medium ${
                        exhibition.status === "active"
                          ? "text-green-600"
                          : exhibition.status === "upcoming"
                          ? "text-blue-600"
                          : "text-gray-600"
                      }`}
                    >
                      {exhibition.status.charAt(0).toUpperCase() +
                        exhibition.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              {exhibition.is_virtual && (
                <button className="w-full bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
                  <Play className="w-5 h-5" />
                  Start Virtual Tour
                </button>
              )}
            </div>
          </div>
        )}

        {currentSection === "timeline" && (
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Exhibition Timeline
            </h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Exhibition Opens
                  </h3>
                  <p className="text-gray-600">
                    {new Date(exhibition.start_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Star className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Peak Period</h3>
                  <p className="text-gray-600">
                    Most interactive features available
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Exhibition Closes
                  </h3>
                  <p className="text-gray-600">
                    {new Date(exhibition.end_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentSection === "highlights" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Exhibition Highlights
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div
                  key={item}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                >
                  <div className="aspect-video bg-gray-100 flex items-center justify-center">
                    <Eye className="w-8 h-8 text-gray-400" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Featured Item {item}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      A significant piece from our digital collection showcasing
                      cultural heritage.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
