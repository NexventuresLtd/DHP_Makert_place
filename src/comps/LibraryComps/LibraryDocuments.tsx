import { useState, useEffect } from "react";
import {
  Search,
  Download,
  Eye,
  Calendar,
  User,
  BookOpen,
  Upload,
  Plus,
} from "lucide-react";
import { useApi } from "../../hooks/useApi";
import { libraryApiService } from "../../services/libraryApi";
import type { LibraryDocument } from "../../types/libraryTypes";
import UploadDocumentModal from "./UploadDocumentModal";

export default function LibraryDocuments({selectedType}: { selectedType?: string }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDocumentType, setSelectedDocumentType] = useState("All");
  const [selectedAccessLevel, setSelectedAccessLevel] = useState("All");
  const [selectedLanguage] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [documents, setDocuments] = useState<LibraryDocument[]>([]);
  const [documentsLoading, setDocumentsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  // Fetch document types
  const { data: documentTypes, loading: documentTypesLoading } = useApi(() =>
    libraryApiService.getDocumentTypes()
  );

  // Fetch documents
  useEffect(() => {
    const fetchDocuments = async () => {
      setDocumentsLoading(true);
      try {
        const params: any = {
          page: currentPage,
          search: searchTerm || undefined,
          access_level:
            selectedAccessLevel !== "All" ? selectedAccessLevel : undefined,
          language: selectedLanguage !== "All" ? selectedLanguage : undefined,
          ordering: "-created_at",
        };

        if (selectedType !== "All") {
          const docType = documentTypes?.results.find(
            (dt) => dt.name === selectedType
          );
          if (docType) {
            params.document_type = docType.id;
          }
        }

        const response = await libraryApiService.getDocuments(params);
        if (currentPage === 1) {
          setDocuments(response.results);
        } else {
          setDocuments((prev) => [...prev, ...response.results]);
        }
        setTotalCount(response.count);
        setHasMore(!!response.next);
      } catch (error) {
        console.error("Failed to fetch documents:", error);
      } finally {
        setDocumentsLoading(false);
      }
    };

    fetchDocuments();
  }, [
    currentPage,
    searchTerm,
    selectedType,
    selectedAccessLevel,
    selectedLanguage,
    documentTypes,
  ]);

  const loadMore = () => {
    if (hasMore && !documentsLoading) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handleDownload = async (doc: LibraryDocument) => {
    try {
      const blob = await libraryApiService.downloadDocument(doc.slug);
      const url = window.URL.createObjectURL(blob);
      const a = window.document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = doc.title + ".pdf"; // Adjust extension as needed
      window.document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      window.document.body.removeChild(a);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  if (documentTypesLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Digital Documents
          </h2>
          <p className="text-gray-600">
            Browse our collection of academic papers, books, and research
            documents
          </p>
        </div>
        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="mt-4 sm:mt-0 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-colors inline-flex items-center gap-2"
        >
          <Upload className="h-4 w-4" />
          Upload Document
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="lg:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search documents..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Document Type */}
          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Document Type
            </label>
            <select
              value={selectedDocumentType}
              onChange={(e) => setSelectedDocumentType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="All">All Types</option>
              {documentTypes?.results.map((type) => (
                <option key={type.id} value={type.name}>
                  {type.name}
                </option>
              ))}
            </select>
          </div> */}

          {/* Access Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Access Level
            </label>
            <select
              value={selectedAccessLevel}
              onChange={(e) => setSelectedAccessLevel(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="All">All Access</option>
              <option value="public">Public</option>
              <option value="restricted">Restricted</option>
              <option value="private">Private</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-gray-600">
          Showing {documents.length} of {totalCount} documents
        </p>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {documents.map((document) => (
          <div
            key={document.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* Document Cover */}
            <div className="aspect-[3/4] bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
              {document.cover_image ? (
                <img
                  src={document.cover_image}
                  alt={document.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <BookOpen className="h-16 w-16 text-green-400" />
              )}
            </div>

            {/* Document Info */}
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                {document.title}
              </h3>

              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{document.authors_display || "Unknown Author"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{document.publication_year || "N/A"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span>{document.document_type_name}</span>
                </div>
              </div>

              {/* Access Level Badge */}
              <div className="mb-4">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    document.access_level === "public"
                      ? "bg-green-100 text-green-800"
                      : document.access_level === "restricted"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {document.access_level.charAt(0).toUpperCase() +
                    document.access_level.slice(1)}
                </span>
              </div>

              {/* Abstract */}
              {document.abstract && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {document.abstract}
                </p>
              )}

              {/* Stats */}
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{document.view_count}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Download className="h-4 w-4" />
                  <span>{document.download_count}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button className="flex-1 bg-green-500 hover:bg-green-600 text-white text-sm py-2 px-3 rounded-lg transition-colors">
                  View Details
                </button>
                {document.document_file && (
                  <button
                    onClick={() => handleDownload(document)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-lg transition-colors"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="mt-8 text-center">
          <button
            onClick={loadMore}
            disabled={documentsLoading}
            className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center gap-2"
          >
            {documentsLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Loading...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Load More Documents
              </>
            )}
          </button>
        </div>
      )}

      {/* Upload Modal */}
      <UploadDocumentModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={(newDocument) => {
          // Add the new document to the beginning of the list
          setDocuments((prev) => [newDocument, ...prev]);
          setTotalCount((prev) => prev + 1);
          // Show success message or refresh the list
        }}
      />
    </div>
  );
}
