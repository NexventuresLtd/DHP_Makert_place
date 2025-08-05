import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Grid3X3,
  List,
  Heart,
  Share2,
  Eye,
  Calendar,
  User,
  Home,
  ArrowRight,
} from "lucide-react";
import { apiService } from "../../services/api";
import { useApi } from "../../hooks/useApi";
import type { Collection, Artwork } from "../../types";

export default function ArtCollectionsGallery() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCollection, setSelectedCollection] =
    useState<Collection | null>(null);

  // Fetch collections
  const { data: collectionsData, loading: collectionsLoading } = useApi(() =>
    apiService.getCollections()
  );

  const collections = collectionsData?.results || [];

  // Collection types for filtering
  const collectionTypes = [
    "All",
    "gallery",
    "museum",
    "library",
    "archive",
    "digital",
  ];

  const filteredCollections = collections.filter((collection) => {
    const matchesType =
      selectedType === "All" || collection.collection_type === selectedType;
    const matchesSearch =
      collection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      collection.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  if (selectedCollection) {
    return (
      <CollectionDetailView
        collection={selectedCollection}
        onBack={() => setSelectedCollection(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 top-0 z-0">
        <div className="max-w-full md:max-w-10/12 mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center py-4 text-sm text-gray-500">
            <Home className="w-4 h-4 mr-2" />
            <span className="text-primary font-medium">Digital Repository</span>
            <ArrowRight className="w-4 h-4 mx-2" />
            <span className="text-primary font-medium">Art Collections</span>
          </div>

          {/* Main Header */}
          <div className="pb-6">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Art Collections
            </h1>

            {/* Search and Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center flex-1">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search collections..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Type Filter */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
                  <Filter className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  {collectionTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedType(type)}
                      className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors capitalize ${
                        selectedType === type
                          ? "bg-primary text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === "grid"
                      ? "bg-white text-primary shadow-sm"
                      : "text-gray-600"
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === "list"
                      ? "bg-white text-primary shadow-sm"
                      : "text-gray-600"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-full md:max-w-10/12 mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {collectionsLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <span className="ml-3 text-gray-600">Loading collections...</span>
          </div>
        ) : filteredCollections.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No collections found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search terms or filters.
            </p>
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                : "space-y-6"
            }
          >
            {filteredCollections.map((collection) => (
              <div
                key={collection.id}
                className={`bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group ${
                  viewMode === "list" ? "flex" : ""
                }`}
                onClick={() => setSelectedCollection(collection)}
              >
                {/* Image Section */}
                <div
                  className={`relative overflow-hidden ${
                    viewMode === "list" ? "w-1/3" : "h-64"
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <Grid3X3 className="w-12 h-12 mx-auto mb-2 opacity-80" />
                      <p className="text-sm font-medium opacity-90 capitalize">
                        {collection.collection_type} Collection
                      </p>
                    </div>
                  </div>
                  {collection.is_featured && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Featured
                      </span>
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className={`p-6 ${viewMode === "list" ? "flex-1" : ""}`}>
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">
                      {collection.name}
                    </h3>
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-gray-100 rounded-full">
                      <Heart className="w-5 h-5 text-gray-400 hover:text-red-500" />
                    </button>
                  </div>

                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {collection.description}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>Curator</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(collection.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:text-primary transition-colors">
                        <Eye className="w-4 h-4" />
                        <span>View</span>
                      </button>
                      <button className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:text-primary transition-colors">
                        <Share2 className="w-4 h-4" />
                        <span>Share</span>
                      </button>
                    </div>
                    <span className="text-xs text-gray-400 capitalize">
                      {collection.collection_type}
                    </span>
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

// Collection Detail View Component
function CollectionDetailView({
  collection,
  onBack,
}: {
  collection: Collection;
  onBack: () => void;
}) {
  const [collectionArtworks, setCollectionArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollectionArtworks = async () => {
      try {
        setLoading(true);
        // Since we don't have a direct collection artworks endpoint,
        // we'll fetch recent artworks as placeholder
        const artworks = await apiService.getRecentArtworks();
        setCollectionArtworks(artworks.slice(0, 8)); // Show first 8
      } catch (error) {
        console.error("Error fetching collection artworks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCollectionArtworks();
  }, [collection.id]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 top-0 z-0">
        <div className="max-w-full md:max-w-10/12 mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors mb-4"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            <span>Back to Collections</span>
          </button>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                {collection.name}
              </h1>
              <p className="text-gray-600 max-w-2xl">
                {collection.description}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Eye className="w-4 h-4" />
                <span>View All</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Collection Content */}
      <div className="max-w-full md:max-w-10/12 mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <span className="ml-3 text-gray-600">
              Loading collection items...
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {collectionArtworks.map((artwork) => (
              <div
                key={artwork.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                <div className="aspect-square relative overflow-hidden">
                  <img
                    src={artwork.image}
                    alt={artwork.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                    {artwork.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {artwork.artist_display}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="capitalize">{artwork.artwork_type}</span>
                    <span>{artwork.year_created}</span>
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
