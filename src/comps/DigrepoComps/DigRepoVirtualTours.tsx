import { useState } from "react";
import {
  Search,
  Filter,
  Play,
  Eye,
  Users,
  Clock,
  Star,
  Share2,
  Bookmark,
  Home,
  ArrowRight,
  Navigation,
  Headphones,
  Camera,
} from "lucide-react";
import museumService, { type Museum } from "../../services/museumService";
import { useApi } from "../../hooks/useApi";

export default function VirtualToursGallery() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTour, setSelectedTour] = useState<Museum | null>(null);

  // Fetch museums with virtual tours
  const { data: museumsData, loading: museumsLoading } = useApi(() =>
    museumService.getMuseums({ ordering: "-view_count" })
  );

  const museums = museumsData?.results || [];

  // Filter museums that could have virtual tours (we'll simulate this)
  const virtualTours = museums
    .map((museum) => ({
      ...museum,
      has_virtual_tour: museum.virtual_tour_url ? true : Math.random() > 0.6, // Simulate some having virtual tours
      tour_duration: Math.floor(Math.random() * 45) + 15, // 15-60 minutes
      tour_type: Math.random() > 0.5 ? "360°" : "Guided",
      audio_guide: Math.random() > 0.4,
      rating: (Math.random() * 2 + 3).toFixed(1), // 3.0-5.0 rating
    }))
    .filter((museum) => museum.has_virtual_tour);

  // Categories for filtering (using museum categories)
  const categories = [
    "All",
    "Historical",
    "Cultural",
    "Memorial",
    "Art",
    "History",
  ];

  const filteredTours = virtualTours.filter((tour) => {
    const matchesCategory =
      selectedCategory === "All" || tour.category_name === selectedCategory;
    const matchesSearch =
      tour.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tour.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tour.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (selectedTour) {
    return (
      <VirtualTourViewer
        tour={selectedTour}
        onBack={() => setSelectedTour(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 top-0 z-0">
        <div className="max-w-full md:max-w-10/12 mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center py-4 text-sm text-gray-500">
            <Home className="w-4 h-4 mr-2" />
            <span className="text-primary font-medium">Digital Repository</span>
            <ArrowRight className="w-4 h-4 mx-2" />
            <span className="text-primary font-medium">Virtual Tours</span>
          </div>

          {/* Main Header */}
          <div className="pb-6">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Virtual Tours
            </h1>

            {/* Search and Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search virtual tours..."
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
        {museumsLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <span className="ml-3 text-gray-600">Loading virtual tours...</span>
          </div>
        ) : filteredTours.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Play className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No virtual tours found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search terms or category filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTours.map((tour) => (
              <div
                key={tour.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group"
                onClick={() => setSelectedTour(tour)}
              >
                {/* Thumbnail */}
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={tour.main_image}
                    alt={tour.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Play Overlay */}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Play className="w-8 h-8 text-primary ml-1" />
                    </div>
                  </div>

                  {/* Tour Type Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="bg-cyan-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {tour.tour_type} Tour
                    </span>
                  </div>

                  {/* Rating */}
                  <div className="absolute top-4 right-4 flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-full">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{tour.rating}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Category */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-primary">
                      {tour.category_name}
                    </span>
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded">
                      <Bookmark className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                    {tour.name}
                  </h3>

                  {/* Location */}
                  <p className="text-gray-600 mb-4 flex items-center gap-1">
                    <Navigation className="w-4 h-4" />
                    {tour.location}
                  </p>

                  {/* Description */}
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed line-clamp-2">
                    {tour.description}
                  </p>

                  {/* Tour Details */}
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{tour.tour_duration}min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{tour.view_count}</span>
                    </div>
                    {tour.audio_guide && (
                      <div className="flex items-center gap-1">
                        <Headphones className="w-4 h-4" />
                        <span>Audio</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <button className="bg-primary hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors text-sm">
                      <Play className="w-4 h-4" />
                      Start Tour
                    </button>

                    <div className="flex items-center gap-2">
                      <button className="p-2 text-gray-400 hover:text-primary transition-colors">
                        <Share2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-primary transition-colors">
                        <Users className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Virtual Tour Viewer Component
function VirtualTourViewer({
  tour,
  onBack,
}: {
  tour: any;
  onBack: () => void;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStop, setCurrentStop] = useState(1);
  const totalStops = 8;

  const tourStops = [
    {
      id: 1,
      name: "Main Entrance",
      description: "Welcome to the museum's grand entrance hall",
    },
    {
      id: 2,
      name: "Exhibition Hall A",
      description: "Discover our permanent collection",
    },
    {
      id: 3,
      name: "Cultural Gallery",
      description: "Traditional artifacts and displays",
    },
    {
      id: 4,
      name: "Interactive Zone",
      description: "Hands-on learning experiences",
    },
    {
      id: 5,
      name: "Heritage Room",
      description: "Historical documents and records",
    },
    {
      id: 6,
      name: "Art Gallery",
      description: "Contemporary and classical artworks",
    },
    {
      id: 7,
      name: "Memorial Section",
      description: "Remembrance and reflection space",
    },
    { id: 8, name: "Gift Shop", description: "Take home a piece of culture" },
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Tour Header */}
      <div className="relative z-10 bg-black/80 backdrop-blur-md border-b border-gray-700">
        <div className="max-w-full md:max-w-10/12 mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-white hover:text-cyan-400 transition-colors"
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
                <span>Exit Tour</span>
              </button>

              <div className="text-white">
                <h1 className="text-xl font-bold">{tour.name}</h1>
                <p className="text-sm text-gray-300">{tour.location}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-white text-sm">
                Stop {currentStop} of {totalStops}
              </div>

              <div className="flex items-center gap-2">
                <button className="p-2 text-white hover:text-cyan-400 transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
                <button className="p-2 text-white hover:text-cyan-400 transition-colors">
                  <Camera className="w-5 h-5" />
                </button>
                <button className="p-2 text-white hover:text-cyan-400 transition-colors">
                  <Headphones className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tour Display */}
      <div className="relative h-screen">
        {/* Tour Image/Video Placeholder */}
        <div className="absolute inset-0">
          <img
            src={tour.main_image}
            alt={`${tour.name} - Stop ${currentStop}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>

        {/* Tour Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="max-w-full md:max-w-10/12 mx-auto">
            {/* Current Stop Info */}
            <div className="bg-black/80 backdrop-blur-md rounded-lg p-6 mb-4">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {tourStops[currentStop - 1].name}
                  </h2>
                  <p className="text-gray-300 mb-4">
                    {tourStops[currentStop - 1].description}
                  </p>
                </div>

                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-12 h-12 bg-cyan-500 hover:bg-cyan-600 rounded-full flex items-center justify-center transition-colors"
                >
                  {isPlaying ? (
                    <div className="w-4 h-4 bg-white rounded-sm" />
                  ) : (
                    <Play className="w-6 h-6 text-white ml-1" />
                  )}
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="bg-black/60 backdrop-blur-md rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white text-sm font-medium">
                  Tour Progress
                </span>
                <span className="text-gray-300 text-sm">
                  {Math.round((currentStop / totalStops) * 100)}%
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentStop(Math.max(1, currentStop - 1))}
                  disabled={currentStop === 1}
                  className="p-2 text-white hover:text-cyan-400 disabled:text-gray-500 transition-colors"
                >
                  <ArrowRight className="w-4 h-4 rotate-180" />
                </button>

                <div className="flex-1 bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-cyan-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(currentStop / totalStops) * 100}%` }}
                  />
                </div>

                <button
                  onClick={() =>
                    setCurrentStop(Math.min(totalStops, currentStop + 1))
                  }
                  disabled={currentStop === totalStops}
                  className="p-2 text-white hover:text-cyan-400 disabled:text-gray-500 transition-colors"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Stop Navigation */}
              <div className="flex items-center justify-center gap-2 mt-4">
                {tourStops.map((stop) => (
                  <button
                    key={stop.id}
                    onClick={() => setCurrentStop(stop.id)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      currentStop === stop.id
                        ? "bg-cyan-500"
                        : currentStop > stop.id
                        ? "bg-cyan-300"
                        : "bg-gray-600"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
