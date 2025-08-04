import { useState, useEffect } from "react";
import { Search, BookOpen, User, Calendar, Eye, Plus } from "lucide-react";
import { libraryApiService } from "../../services/libraryApi";
import type { LibraryCollection } from "../../types/libraryTypes";

export default function LibraryCollections() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCollectionType, setSelectedCollectionType] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [collections, setCollections] = useState<LibraryCollection[]>([]);
  const [collectionsLoading, setCollectionsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  // Fetch collections
  useEffect(() => {
    const fetchCollections = async () => {
      setCollectionsLoading(true);
      try {
        const params: any = {
          page: currentPage,
          search: searchTerm || undefined,
          collection_type:
            selectedCollectionType !== "All"
              ? selectedCollectionType
              : undefined,
          ordering: "-created_at",
        };

        const response = await libraryApiService.getCollections(params);
        if (currentPage === 1) {
          setCollections(response.results);
        } else {
          setCollections((prev) => [...prev, ...response.results]);
        }
        setTotalCount(response.count);
        setHasMore(!!response.next);
      } catch (error) {
        console.error("Failed to fetch collections:", error);
      } finally {
        setCollectionsLoading(false);
      }
    };

    fetchCollections();
  }, [currentPage, searchTerm, selectedCollectionType]);

  const loadMore = () => {
    if (hasMore && !collectionsLoading) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const collectionTypes = [
    { value: "All", label: "All Types" },
    { value: "curated", label: "Curated Collection" },
    { value: "series", label: "Book Series" },
    { value: "conference", label: "Conference Proceedings" },
    { value: "journal", label: "Journal Issue" },
    { value: "special", label: "Special Collection" },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Document Collections
          </h2>
          <p className="text-gray-600">
            Curated collections of documents organized by theme, series, or
            topic
          </p>
        </div>
        <button className="mt-4 sm:mt-0 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-colors inline-flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Collection
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Collections
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search collections..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Collection Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Collection Type
            </label>
            <select
              value={selectedCollectionType}
              onChange={(e) => setSelectedCollectionType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              {collectionTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-gray-600">
          Showing {collections.length} of {totalCount} collections
        </p>
      </div>

      {/* Collections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections.map((collection) => (
          <div
            key={collection.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* Collection Header */}
            <div className="bg-gradient-to-r from-green-500 to-green-700 p-6">
              <div className="flex items-center justify-center h-16">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
            </div>

            {/* Collection Info */}
            <div className="p-6">
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                {collection.name}
              </h3>

              {/* Collection Type Badge */}
              <div className="mb-3">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {collection.collection_type
                    .replace("_", " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </span>
                {collection.is_featured && (
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Featured
                  </span>
                )}
              </div>

              {/* Description */}
              {collection.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {collection.description}
                </p>
              )}

              {/* Meta Info */}
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Curated by {collection.curator_name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {new Date(collection.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span>{collection.document_count} documents</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button className="flex-1 bg-green-500 hover:bg-green-600 text-white text-sm py-2 px-3 rounded-lg transition-colors">
                  View Collection
                </button>
                <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-lg transition-colors">
                  <Eye className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {collections.length === 0 && !collectionsLoading && (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No collections found
          </h3>
          <p className="text-gray-500 mb-6">
            Try adjusting your search criteria or create a new collection.
          </p>
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-colors">
            Create First Collection
          </button>
        </div>
      )}

      {/* Load More */}
      {hasMore && (
        <div className="mt-8 text-center">
          <button
            onClick={loadMore}
            disabled={collectionsLoading}
            className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center gap-2"
          >
            {collectionsLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Loading...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Load More Collections
              </>
            )}
          </button>
        </div>
      )}

      {/* Loading State */}
      {collectionsLoading && collections.length === 0 && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      )}
    </div>
  );
}
