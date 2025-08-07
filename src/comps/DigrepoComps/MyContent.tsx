import { useState, useEffect } from "react";
import {
  FileText,
  Image as ImageIcon,
  Building2,
  Eye,
  Download,
  Share2,
  Edit,
  Trash2,
  Grid,
  List,
  Search,
  User,
  Archive,
  Plus,
  MoreVertical,
  Heart,
} from "lucide-react";
import { userContentService } from "../../services/userContentService";
import type {
  UserContentItem,
  UserContentStats,
} from "../../services/userContentService";

// Import existing upload modals
import UploadDocumentModal from "../LibraryComps/UploadDocumentModal";
import UploadArtworkModal from "./UploadArtworkModal";
import CreateMuseumModal from "./CreateMuseumModal";

// Mock data - in real app, this would come from API
const mockUserContent: UserContentItem[] = [
  {
    id: "1",
    title: "Traditional Rwandan Pottery",
    type: "artwork",
    thumbnail:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop",
    description:
      "Beautiful traditional pottery showcasing ancient Rwandan craftsmanship techniques.",
    created_at: "2025-01-15T10:30:00Z",
    updated_at: "2025-01-20T14:22:00Z",
    status: "published",
    views: 1250,
    downloads: 89,
    likes: 234,
    comments: 45,
    category: "Traditional Crafts",
    tags: ["pottery", "traditional", "rwandan", "craft"],
    access_level: "public",
  },
  {
    id: "2",
    title: "History of Rwandan Architecture",
    type: "document",
    thumbnail:
      "https://images.unsplash.com/photo-1481277542470-605612bd2d61?w=300&h=200&fit=crop",
    description:
      "Comprehensive research paper on the evolution of architectural styles in Rwanda.",
    created_at: "2025-01-12T08:15:00Z",
    updated_at: "2025-01-18T16:45:00Z",
    status: "published",
    views: 892,
    downloads: 156,
    likes: 67,
    comments: 23,
    category: "Research Papers",
    tags: ["architecture", "history", "research"],
    file_size: 2450000,
    access_level: "public",
  },
  {
    id: "3",
    title: "Kigali Cultural Center Exhibition",
    type: "museum",
    thumbnail:
      "https://images.unsplash.com/photo-1554907984-15263bfd63bd?w=300&h=200&fit=crop",
    description:
      "Curated exhibition showcasing contemporary Rwandan art and culture.",
    created_at: "2025-01-10T12:00:00Z",
    updated_at: "2025-01-22T09:30:00Z",
    status: "published",
    views: 2100,
    downloads: 0,
    likes: 456,
    comments: 89,
    category: "Cultural Heritage",
    tags: ["exhibition", "contemporary art", "culture"],
    access_level: "public",
  },
  {
    id: "4",
    title: "Digital Artifacts Collection",
    type: "collection",
    thumbnail:
      "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=300&h=200&fit=crop",
    description:
      "A curated collection of digitized historical artifacts from various museums.",
    created_at: "2025-01-08T14:20:00Z",
    updated_at: "2025-01-25T11:15:00Z",
    status: "draft",
    views: 0,
    downloads: 0,
    likes: 0,
    comments: 0,
    category: "Historical Artifacts",
    tags: ["artifacts", "history", "collection"],
    access_level: "private",
  },
];

