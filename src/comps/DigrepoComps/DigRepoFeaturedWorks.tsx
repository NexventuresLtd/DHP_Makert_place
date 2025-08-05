import { useState } from "react";
import {
  Search,
  Filter,
  Heart,
  Share2,
  Eye,
  Star,
  Calendar,
  User,
  Home,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Play,
  Download,
  Info,
  Award,
  Bookmark,
  Grid3X3,
  List,
} from "lucide-react";
import { apiService } from "../../services/api";
// import museumService from "../../services/museumService";
import { useApi } from "../../hooks/useApi";
import type { Artwork } from "../../types";

export default function FeaturedWorksGallery() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedWork, setSelectedWork] = useState<Artwork | null>(null);

  // Fetch featured artworks (highest rated/viewed)
  const { data: artworksData, loading: artworksLoading } = useApi(() =>
    apiService.getArtworks()
  );

  // Fetch museums for additional context (if needed for future features)
  // const { data: museumsData } = useApi(() =>
  //   museumService.getMuseums()
  // );

  const artworks = artworksData?.results || [];

  // Featured works are top-rated/viewed artworks
  const featuredWorks = artworks
    .map((artwork: Artwork) => ({
      ...artwork,
      is_featured: artwork.view_count > 50 || Math.random() > 0.4, // Simulate featured status
      featured_since: new Date(
        Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
      )
        .toISOString()
        .split("T")[0],
      rating: (Math.random() * 2 + 3).toFixed(1), // 3.0-5.0 rating
      awards:
        Math.random() > 0.7
          ? ["Editor's Choice", "Most Viewed"][Math.floor(Math.random() * 2)]
          : null,
    }))
    .filter((work) => work.is_featured);

  // Categories for filtering
  const categories = [
    "All",
    "Paintings",
    "Sculptures",
    "Photography",
    "Digital Art",
    "Historical",
    "Contemporary",
  ];

  const filteredWorks = featuredWorks.filter((work) => {
    const matchesCategory =
      selectedCategory === "All" ||
      work.medium?.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      work.collection_name
        ?.toLowerCase()
        .includes(selectedCategory.toLowerCase());
    const matchesSearch =
      work.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      work.artist_display.toLowerCase().includes(searchTerm.toLowerCase()) ||
      work.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (selectedWork) {
    return (
      <FeaturedWorkDetail
        work={selectedWork}
        onBack={() => setSelectedWork(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-yellow-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 top-0 z-0">
        <div className="max-w-full md:max-w-10/12 mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center py-4 text-sm text-gray-500">
            <Home className="w-4 h-4 mr-2" />
            <span className="text-primary font-medium">Digital Repository</span>
            <ArrowRight className="w-4 h-4 mx-2" />
            <span className="text-primary font-medium">Featured Works</span>
          </div>

          {/* Main Header */}
          <div className="pb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  Featured Works
                </h1>
                <p className="text-gray-600">
                  Discover our most celebrated and popular cultural artifacts
                </p>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "grid"
                      ? "bg-white text-primary shadow-sm"
                      : "text-gray-500"
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "list"
                      ? "bg-white text-primary shadow-sm"
                      : "text-gray-500"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center mt-6">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search featured works..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
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
                        ? "bg-amber-500 text-white"
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
        {artworksLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
            <span className="ml-3 text-gray-600">
              Loading featured works...
            </span>
          </div>
        ) : filteredWorks.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Star className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No featured works found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search terms or category filter.
            </p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredWorks.map((work) => (
              <div
                key={work.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
                onClick={() => setSelectedWork(work)}
              >
                {/* Image */}
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={work.image}
                    alt={work.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Featured Badge */}
                  <div className="absolute top-4 left-4">
                    <div className="bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current" />
                      Featured
                    </div>
                  </div>

                  {/* Award Badge */}
                  {work.awards && (
                    <div className="absolute top-4 right-4">
                      <div className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                        <Award className="w-3 h-3" />
                        {work.awards}
                      </div>
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
                  {/* Rating */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium text-gray-700">
                        {work.rating}
                      </span>
                    </div>
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded">
                      <Bookmark className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-amber-600 transition-colors">
                    {work.title}
                  </h3>

                  {/* Artist */}
                  <p className="text-gray-600 mb-2 flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {work.artist_display}
                  </p>

                  {/* Collection */}
                  <p className="text-sm text-gray-500 mb-4">
                    {work.collection_name} • {work.medium}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{work.view_count}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Featured since {work.featured_since}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                    {work.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // List View
          <div className="space-y-6">
            {filteredWorks.map((work) => (
              <div
                key={work.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedWork(work)}
              >
                <div className="flex flex-col sm:flex-row">
                  {/* Image */}
                  <div className="w-full sm:w-64 h-48 sm:h-32 relative overflow-hidden">
                    <img
                      src={work.image}
                      alt={work.title}
                      className="w-full h-full object-cover"
                    />

                    {/* Featured Badge */}
                    <div className="absolute top-2 left-2">
                      <div className="bg-amber-500 text-white px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                        <Star className="w-3 h-3 fill-current" />
                        Featured
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-bold text-gray-900">
                            {work.title}
                          </h3>
                          {work.awards && (
                            <div className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                              <Award className="w-3 h-3" />
                              {work.awards}
                            </div>
                          )}
                        </div>

                        <p className="text-gray-600 mb-2 flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {work.artist_display}
                        </p>

                        <p className="text-sm text-gray-500 mb-3">
                          {work.collection_name} • {work.medium}
                        </p>

                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                          {work.description}
                        </p>
                      </div>

                      <div className="text-right ml-4">
                        <div className="flex items-center gap-1 mb-2">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium text-gray-700">
                            {work.rating}
                          </span>
                        </div>

                        <div className="text-sm text-gray-500 mb-2">
                          {work.view_count} views
                        </div>

                        <div className="flex items-center gap-2">
                          <button className="p-1 text-gray-400 hover:text-red-500 transition-colors">
                            <Heart className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-primary transition-colors">
                            <Share2 className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-primary transition-colors">
                            <Bookmark className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
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

// Featured Work Detail Component
function FeaturedWorkDetail({
  work,
  onBack,
}: {
  work: any;
  onBack: () => void;
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  // Simulate multiple images
  const images = [work.image, work.image, work.image];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-full md:max-w-10/12 mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              <span>Back to Featured Works</span>
            </button>

            <div className="flex items-center gap-2">
              <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                <Heart className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-primary transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-primary transition-colors">
                <Download className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-primary transition-colors">
                <Bookmark className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-full md:max-w-10/12 mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100">
              <img
                src={images[currentImageIndex]}
                alt={work.title}
                className={`w-full h-full object-cover cursor-zoom-in transition-transform duration-300 ${
                  isZoomed ? "scale-150" : "scale-100"
                }`}
                onClick={() => setIsZoomed(!isZoomed)}
              />

              {/* Featured Badge */}
              <div className="absolute top-4 left-4">
                <div className="bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                  <Star className="w-4 h-4 fill-current" />
                  Featured Work
                </div>
              </div>

              {/* Award Badge */}
              {work.awards && (
                <div className="absolute top-4 right-4">
                  <div className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    <Award className="w-4 h-4" />
                    {work.awards}
                  </div>
                </div>
              )}

              {/* Navigation */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setCurrentImageIndex(
                        (prev) => (prev - 1 + images.length) % images.length
                      )
                    }
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() =>
                      setCurrentImageIndex((prev) => (prev + 1) % images.length)
                    }
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="flex gap-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      currentImageIndex === index
                        ? "border-amber-500"
                        : "border-gray-200"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${work.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Work Details */}
          <div className="space-y-6">
            {/* Title and Rating */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="text-lg font-medium text-gray-700">
                  {work.rating}
                </span>
                <span className="text-gray-500">• {work.view_count} views</span>
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                {work.title}
              </h1>

              <div className="flex items-center gap-4 text-gray-600">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  <span className="font-medium">{work.artist_name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>Featured since {work.featured_since}</span>
                </div>
              </div>
            </div>

            {/* Collection Info */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-3">
                Collection Details
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Collection:</span>
                  <span className="font-medium">{work.collection_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Medium:</span>
                  <span className="font-medium">{work.medium}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Period:</span>
                  <span className="font-medium">
                    {work.period || "Contemporary"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Status:</span>
                  <span className="font-medium text-green-600">Available</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">
                About This Work
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {work.description}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button className="flex-1 bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
                <Play className="w-5 h-5" />
                Virtual View
              </button>
              <button className="flex-1 border border-gray-300 hover:border-gray-400 text-gray-700 px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
                <Info className="w-5 h-5" />
                More Info
              </button>
            </div>

            {/* Additional Info */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <Star className="w-5 h-5 text-amber-600" />
                <h3 className="font-semibold text-amber-900">
                  Why This Work is Featured
                </h3>
              </div>
              <p className="text-amber-800 text-sm leading-relaxed">
                This exceptional piece has been selected for our featured
                collection due to its historical significance, artistic
                excellence, and popular appeal among our visitors. It represents
                a pinnacle of cultural heritage that continues to inspire and
                educate audiences worldwide.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
