import { useState, useEffect } from "react";
import {
  Database,
  ExternalLink,
  Eye,
  Search,
  Filter,
  Building2,
  Globe,
  Tag,
  FileType,
  HardDrive,
  Award,
  Plus,
  X,
  Save,
} from "lucide-react";
import { digitalContentApiService } from "../../services/digitalContentApi";
import type { DigitalContent } from "../../services/digitalContentApi";
import { getUserInfo, isLoggedIn } from "../../app/Localstorage";

interface DigitalContentGalleryProps {
  contentType: string;
}

const DigitalContentGallery = ({ contentType }: DigitalContentGalleryProps) => {
  const [contents, setContents] = useState<DigitalContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrganization, setSelectedOrganization] = useState("");
  const [selectedFormat, setSelectedFormat] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);

  // Form state for creating new digital content
  const [newContent, setNewContent] = useState({
    title: "",
    description: "",
    external_url: "",
    thumbnail_url: "",
    creator: "",
    format: "",
    file_size: "",
    license: "",
    date_created: "",
    language: "en",
    access_level: "public",
    tags: "",
  });

  const userInfo = getUserInfo;
  const isUserLoggedIn = isLoggedIn;

  // Handle creating new digital content
  const handleCreateContent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !isUserLoggedIn ||
      (userInfo?.type !== "creator" && userInfo?.type !== "admin")
    ) {
      return;
    }

    setCreateLoading(true);
    try {
      // For simplicity, we'll use content type ID 1 for now
      // In a real implementation, you'd load content types and match by name
      const contentData = {
        title: newContent.title,
        description: newContent.description,
        content_type_id: 1, // This should be dynamic based on contentType
        external_url: newContent.external_url,
        thumbnail_url: newContent.thumbnail_url || undefined,
        source_organization: newContent.creator,
        license: newContent.license || undefined,
        format_type: newContent.format || undefined,
        size: newContent.file_size || undefined,
        language: newContent.language,
        access_level: newContent.access_level,
        tags: newContent.tags,
      };

      await digitalContentApiService.createDigitalContent(contentData);

      // Reset form and close modal
      setNewContent({
        title: "",
        description: "",
        external_url: "",
        thumbnail_url: "",
        creator: "",
        format: "",
        file_size: "",
        license: "",
        date_created: "",
        language: "en",
        access_level: "public",
        tags: "",
      });
      setShowCreateModal(false);

      // Reload content
      const typeSlug = contentType.toLowerCase().replace(/\s+/g, "-");
      try {
        const response = await digitalContentApiService.getDigitalContentByType(
          typeSlug
        );
        setContents(response.contents);
      } catch (typeError) {
        const response = await digitalContentApiService.getDigitalContents({
          search: contentType,
          page_size: 50,
        });
        const filteredContent = response.results.filter(
          (content) => content.content_type.name === contentType
        );
        setContents(filteredContent);
      }
    } catch (error) {
      console.error("Failed to create digital content:", error);
    } finally {
      setCreateLoading(false);
    }
  };

  // Load digital content from backend
  useEffect(() => {
    const loadDigitalContent = async () => {
      try {
        setLoading(true);
        setError(null);

        // Convert content type name to slug format for API call
        const typeSlug = contentType.toLowerCase().replace(/\s+/g, "-");

        try {
          // Try to get content by type first
          const response =
            await digitalContentApiService.getDigitalContentByType(typeSlug);
          setContents(response.contents);
        } catch (typeError) {
          // Fallback: get all content and filter by type name
          const response = await digitalContentApiService.getDigitalContents({
            search: contentType,
            page_size: 50,
          });

          // Filter content that matches the content type name
          const filteredContent = response.results.filter(
            (content) => content.content_type.name === contentType
          );
          setContents(filteredContent);
        }
      } catch (err) {
        console.error("Failed to load digital content:", err);
        setError("Failed to load digital content. Please try again.");
        // Keep mock data as fallback
        setContents(
          mockContents.filter(
            (content) => content.content_type.name === contentType
          )
        );
      } finally {
        setLoading(false);
      }
    };

    loadDigitalContent();
  }, [contentType]);

  // Mock data as fallback
  const mockContents: DigitalContent[] = [
    {
      id: "1",
      title: "Rwanda Population Census Dataset 2022",
      slug: "rwanda-population-census-dataset-2022",
      description:
        "Comprehensive population data from the 2022 national census including demographics, geographical distribution, and socioeconomic indicators.",
      content_type: {
        id: 1,
        name: "Datasets",
        slug: "datasets",
        description: "Statistical and research datasets",
        content_count: 45,
      },
      external_url: "https://data.gov.rw/census-2022",
      thumbnail_url:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400",
      source_organization: "National Institute of Statistics Rwanda",
      license: "Open Data License",
      format_type: "CSV, JSON, Excel",
      size: "2.4 GB",
      language: "en",
      access_level: "public",
      status: "active",
      tags_list: ["census", "population", "demographics", "statistics"],
      view_count: 3456,
      click_count: 1234,
      uploaded_by_username: "nisr_admin",
      created_at: "2024-01-10T08:00:00Z",
    },
    {
      id: "2",
      title: "Traditional Music Archive Collection",
      slug: "traditional-music-archive-collection",
      description:
        "Digital collection of traditional Rwandan music recordings, including ceremonial songs, folk music, and oral traditions.",
      content_type: {
        id: 2,
        name: "Multimedia",
        slug: "multimedia",
        description: "Audio, video, and multimedia content",
        content_count: 178,
      },
      external_url: "https://music.culture.gov.rw/traditional",
      thumbnail_url:
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
      source_organization: "Ministry of Sports and Culture",
      license: "Creative Commons BY-SA",
      format_type: "MP3, WAV, FLAC",
      size: "8.7 GB",
      language: "rw",
      access_level: "public",
      status: "active",
      tags_list: ["music", "traditional", "culture", "heritage"],
      view_count: 2145,
      click_count: 892,
      uploaded_by_username: "culture_ministry",
      created_at: "2024-01-25T15:30:00Z",
    },
    {
      id: "3",
      title: "Interactive History Timeline: Pre-Colonial Rwanda",
      slug: "interactive-history-timeline-precolonial",
      description:
        "An interactive digital timeline exploring the history, kingdoms, and cultural developments of pre-colonial Rwanda with multimedia elements.",
      content_type: {
        id: 3,
        name: "Interactive Content",
        slug: "interactive-content",
        description: "Interactive digital experiences",
        content_count: 23,
      },
      external_url: "https://history.edu.rw/interactive/precolonial",
      thumbnail_url:
        "https://images.unsplash.com/photo-1541963463532-d68292c34d19?w=400",
      source_organization: "Rwanda Education Board",
      license: "Educational Use License",
      format_type: "Web Application",
      size: "150 MB",
      language: "en",
      access_level: "public",
      status: "active",
      tags_list: ["history", "interactive", "education", "timeline"],
      view_count: 1876,
      click_count: 567,
      uploaded_by_username: "reb_digital",
      created_at: "2024-02-05T11:45:00Z",
    },
    {
      id: "4",
      title: "STEM Education Resource Portal",
      slug: "stem-education-resource-portal",
      description:
        "Comprehensive collection of science, technology, engineering, and mathematics educational materials for secondary schools.",
      content_type: {
        id: 4,
        name: "Educational Resources",
        slug: "educational-resources",
        description: "Learning and teaching materials",
        content_count: 89,
      },
      external_url: "https://stem.mineduc.gov.rw/resources",
      thumbnail_url:
        "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400",
      source_organization: "Ministry of Education",
      license: "Educational Commons",
      format_type: "PDF, Interactive Web",
      size: "1.2 GB",
      language: "en",
      access_level: "public",
      status: "active",
      tags_list: ["education", "STEM", "science", "technology"],
      view_count: 4321,
      click_count: 1876,
      uploaded_by_username: "mineduc_tech",
      created_at: "2024-01-18T09:20:00Z",
    },
  ];

  const handleExternalLinkClick = async (content: DigitalContent) => {
    try {
      // Track click in backend
      await digitalContentApiService.trackClick(content.slug);
    } catch (error) {
      console.error("Failed to track click:", error);
    }

    window.open(content.external_url, "_blank");
  };

  const filteredContents = contents.filter((content) => {
    const matchesSearch =
      content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      content.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      content.tags_list.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesOrganization =
      !selectedOrganization ||
      content.source_organization === selectedOrganization;
    const matchesFormat =
      !selectedFormat || content.format_type?.includes(selectedFormat);
    const matchesLanguage =
      !selectedLanguage || content.language === selectedLanguage;

    return (
      matchesSearch && matchesOrganization && matchesFormat && matchesLanguage
    );
  });

  const organizations = [
    ...new Set(contents.map((content) => content.source_organization)),
  ];
  const formats = [
    ...new Set(
      contents.flatMap((content) => content.format_type?.split(", ") || [])
    ),
  ];
  const languages = [...new Set(contents.map((content) => content.language))];

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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <Database className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {contentType}
              </h1>
              <p className="text-gray-600 mt-1">
                Explore digital resources and interactive content from trusted
                organizations
              </p>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search digital content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-4">
              <select
                value={selectedOrganization}
                onChange={(e) => setSelectedOrganization(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">All Organizations</option>
                {organizations.map((org) => (
                  <option key={org} value={org}>
                    {org}
                  </option>
                ))}
              </select>

              <select
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">All Formats</option>
                {formats.map((format) => (
                  <option key={format} value={format}>
                    {format}
                  </option>
                ))}
              </select>

              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">All Languages</option>
                {languages.map((lang) => (
                  <option key={lang} value={lang}>
                    {getLanguageName(lang)}
                  </option>
                ))}
              </select>

              {/* Add New Digital Content Button - Only for creators and admins */}
              {isUserLoggedIn &&
                (userInfo?.type === "creator" ||
                  userInfo?.type === "admin") && (
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="px-4 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Add New Content
                  </button>
                )}

              <div className="flex border border-gray-300 rounded-xl overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-4 py-3 ${
                    viewMode === "grid"
                      ? "bg-purple-500 text-white"
                      : "bg-white text-gray-700"
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-4 py-3 ${
                    viewMode === "list"
                      ? "bg-purple-500 text-white"
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

      {/* Digital Content Grid/List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredContents.length === 0 ? (
          <div className="text-center py-12">
            <Database className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No content found
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
            {filteredContents.map((content) => (
              <div
                key={content.id}
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
                      content.thumbnail_url ||
                      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400"
                    }
                    alt={content.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white text-sm">
                    <Eye className="w-4 h-4" />
                    <span>{content.click_count}</span>
                    {/* <ExternalLink className="w-4 h-4 ml-2" />
                    <span>{content.click_count}</span> */}
                  </div>
                  {content.license && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-black/70 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                        <Award className="w-3 h-3" />
                        Licensed
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-2">
                      {content.title}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        content.access_level === "public"
                          ? "bg-green-100 text-green-800"
                          : content.access_level === "restricted"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {content.access_level}
                    </span>
                  </div>

                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {content.description}
                  </p>

                  {/* Metadata */}
                  <div className="space-y-2 mb-4 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      <span>{content.source_organization}</span>
                    </div>
                    {content.format_type && (
                      <div className="flex items-center gap-2">
                        <FileType className="w-4 h-4" />
                        <span>{content.format_type}</span>
                      </div>
                    )}
                    {content.size && (
                      <div className="flex items-center gap-2">
                        <HardDrive className="w-4 h-4" />
                        <span>{content.size}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      <span>{getLanguageName(content.language)}</span>
                    </div>
                  </div>

                  {/* License */}
                  {content.license && (
                    <div className="mb-4">
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        <Award className="w-3 h-3" />
                        {content.license}
                      </span>
                    </div>
                  )}

                  {/* Tags */}
                  {content.tags_list.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {content.tags_list.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                        >
                          <Tag className="w-3 h-3" />
                          {tag}
                        </span>
                      ))}
                      {content.tags_list.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded-full text-xs">
                          +{content.tags_list.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Action Button */}
                  <button
                    onClick={() => handleExternalLinkClick(content)}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white py-3 px-4 rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all duration-300 flex items-center justify-center gap-2 font-medium"
                  >
                    <ExternalLink className="w-5 h-5" />
                    Access Content
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Digital Content Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center">
                    <Database className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Add New Digital Content
                    </h2>
                    <p className="text-sm text-gray-600">
                      Add new content to {contentType}
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

            <form onSubmit={handleCreateContent} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={newContent.title}
                    onChange={(e) =>
                      setNewContent({ ...newContent, title: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={newContent.description}
                    onChange={(e) =>
                      setNewContent({
                        ...newContent,
                        description: e.target.value,
                      })
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    External URL *
                  </label>
                  <input
                    type="url"
                    value={newContent.external_url}
                    onChange={(e) =>
                      setNewContent({
                        ...newContent,
                        external_url: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thumbnail URL
                  </label>
                  <input
                    type="url"
                    value={newContent.thumbnail_url}
                    onChange={(e) =>
                      setNewContent({
                        ...newContent,
                        thumbnail_url: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Creator/Organization *
                  </label>
                  <input
                    type="text"
                    value={newContent.creator}
                    onChange={(e) =>
                      setNewContent({ ...newContent, creator: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Format
                  </label>
                  <input
                    type="text"
                    value={newContent.format}
                    onChange={(e) =>
                      setNewContent({ ...newContent, format: e.target.value })
                    }
                    placeholder="PDF, Video, Dataset, etc."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    File Size
                  </label>
                  <input
                    type="text"
                    value={newContent.file_size}
                    onChange={(e) =>
                      setNewContent({
                        ...newContent,
                        file_size: e.target.value,
                      })
                    }
                    placeholder="2.5 GB, 150 MB, etc."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    License
                  </label>
                  <input
                    type="text"
                    value={newContent.license}
                    onChange={(e) =>
                      setNewContent({ ...newContent, license: e.target.value })
                    }
                    placeholder="Creative Commons, Open License, etc."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Language
                  </label>
                  <select
                    value={newContent.language}
                    onChange={(e) =>
                      setNewContent({ ...newContent, language: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                    value={newContent.access_level}
                    onChange={(e) =>
                      setNewContent({
                        ...newContent,
                        access_level: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                    value={newContent.tags}
                    onChange={(e) =>
                      setNewContent({ ...newContent, tags: e.target.value })
                    }
                    placeholder="dataset, research, statistics, etc."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {createLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Save className="w-5 h-5" />
                  )}
                  {createLoading ? "Creating..." : "Create Content"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DigitalContentGallery;
