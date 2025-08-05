import { useState } from "react";
import {
  Search,
  Filter,
  Clock,
  Calendar,
  User,
  Eye,
  Heart,
  Share2,
  Home,
  ArrowRight,
  Plus,
  TrendingUp,
  Bookmark,
  Grid3X3,
  List,
  ChevronDown,
  Upload,
  FileText,
  Image as ImageIcon,
  Film,
} from "lucide-react";
import { apiService } from "../../services/api";
import museumService from "../../services/museumService";
import { useApi } from "../../hooks/useApi";
import type { Artwork } from "../../types";

export default function RecentAdditionsGallery() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPeriod, setSelectedPeriod] = useState("All Time");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("newest");

  // Fetch recent artworks
  const { data: artworksData, loading: artworksLoading } = useApi(() =>
    apiService.getArtworks()
  );

  // Fetch recent museums
  const { data: museumsData, loading: museumsLoading } = useApi(() =>
    museumService.getMuseums()
  );

  const artworks = artworksData?.results || [];
  const museums = museumsData?.results || [];

  // Combine and simulate recent additions
  const recentArtworks = artworks.map((artwork: Artwork) => ({
    ...artwork,
    type: "artwork" as const,
    artist_name: artwork.artist_display, // Map to consistent field
    main_image: artwork.image, // Map to consistent field
    added_date: new Date(
      Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
    ).toISOString(),
    contributor: "Museum Curator",
    status: Math.random() > 0.8 ? "processing" : "published",
    trending: Math.random() > 0.7,
  }));

  const recentMuseums = museums.slice(0, 5).map((museum: any) => ({
    ...museum,
    type: "museum" as const,
    title: museum.name,
    artist_name: "Institution",
    main_image: museum.main_image || museum.main_image,
    description: museum.description,
    added_date: new Date(
      Date.now() - Math.random() * 20 * 24 * 60 * 60 * 1000
    ).toISOString(),
    contributor: "Digital Heritage Team",
    status: "published" as const,
    trending: Math.random() > 0.8,
  }));

  const allRecentItems = [...recentArtworks, ...recentMuseums].sort(
    (a, b) =>
      new Date(b.added_date).getTime() - new Date(a.added_date).getTime()
  );

  // Filter options
  const categories = ["All", "Artworks", "Museums", "Documents", "Exhibitions"];
  const periods = [
    "All Time",
    "Today",
    "This Week",
    "This Month",
    "Last 3 Months",
  ];
  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "trending", label: "Trending" },
    { value: "views", label: "Most Viewed" },
  ];

  const filteredItems = allRecentItems.filter((item) => {
    const matchesCategory =
      selectedCategory === "All" ||
      (selectedCategory === "Artworks" && item.type === "artwork") ||
      (selectedCategory === "Museums" && item.type === "museum");

    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.artist_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());

    const itemDate = new Date(item.added_date);
    const now = new Date();
    let matchesPeriod = true;

    if (selectedPeriod === "Today") {
      matchesPeriod = itemDate.toDateString() === now.toDateString();
    } else if (selectedPeriod === "This Week") {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      matchesPeriod = itemDate >= weekAgo;
    } else if (selectedPeriod === "This Month") {
      matchesPeriod =
        itemDate.getMonth() === now.getMonth() &&
        itemDate.getFullYear() === now.getFullYear();
    } else if (selectedPeriod === "Last 3 Months") {
      const threeMonthsAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      matchesPeriod = itemDate >= threeMonthsAgo;
    }

    return matchesCategory && matchesSearch && matchesPeriod;
  });

  // Sort filtered items
  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case "oldest":
        return (
          new Date(a.added_date).getTime() - new Date(b.added_date).getTime()
        );
      case "trending":
        return (b.trending ? 1 : 0) - (a.trending ? 1 : 0);
      case "views":
        return b.view_count - a.view_count;
      default:
        return (
          new Date(b.added_date).getTime() - new Date(a.added_date).getTime()
        );
    }
  });

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} hours ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)} days ago`;
    }
  };

  const getItemIcon = (type: string, status: string) => {
    if (status === "processing") return Upload;
    switch (type) {
      case "artwork":
        return ImageIcon;
      case "museum":
        return FileText;
      case "exhibition":
        return Film;
      default:
        return Plus;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 top-0 z-0">
        <div className="max-w-full md:max-w-10/12 mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center py-4 text-sm text-gray-500">
            <Home className="w-4 h-4 mr-2" />
            <span className="text-primary font-medium">Digital Repository</span>
            <ArrowRight className="w-4 h-4 mx-2" />
            <span className="text-primary font-medium">Recent Additions</span>
          </div>

          {/* Main Header */}
          <div className="pb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  Recent Additions
                </h1>
                <p className="text-gray-600">
                  Discover the latest cultural artifacts added to our collection
                </p>
              </div>

              {/* View Controls */}
              <div className="flex items-center gap-4">
                {/* Sort Dropdown */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === "grid"
                        ? "bg-white text-emerald-600 shadow-sm"
                        : "text-gray-500"
                    }`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === "list"
                        ? "bg-white text-emerald-600 shadow-sm"
                        : "text-gray-500"
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center mt-6">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search recent additions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-4 lg:gap-6">
                {/* Category Filter */}
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                          selectedCategory === category
                            ? "bg-emerald-500 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Period Filter */}
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
                    {periods.map((period) => (
                      <button
                        key={period}
                        onClick={() => setSelectedPeriod(period)}
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                          selectedPeriod === period
                            ? "bg-emerald-500 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {period}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-full md:max-w-10/12 mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {artworksLoading || museumsLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
            <span className="ml-3 text-gray-600">
              Loading recent additions...
            </span>
          </div>
        ) : sortedItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Plus className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No recent additions found
            </h3>
            <p className="text-gray-500">
              Try adjusting your filters or search terms.
            </p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedItems.map((item) => {
              const ItemIcon = getItemIcon(item.type, item.status);
              return (
                <div
                  key={`${item.type}-${item.id}`}
                  className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group"
                >
                  {/* Image */}
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={item.main_image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Status Badge */}
                    <div className="absolute top-4 left-4">
                      <div
                        className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${
                          item.status === "processing"
                            ? "bg-yellow-500 text-white"
                            : "bg-emerald-500 text-white"
                        }`}
                      >
                        <ItemIcon className="w-3 h-3" />
                        {item.status === "processing" ? "Processing" : "New"}
                      </div>
                    </div>

                    {/* Trending Badge */}
                    {item.trending && (
                      <div className="absolute top-4 right-4">
                        <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          Trending
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
                    {/* Time and Type */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>{formatRelativeTime(item.added_date)}</span>
                      </div>
                      <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded">
                        <Bookmark className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                      {item.title}
                    </h3>

                    {/* Creator/Artist */}
                    <p className="text-gray-600 mb-2 flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {item.artist_name}
                    </p>

                    {/* Contributor */}
                    <p className="text-sm text-gray-500 mb-4">
                      Added by {item.contributor}
                    </p>

                    {/* Description */}
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
                      {item.description}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{item.view_count}</span>
                      </div>
                      <span className="text-xs font-medium text-emerald-600 uppercase tracking-wide">
                        {item.type}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          // List View
          <div className="space-y-4">
            {sortedItems.map((item) => {
              const ItemIcon = getItemIcon(item.type, item.status);
              return (
                <div
                  key={`${item.type}-${item.id}`}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300"
                >
                  <div className="flex flex-col sm:flex-row">
                    {/* Image */}
                    <div className="w-full sm:w-48 h-32 relative overflow-hidden">
                      <img
                        src={item.main_image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />

                      {/* Status Badge */}
                      <div className="absolute top-2 left-2">
                        <div
                          className={`px-2 py-1 rounded text-xs font-medium flex items-center gap-1 ${
                            item.status === "processing"
                              ? "bg-yellow-500 text-white"
                              : "bg-emerald-500 text-white"
                          }`}
                        >
                          <ItemIcon className="w-3 h-3" />
                          {item.status === "processing" ? "Processing" : "New"}
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-bold text-gray-900">
                              {item.title}
                            </h3>
                            {item.trending && (
                              <div className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" />
                                Trending
                              </div>
                            )}
                          </div>

                          <p className="text-gray-600 mb-2 flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {item.artist_name}
                          </p>

                          <p className="text-sm text-gray-500 mb-3">
                            Added by {item.contributor} •{" "}
                            {formatRelativeTime(item.added_date)}
                          </p>

                          <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                            {item.description}
                          </p>
                        </div>

                        <div className="text-right ml-4">
                          <div className="text-xs font-medium text-emerald-600 uppercase tracking-wide mb-2">
                            {item.type}
                          </div>

                          <div className="text-sm text-gray-500 mb-2">
                            {item.view_count} views
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
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
