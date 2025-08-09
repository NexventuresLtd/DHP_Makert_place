import { useState, useEffect, useMemo } from "react";
import {
  Search,
  Edit,
  Trash2,
  Home,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { apiService } from "../../services/api";
import { useApi } from "../../hooks/useApi";
import type { Artwork } from "../../types";
import UploadArtworkModal from "./UploadArtworkModal";
import EditArtworkModal from "./EditArtworkModal";
import ArtworkDetailModal from "./ArtworkDetailModal";
import { getUserInfo } from "../../app/Localstorage";

export default function PaintingsGallery() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPaintings, setSelectedPaintings] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingArtwork, setEditingArtwork] = useState<Artwork | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [detailArtwork, setDetailArtwork] = useState<Artwork | null>(null);

  // Get user info
  const userInfo = getUserInfo;
  const currentUserId = userInfo?.id;

  // Fetch categories
  const { data: categories, loading: categoriesLoading } = useApi(() =>
    apiService.getCategories()
  );

  // Fetch artworks with search and filter
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [artworksLoading, setArtworksLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    const fetchArtworks = async () => {
      setArtworksLoading(true);
      try {
        const params: any = {
          page: currentPage,
          search: searchTerm || undefined,
          category: selectedCategory !== "All" ? selectedCategory : undefined,
          ordering: "-created_at",
        };

        const response = await apiService.getArtworks(params);
        if (currentPage === 1) {
          setArtworks(response.results);
        } else {
          setArtworks((prev) => [...prev, ...response.results]);
        }

        setTotalCount(response.count);
        setHasMore(!!response.next);
      } catch (error) {
        console.error("Failed to fetch artworks:", error);
      } finally {
        setArtworksLoading(false);
      }
    };

    fetchArtworks();
  }, [searchTerm, selectedCategory, currentPage]);

  // Reset page when search/filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  const categoryOptions = useMemo(() => {
    if (!categories || categories.count === 0) return ["All"];
    return ["All", ...categories.results.map((cat) => cat.name)];
  }, [categories]);

  const togglePaintingSelection = (id: number) => {
    setSelectedPaintings((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  // Check if user can edit/delete artwork
  const canModifyArtwork = (artwork: Artwork) => {
    console.log(userInfo?.type, userInfo);
    return userInfo?.type === "admin" || artwork.uploaded_by_name === `${userInfo?.first_name} ${userInfo?.last_name}`;
  };

  // Get artworks that user can modify from selected ones
  const getModifiableSelectedArtworks = () => {
    return artworks.filter(
      (artwork) =>
        selectedPaintings.includes(artwork.id) && canModifyArtwork(artwork)
    );
  };

  const handleBulkEdit = () => {
    const modifiableArtworks = getModifiableSelectedArtworks();

    if (modifiableArtworks.length === 0) {
      alert("You don't have permission to edit any of the selected artworks.");
      return;
    }

    if (modifiableArtworks.length > 1) {
      alert("Please select only one artwork to edit at a time.");
      return;
    }

    setEditingArtwork(modifiableArtworks[0]);
    setIsEditModalOpen(true);
  };

  const handleBulkDelete = async () => {
    const modifiableArtworks = getModifiableSelectedArtworks();

    if (modifiableArtworks.length === 0) {
      alert(
        "You don't have permission to delete any of the selected artworks."
      );
      return;
    }

    const artworkTitles = modifiableArtworks.map((a) => a.title).join(", ");
    const confirmMessage =
      modifiableArtworks.length === 1
        ? `Are you sure you want to delete "${artworkTitles}"? This action cannot be undone.`
        : `Are you sure you want to delete ${modifiableArtworks.length} artworks (${artworkTitles})? This action cannot be undone.`;

    if (!confirm(confirmMessage)) {
      return;
    }

    setIsDeleting(true);
    try {
      const slugs = modifiableArtworks.map((artwork) => artwork.slug);
      await apiService.bulkDeleteArtworks(slugs);

      // Remove deleted artworks from state
      setArtworks((prev) =>
        prev.filter((artwork) => !slugs.includes(artwork.slug))
      );
      setSelectedPaintings([]);

      alert(`Successfully deleted ${modifiableArtworks.length} artwork(s).`);
    } catch (error: any) {
      console.error("Bulk delete failed:", error);
      alert(error.message || "Failed to delete artworks. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBulkAction = (action: string) => {
    switch (action) {
      case "edit":
        handleBulkEdit();
        break;
      case "delete":
        handleBulkDelete();
        break;
      default:
        console.log(`${action} paintings:`, selectedPaintings);
        setSelectedPaintings([]);
    }
  };

  const loadMore = () => {
    if (hasMore && !artworksLoading) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handleUploadSuccess = () => {
    // Refresh the artworks list by resetting to page 1
    setCurrentPage(1);
    setArtworks([]);
    // This will trigger the useEffect to fetch fresh data
  };

  const handleEditSuccess = (updatedArtwork: Artwork) => {
    // Update the artwork in the current state
    setArtworks((prev) =>
      prev.map((artwork) =>
        artwork.id === updatedArtwork.id ? updatedArtwork : artwork
      )
    );
    setSelectedPaintings([]);
    setEditingArtwork(null);
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setEditingArtwork(null);
  };

  const handleArtworkClick = (artwork: Artwork) => {
    setDetailArtwork(artwork);
    setIsDetailModalOpen(true);
  };

  const handleDetailModalClose = () => {
    setIsDetailModalOpen(false);
    setDetailArtwork(null);
  };

  const handleViewIncrement = (updatedArtwork: Artwork) => {
    // Update the view count in the artworks list
    setArtworks((prev) =>
      prev.map((artwork) =>
        artwork.id === updatedArtwork.id ? updatedArtwork : artwork
      )
    );
  };

  if (categoriesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-full md:max-w-11/12 mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center py-3 text-sm text-gray-500">
            <Home className="w-4 h-4 mr-2" />
            <span className="hover:text-gray-700 cursor-pointer">
              Rwanda Culture
            </span>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="text-gray-900 font-medium">Art Gallery</span>
          </div>

          {/* Main Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-4 sm:mb-0">
                Rwanda Cultural Heritage
              </h1>
              <p className="text-gray-600">
                Explore the rich artistic traditions of Rwanda
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
              {/* Search */}
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search cultural artworks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full outline-none sm:w-80 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              {(getUserInfo?.type === "creator" ||
                getUserInfo?.type === "admin") && (
                <button
                  onClick={() => setIsUploadModalOpen(true)}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Upload
                </button>
              )}
            </div>
          </div>

          {/* Action Bar */}
          {selectedPaintings.length > 0 && (
            <div className="flex items-center justify-between py-3 px-4 bg-blue-50 border border-blue-200 rounded-lg mb-4">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-blue-900">
                  {selectedPaintings.length} item
                  {selectedPaintings.length > 1 ? "s" : ""} selected
                </span>
                {(() => {
                  const modifiableCount =
                    getModifiableSelectedArtworks().length;
                  const totalSelected = selectedPaintings.length;
                  if (modifiableCount < totalSelected && modifiableCount > 0) {
                    return (
                      <span className="text-xs text-blue-700">
                        {modifiableCount} can be modified
                      </span>
                    );
                  }
                  return null;
                })()}
              </div>
              <div className="flex items-center gap-2">
                {getModifiableSelectedArtworks().length > 0 && (
                  <>
                    <button
                      onClick={() => handleBulkAction("delete")}
                      disabled={isDeleting}
                      className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isDeleting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                      {isDeleting ? "Deleting..." : "Delete"}
                    </button>
                    <button
                      onClick={() => handleBulkAction("edit")}
                      className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-700 hover:bg-gray-100 rounded"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                  </>
                )}
                {/* <button
                  onClick={() => handleBulkAction("download")}
                  className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-700 hover:bg-gray-100 rounded"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
                <button
                  onClick={() => handleBulkAction("share")}
                  className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-700 hover:bg-gray-100 rounded"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button> */}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-full md:max-w-11/12 mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
              <nav className="space-y-2">
                {categoryOptions.map((category) => {
                  const categoryData = categories?.results.find(
                    (cat) => cat.name === category
                  );
                  const categoryCount =
                    category === "All"
                      ? totalCount
                      : categoryData?.artwork_count || 0;

                  return (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-between ${
                        selectedCategory === category
                          ? "bg-orange-100 text-orange-700"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      <span>{category}</span>
                      <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                        {categoryCount}
                      </span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results count */}
            <div className="mb-6">
              <p className="text-sm text-gray-600">
                Showing {artworks.length} of {totalCount} artworks
                {selectedCategory !== "All" && (
                  <span className="ml-1">in "{selectedCategory}"</span>
                )}
              </p>
            </div>

            {artworks.length === 0 && !artworksLoading ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No artworks found
                </h3>
                <p className="text-gray-500">
                  Try adjusting your search terms or browse different
                  categories.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("All");
                  }}
                  className="mt-4 text-orange-600 hover:text-orange-700 font-medium"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {artworks.map((artwork) => (
                    <div
                      key={artwork.id}
                      className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => handleArtworkClick(artwork)}
                    >
                      <div className="relative">
                        <img
                          src={artwork.image || artwork.thumbnail}
                          alt={artwork.title}
                          className="w-full h-64 object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src =
                              "https://www.svgrepo.com/show/508699/landscape-placeholder.svg";
                          }}
                        />

                        {/* Selection Overlay */}
                        <div className="absolute inset-0 bg-black/20 bg-opacity-0 group-hover:bg-opacity-20 transition-all">
                          {/* Only show checkbox if user can modify this artwork */}
                          {canModifyArtwork(artwork) && (
                            <div className="absolute top-3 left-3">
                              <input
                                type="checkbox"
                                checked={selectedPaintings.includes(artwork.id)}
                                onChange={() =>
                                  togglePaintingSelection(artwork.id)
                                }
                                className="w-5 h-5 rounded border-2 border-white text-orange-500 focus:ring-orange-500 focus:ring-offset-0"
                                onClick={(e) => e.stopPropagation()}
                              />
                            </div>
                          )}

                          {/* Category Badge */}
                          <div className="absolute top-3 right-3">
                            <span className="bg-white/90 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
                              {artwork.category_name}
                            </span>
                          </div>

                          {/* Featured Badge */}
                          {artwork.is_featured && (
                            <div className="absolute bottom-3 left-3">
                              <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                                Featured
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {artwork.title}
                        </h3>
                        {artwork.artist_display && (
                          <p className="text-sm text-gray-500 mb-1">
                            by {artwork.artist_display}
                          </p>
                        )}
                        {artwork.year_created && (
                          <p className="text-sm text-gray-400 mb-2">
                            {artwork.year_created}
                          </p>
                        )}
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {artwork.description}
                        </p>

                        {/* Tags */}
                        {artwork.tags_list.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1">
                            {artwork.tags_list.slice(0, 3).map((tag, index) => (
                              <span
                                key={index}
                                className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Stats */}
                        <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                          <span>{artwork.view_count} views</span>
                          <span>
                            {new Date(artwork.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Load More Button */}
                {hasMore && (
                  <div className="mt-8 text-center">
                    <button
                      onClick={loadMore}
                      disabled={artworksLoading}
                      className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center gap-2"
                    >
                      {artworksLoading && (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      )}
                      {artworksLoading ? "Loading..." : "Load More"}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      <UploadArtworkModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={handleUploadSuccess}
      />

      {/* Edit Modal */}
      {editingArtwork && (
        <EditArtworkModal
          isOpen={isEditModalOpen}
          onClose={handleEditModalClose}
          onSuccess={handleEditSuccess}
          artwork={editingArtwork}
        />
      )}

      {/* Artwork Detail Modal */}
      {detailArtwork && (
        <ArtworkDetailModal
          isOpen={isDetailModalOpen}
          onClose={handleDetailModalClose}
          artwork={detailArtwork}
          onViewIncrement={handleViewIncrement}
        />
      )}
    </div>
  );
}
