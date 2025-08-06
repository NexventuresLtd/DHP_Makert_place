import { useState, useEffect } from "react";
import {
  Archive,
  ExternalLink,
  Eye,
  Search,
  Filter,
  Calendar,
  Building2,
  Globe,
  Tag,
  ArrowLeft,
  Plus,
  X,
  Save,
} from "lucide-react";
import {
  archiveApiService,
  type Archive as ArchiveItem,
  type ArchiveType,
} from "../../services/archiveApi";
import { getUserInfo, isLoggedIn } from "../../app/Localstorage";
import type { PaginatedResponse } from "../../types";

interface ArchiveGalleryProps {
  archiveType: string;
}

const ArchiveGallery = ({ archiveType }: ArchiveGalleryProps) => {
  const [archives, setArchives] = useState<ArchiveItem[]>([]);
  const [archiveTypes, setArchiveTypes] = useState<
    PaginatedResponse<ArchiveType>
  >({ count: 0, results: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInstitution, setSelectedInstitution] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);

  // Form state for creating new archive
  const [newArchive, setNewArchive] = useState({
    title: "",
    description: "",
    external_url: "",
    thumbnail_url: "",
    source_institution: "",
    date_created: "",
    language: "en",
    access_level: "public",
    tags: "",
  });

  const userInfo = getUserInfo;
  const isUserLoggedIn = isLoggedIn;

  // Handle creating new archive
  const handleCreateArchive = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !isUserLoggedIn ||
      (userInfo?.type !== "creator" && userInfo?.type !== "admin")
    ) {
      return;
    }
    // Find the archive type ID
    const currentArchiveType = archiveTypes.results.find(
      (type) => type.name === archiveType
    );
    if (!currentArchiveType) {
      console.error("Archive type not found:", archiveType);
      return;
    }

    setCreateLoading(true);
    try {
      const archiveData = {
        title: newArchive.title,
        description: newArchive.description,
        archive_type_id: currentArchiveType.id,
        external_url: newArchive.external_url,
        thumbnail_url: newArchive.thumbnail_url || undefined,
        source_institution: newArchive.source_institution,
        date_created: newArchive.date_created || undefined,
        language: newArchive.language,
        access_level: newArchive.access_level,
        tags: newArchive.tags,
      };

      await archiveApiService.createArchive(archiveData);

      // Reset form and close modal
      setNewArchive({
        title: "",
        description: "",
        external_url: "",
        thumbnail_url: "",
        source_institution: "",
        date_created: "",
        language: "en",
        access_level: "public",
        tags: "",
      });
      setShowCreateModal(false);

      // Reload archives
      const typeSlug = archiveType.toLowerCase().replace(/\s+/g, "-");
      try {
        const response = await archiveApiService.getArchivesByType(typeSlug);
        setArchives(response.archives);
      } catch (typeError) {
        const response = await archiveApiService.getArchives({
          search: archiveType,
          page_size: 50,
        });
        const filteredArchives = response.results.filter(
          (archive) => archive.archive_type.name === archiveType
        );
        setArchives(filteredArchives);
      }
    } catch (error) {
      console.error("Failed to create archive:", error);
    } finally {
      setCreateLoading(false);
    }
  };

  // Load archives from backend
  useEffect(() => {
    const loadArchives = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load archive types
        const typesResponse = await archiveApiService.getArchiveTypes();
        setArchiveTypes(typesResponse);

        // Convert archive type name to slug format for API call
        const typeSlug = archiveType.toLowerCase().replace(/\s+/g, "-");

        try {
          // Try to get archives by type first
          const response = await archiveApiService.getArchivesByType(typeSlug);
          setArchives(response.archives);
        } catch (typeError) {
          // Fallback: get all archives and filter by type name
          const response = await archiveApiService.getArchives({
            search: archiveType,
            page_size: 50,
          });

          // Filter archives that match the archive type name
          const filteredArchives = response.results.filter(
            (archive) => archive.archive_type.name === archiveType
          );
          setArchives(filteredArchives);
        }
      } catch (err) {
        console.error("Failed to load archives:", err);
        setError("Failed to load archives. Please try again.");
        // Keep mock data as fallback
        setArchives(
          mockArchives.filter(
            (archive) => archive.archive_type.name === archiveType
          )
        );
      } finally {
        setLoading(false);
      }
    };

    loadArchives();
  }, [archiveType]);

  // Mock data as fallback
  const mockArchives: ArchiveItem[] = [
    {
      id: "1",
      title: "Colonial Administration Records",
      slug: "colonial-administration-records",
      description:
        "Complete collection of colonial administrative documents from 1897-1962, including correspondence, reports, and official proclamations.",
      archive_type: {
        id: 1,
        name: "Historical Documents",
        slug: "historical-documents",
        description: "Historical documents and records",
        archive_count: 156,
      },
      external_url: "https://archives.gov.rw/colonial-records",
      thumbnail_url:
        "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400",
      source_institution: "Rwanda National Archives",
      date_created: "1897-01-01",
      language: "en",
      access_level: "public",
      status: "active",
      tags_list: ["colonial", "administration", "historical", "government"],
      view_count: 1234,
      click_count: 567,
      uploaded_by_username: "archivist1",
      created_at: "2024-01-15T10:00:00Z",
    },
    {
      id: "2",
      title: "Traditional Court Records",
      slug: "traditional-court-records",
      description:
        "Historical records of traditional Gacaca court proceedings and customary law decisions from various regions.",
      archive_type: {
        id: 2,
        name: "Government Records",
        slug: "government-records",
        description: "Official government documents",
        archive_count: 89,
      },
      external_url: "https://archives.gov.rw/gacaca-records",
      thumbnail_url:
        "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400",
      source_institution: "Ministry of Justice",
      date_created: "1920-01-01",
      language: "rw",
      access_level: "public",
      status: "active",
      tags_list: ["gacaca", "traditional", "court", "customary law"],
      view_count: 892,
      click_count: 345,
      uploaded_by_username: "legal_archivist",
      created_at: "2024-01-20T14:30:00Z",
    },
    {
      id: "3",
      title: "Personal Letters Collection",
      slug: "personal-letters-collection",
      description:
        "Private correspondence from prominent Rwandan figures during the independence period, providing insights into political and social changes.",
      archive_type: {
        id: 3,
        name: "Personal Papers",
        slug: "personal-papers",
        description: "Personal documents and papers",
        archive_count: 234,
      },
      external_url: "https://digitalarchives.ur.ac.rw/personal-letters",
      thumbnail_url:
        "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400",
      source_institution: "University of Rwanda Library",
      date_created: "1960-01-01",
      language: "fr",
      access_level: "restricted",
      status: "active",
      tags_list: ["independence", "politics", "personal", "correspondence"],
      view_count: 456,
      click_count: 123,
      uploaded_by_username: "university_lib",
      created_at: "2024-02-01T09:15:00Z",
    },
  ];

  const handleExternalLinkClick = async (archive: ArchiveItem) => {
    try {
      // Track click in backend
      await archiveApiService.trackClick(archive.slug);
    } catch (error) {
      console.error("Failed to track click:", error);
    }

    window.open(archive.external_url, "_blank");
  };

  const filteredArchives = archives.filter((archive) => {
    const matchesSearch =
      archive.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      archive.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      archive.tags_list.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesInstitution =
      !selectedInstitution ||
      archive.source_institution === selectedInstitution;
    const matchesLanguage =
      !selectedLanguage || archive.language === selectedLanguage;

    return matchesSearch && matchesInstitution && matchesLanguage;
  });

  const institutions = [
    ...new Set(archives.map((archive) => archive.source_institution)),
  ];
  const languages = [...new Set(archives.map((archive) => archive.language))];

  const getLanguageName = (code: string) => {
    const languageMap: { [key: string]: string } = {
      en: "English",
      rw: "Kinyarwanda",
      fr: "French",
      sw: "Swahili",
    };
    return languageMap[code] || code;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <Archive className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {archiveType}
              </h1>
              <p className="text-gray-600 mt-1">
                Discover historical archives and documents from trusted
                institutions
              </p>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search archives..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-4">
              <select
                value={selectedInstitution}
                onChange={(e) => setSelectedInstitution(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Institutions</option>
                {institutions.map((institution) => (
                  <option key={institution} value={institution}>
                    {institution}
                  </option>
                ))}
              </select>

              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Languages</option>
                {languages.map((lang) => (
                  <option key={lang} value={lang}>
                    {getLanguageName(lang)}
                  </option>
                ))}
              </select>

              {/* Add New Archive Button - Only for creators and admins */}
              {isUserLoggedIn &&
                (userInfo?.type === "creator" ||
                  userInfo?.type === "admin") && (
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Add New Archive
                  </button>
                )}

              <div className="flex border border-gray-300 rounded-xl overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-4 py-3 ${
                    viewMode === "grid"
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-700"
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-4 py-3 ${
                    viewMode === "list"
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-700"
                  }`}
                >
                  List
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Archives Grid/List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredArchives.length === 0 ? (
          <div className="text-center py-12">
            <Archive className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No archives found
            </h3>
            <p className="text-gray-600">
              Try adjusting your filters or search terms.
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
            {filteredArchives.map((archive) => (
              <div
                key={archive.id}
                className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group ${
                  viewMode === "list" ? "flex" : ""
                }`}
              >
                {/* Thumbnail */}
                <div
                  className={`relative ${
                    viewMode === "list" ? "w-48 flex-shrink-0" : "aspect-video"
                  }`}
                >
                  <img
                    src={
                      archive.thumbnail_url ||
                      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400"
                    }
                    alt={archive.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white text-sm">
                    <Eye className="w-4 h-4" />
                    <span>{archive.click_count}</span>
                    {/* <ExternalLink className="w-4 h-4 ml-2" />
                    <span>{archive.click_count}</span> */}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {archive.title}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        archive.access_level === "public"
                          ? "bg-green-100 text-green-800"
                          : archive.access_level === "restricted"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {archive.access_level}
                    </span>
                  </div>

                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {archive.description}
                  </p>

                  {/* Metadata */}
                  <div className="space-y-2 mb-4 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      <span>{archive.source_institution}</span>
                    </div>
                    {archive.date_created && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(archive.date_created).getFullYear()}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      <span>{getLanguageName(archive.language)}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  {archive.tags_list.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {archive.tags_list.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                        >
                          <Tag className="w-3 h-3" />
                          {tag}
                        </span>
                      ))}
                      {archive.tags_list.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded-full text-xs">
                          +{archive.tags_list.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Action Button */}
                  <button
                    onClick={() => handleExternalLinkClick(archive)}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white py-3 px-4 rounded-xl hover:from-amber-600 hover:to-orange-700 transition-all duration-300 flex items-center justify-center gap-2 font-medium"
                  >
                    <ExternalLink className="w-5 h-5" />
                    Visit Archive
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Archive Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center">
                    <Archive className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Add New Archive
                    </h2>
                    <p className="text-sm text-gray-600">
                      Add a new archive to {archiveType}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleCreateArchive} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={newArchive.title}
                    onChange={(e) =>
                      setNewArchive({ ...newArchive, title: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={newArchive.description}
                    onChange={(e) =>
                      setNewArchive({
                        ...newArchive,
                        description: e.target.value,
                      })
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    External URL *
                  </label>
                  <input
                    type="url"
                    value={newArchive.external_url}
                    onChange={(e) =>
                      setNewArchive({
                        ...newArchive,
                        external_url: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thumbnail URL
                  </label>
                  <input
                    type="url"
                    value={newArchive.thumbnail_url}
                    onChange={(e) =>
                      setNewArchive({
                        ...newArchive,
                        thumbnail_url: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Source Institution *
                  </label>
                  <input
                    type="text"
                    value={newArchive.source_institution}
                    onChange={(e) =>
                      setNewArchive({
                        ...newArchive,
                        source_institution: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date Created
                  </label>
                  <input
                    type="date"
                    value={newArchive.date_created}
                    onChange={(e) =>
                      setNewArchive({
                        ...newArchive,
                        date_created: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Language
                  </label>
                  <select
                    value={newArchive.language}
                    onChange={(e) =>
                      setNewArchive({ ...newArchive, language: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="en">English</option>
                    <option value="rw">Kinyarwanda</option>
                    <option value="fr">French</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Access Level
                  </label>
                  <select
                    value={newArchive.access_level}
                    onChange={(e) =>
                      setNewArchive({
                        ...newArchive,
                        access_level: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="public">Public</option>
                    <option value="restricted">Restricted</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={newArchive.tags}
                    onChange={(e) =>
                      setNewArchive({ ...newArchive, tags: e.target.value })
                    }
                    placeholder="history, documents, colonial, etc."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createLoading}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {createLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Save className="w-5 h-5" />
                  )}
                  {createLoading ? "Creating..." : "Create Archive"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArchiveGallery;