const MyContentPage = () => {
  const [content, setContent] = useState<UserContentItem[]>([]);
  const [filteredContent, setFilteredContent] = useState<UserContentItem[]>([]);
  const [userStats, setUserStats] = useState<UserContentStats>({
    total_items: 0,
    total_views: 0,
    total_downloads: 0,
    total_likes: 0,
    total_comments: 0,
    by_type: { artworks: 0, documents: 0, museums: 0, collections: 0 },
  });
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filter, setFilter] = useState<{
    type: string;
    status: string;
    search: string;
    sortBy: string;
  }>({
    type: "all",
    status: "all",
    search: "",
    sortBy: "newest",
  });
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [showArtworkModal, setShowArtworkModal] = useState(false);
  const [showMuseumModal, setShowMuseumModal] = useState(false);
  const [showCollectionModal, setShowCollectionModal] = useState(false);

  // Load user content on component mount
  useEffect(() => {
    const loadUserContent = async () => {
      setLoading(true);
      try {
        const response = await userContentService.getUserContent();
        setContent(response.content);
        setUserStats(response.stats);
      } catch (error) {
        console.error("Failed to load user content:", error);
        // Fallback to mock data on error
        setContent(mockUserContent);
        const mockStats = {
          total_items: mockUserContent.length,
          total_views: mockUserContent.reduce(
            (acc, item) => acc + item.views,
            0
          ),
          total_downloads: mockUserContent.reduce(
            (acc, item) => acc + item.downloads,
            0
          ),
          total_likes: mockUserContent.reduce(
            (acc, item) => acc + item.likes,
            0
          ),
          total_comments: mockUserContent.reduce(
            (acc, item) => acc + item.comments,
            0
          ),
          by_type: {
            artworks: mockUserContent.filter((item) => item.type === "artwork")
              .length,
            documents: mockUserContent.filter(
              (item) => item.type === "document"
            ).length,
            museums: mockUserContent.filter((item) => item.type === "museum")
              .length,
            collections: mockUserContent.filter(
              (item) => item.type === "collection"
            ).length,
          },
        };
        setUserStats(mockStats);
      } finally {
        setLoading(false);
      }
    };

    loadUserContent();
  }, []);

  useEffect(() => {
    let filtered = [...content];

    // Filter by type
    if (filter.type !== "all") {
      filtered = filtered.filter((item) => item.type === filter.type);
    }

    // Filter by status
    if (filter.status !== "all") {
      filtered = filtered.filter((item) => item.status === filter.status);
    }

    // Search filter
    if (filter.search) {
      const searchTerm = filter.search.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm) ||
          item.description.toLowerCase().includes(searchTerm) ||
          item.tags?.some((tag: string) =>
            tag.toLowerCase().includes(searchTerm)
          )
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (filter.sortBy) {
        case "newest":
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        case "oldest":
          return (
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
        case "most_viewed":
          return b.views - a.views;
        case "most_liked":
          return b.likes - a.likes;
        case "title":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    setFilteredContent(filtered);
  }, [content, filter]);

  // Handle upload type selection
  const handleUploadTypeSelect = (type: string) => {
    setShowUploadModal(false);

    switch (type) {
      case "document":
        setShowDocumentModal(true);
        break;
      case "artwork":
        setShowArtworkModal(true);
        break;
      case "museum":
        setShowMuseumModal(true);
        break;
      case "collection":
        setShowCollectionModal(true);
        break;
      default:
        console.log("Unknown upload type:", type);
    }
  };

  // Handle successful uploads
  const handleUploadSuccess = (
    newItem: any,
    type: "artwork" | "document" | "museum" | "collection"
  ) => {
    // Convert the uploaded item to UserContentItem format
    const userContentItem: UserContentItem = {
      id: newItem.id || Date.now().toString(),
      title: newItem.title || newItem.name,
      type: type,
      thumbnail: newItem.image || newItem.cover_image || newItem.main_image,
      description: newItem.description || newItem.abstract,
      created_at: newItem.created_at || new Date().toISOString(),
      updated_at: newItem.updated_at || new Date().toISOString(),
      status: "published",
      views: newItem.view_count || 0,
      downloads: newItem.download_count || 0,
      likes: 0,
      comments: 0,
      category: newItem.category || type,
      tags: newItem.tags_list || newItem.tags || [],
      access_level: newItem.access_level || "public",
      file_size: newItem.file_size,
    };

    // Add to content list
    setContent((prev) => [userContentItem, ...prev]);

    // Update stats
    setUserStats((prev) => ({
      ...prev,
      total_items: prev.total_items + 1,
      by_type: {
        ...prev.by_type,
        [type + "s"]:
          prev.by_type[(type + "s") as keyof typeof prev.by_type] + 1,
      },
    }));

    // Close modals
    setShowDocumentModal(false);
    setShowArtworkModal(false);
    setShowMuseumModal(false);
    setShowCollectionModal(false);
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "";
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "artwork":
        return <ImageIcon className="w-4 h-4" />;
      case "document":
        return <FileText className="w-4 h-4" />;
      case "museum":
        return <Building2 className="w-4 h-4" />;
      case "collection":
        return <Archive className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      case "archived":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {loading && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              <span>Loading your content...</span>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Content</h1>
                <p className="text-gray-600">
                  Manage and track your uploaded content
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowUploadModal(true)}
              className="mt-4 lg:mt-0 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Upload New Content
            </button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Content
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {userStats.total_items}
                </p>
              </div>
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-2xl font-bold text-gray-900">
                  {userStats.total_views.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                <Eye className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Downloads
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {userStats.total_downloads.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                <Download className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Likes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {userStats.total_likes.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white rounded-xl p-6 shadow-sm border mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search your content..."
                  value={filter.search}
                  onChange={(e) =>
                    setFilter((prev) => ({ ...prev, search: e.target.value }))
                  }
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <select
                value={filter.type}
                onChange={(e) =>
                  setFilter((prev) => ({ ...prev, type: e.target.value }))
                }
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="artwork">Artworks</option>
                <option value="document">Documents</option>
                <option value="museum">Museums</option>
                <option value="collection">Collections</option>
              </select>
              <select
                value={filter.status}
                onChange={(e) =>
                  setFilter((prev) => ({ ...prev, status: e.target.value }))
                }
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
              <select
                value={filter.sortBy}
                onChange={(e) =>
                  setFilter((prev) => ({ ...prev, sortBy: e.target.value }))
                }
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="most_viewed">Most Viewed</option>
                <option value="most_liked">Most Liked</option>
                <option value="title">Title A-Z</option>
              </select>
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${
                    viewMode === "grid"
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 ${
                    viewMode === "list"
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid/List */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContent.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow"
              >
                <div className="relative">
                  {(item.thumbnail || item.image) && (
                    <img
                      src={item.image || item.thumbnail}
                      alt={item.title}
                      className="w-full h-48 object-cover rounded-t-xl"
                    />
                  )}
                  <div className="absolute top-3 left-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        item.status
                      )}`}
                    >
                      {getTypeIcon(item.type)}
                      {item.status}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
                      <MoreVertical className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>{formatDate(item.created_at)}</span>
                    {item.file_size && (
                      <span>{formatFileSize(item.file_size)}</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {item.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <Download className="w-4 h-4" />
                        {item.downloads}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        {item.likes}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-gray-400 hover:text-blue-500 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Content
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stats
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredContent.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {item.thumbnail && (
                            <img
                              src={item.thumbnail}
                              alt={item.title}
                              className="w-12 h-12 object-cover rounded-lg"
                            />
                          )}
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {item.title}
                            </h4>
                            <p className="text-sm text-gray-500 line-clamp-1">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                          {getTypeIcon(item.type)}
                          {item.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            item.status
                          )}`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {item.views}
                          </span>
                          <span className="flex items-center gap-1">
                            <Download className="w-4 h-4" />
                            {item.downloads}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="w-4 h-4" />
                            {item.likes}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatDate(item.created_at)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button className="p-2 text-gray-400 hover:text-blue-500 transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-green-500 transition-colors">
                            <Share2 className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredContent.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No content found
            </h3>
            <p className="text-gray-600 mb-6">
              {filter.search || filter.type !== "all" || filter.status !== "all"
                ? "Try adjusting your filters to see more content."
                : "Start by uploading your first piece of content to the digital repository."}
            </p>
            <button
              onClick={() => setShowUploadModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all"
            >
              <Plus className="w-5 h-5" />
              Upload Content
            </button>
          </div>
        )}
      </div>

      {/* Upload Modal Placeholder */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Upload New Content
            </h3>
            <p className="text-gray-600 mb-6">
              Choose what type of content you'd like to upload to the digital
              repository.
            </p>
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                onClick={() => handleUploadTypeSelect("artwork")}
                className="p-4 border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors group"
              >
                <ImageIcon className="w-8 h-8 text-blue-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium">Artwork</span>
                <p className="text-xs text-gray-500 mt-1">
                  Images, paintings, digital art
                </p>
              </button>
              <button
                onClick={() => handleUploadTypeSelect("document")}
                className="p-4 border border-gray-300 rounded-lg hover:bg-green-50 hover:border-green-300 transition-colors group"
              >
                <FileText className="w-8 h-8 text-green-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium">Document</span>
                <p className="text-xs text-gray-500 mt-1">
                  PDFs, research papers, books
                </p>
              </button>
              <button
                onClick={() => handleUploadTypeSelect("museum")}
                className="p-4 border border-gray-300 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-colors group"
              >
                <Building2 className="w-8 h-8 text-purple-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium">Museum</span>
                <p className="text-xs text-gray-500 mt-1">
                  Museum profiles, exhibitions
                </p>
              </button>
              <button
                onClick={() => handleUploadTypeSelect("collection")}
                className="p-4 border border-gray-300 rounded-lg hover:bg-orange-50 hover:border-orange-300 transition-colors group"
              >
                <Archive className="w-8 h-8 text-orange-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium">Collection</span>
                <p className="text-xs text-gray-500 mt-1">
                  Curated content collections
                </p>
              </button>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowUploadModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modals */}
      <UploadDocumentModal
        isOpen={showDocumentModal}
        onClose={() => setShowDocumentModal(false)}
        onSuccess={(document) => handleUploadSuccess(document, "document")}
      />

      <UploadArtworkModal
        isOpen={showArtworkModal}
        onClose={() => setShowArtworkModal(false)}
        onSuccess={(artwork) => handleUploadSuccess(artwork, "artwork")}
      />

      <CreateMuseumModal
        isOpen={showMuseumModal}
        onClose={() => setShowMuseumModal(false)}
        onSuccess={(museum) => handleUploadSuccess(museum, "museum")}
      />

      {/* Collection Creation Modal - temporary simple modal */}
      {showCollectionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Create Collection
            </h3>
            <p className="text-gray-600 mb-6">
              Collection creation is coming soon! This feature will allow you to
              create curated collections of content.
            </p>
            <button
              onClick={() => setShowCollectionModal(false)}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyContentPage;
