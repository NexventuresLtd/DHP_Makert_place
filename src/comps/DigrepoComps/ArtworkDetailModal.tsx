import { useState, useEffect } from "react";
import {
  X,
  Calendar,
  MapPin,
  User,
  Eye,
  Share2,
  Download,
  Palette,
  Ruler,
  Tag,
} from "lucide-react";
import type { Artwork } from "../../types";
import { apiService } from "../../services/api";

interface ArtworkDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  artwork: Artwork;
  onViewIncrement?: (updatedArtwork: Artwork) => void;
}

export default function ArtworkDetailModal({
  isOpen,
  onClose,
  artwork,
  onViewIncrement,
}: ArtworkDetailModalProps) {
  const [currentArtwork, setCurrentArtwork] = useState<Artwork>(artwork);
  const [imageLoading, setImageLoading] = useState(true);
  const [hasIncrementedView, setHasIncrementedView] = useState(false);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Update current artwork when prop changes
  useEffect(() => {
    setCurrentArtwork(artwork);
    setHasIncrementedView(false);
  }, [artwork]);

  // Increment view count when modal opens
  useEffect(() => {
    if (isOpen && !hasIncrementedView) {
      const incrementView = async () => {
        try {
          await apiService.incrementArtworkView(artwork.slug);
          const updatedArtwork = {
            ...currentArtwork,
            view_count: currentArtwork.view_count + 1,
          };
          setCurrentArtwork(updatedArtwork);
          onViewIncrement?.(updatedArtwork);
          setHasIncrementedView(true);
        } catch (error) {
          console.error("Failed to increment view count:", error);
        }
      };

      incrementView();
    }
  }, [
    isOpen,
    hasIncrementedView,
    artwork.slug,
    currentArtwork,
    onViewIncrement,
  ]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: currentArtwork.title,
          text: currentArtwork.description,
          url: window.location.href,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(currentArtwork.image, { mode: "cors" });
      if (!response.ok) throw new Error("Network response was not ok.");

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${currentArtwork.title || "download"}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-7xl w-full max-h-[95vh] overflow-hidden flex flex-col lg:flex-row">
        {/* Image Section */}
        <div className="lg:w-2/3 bg-gray-100 flex items-center justify-center relative">
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
          )}
          <img
            src={currentArtwork.image}
            alt={currentArtwork.title}
            className="max-w-full max-h-full object-contain"
            onLoad={() => setImageLoading(false)}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src =
                "https://www.svgrepo.com/show/508699/landscape-placeholder.svg";
              setImageLoading(false);
            }}
          />

          {/* Close button overlay */}
          <button
            onClick={onClose}
            className="absolute top-4 left-4 text-white bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full p-2 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Action buttons overlay */}
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={handleShare}
              className="text-white bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full p-2 transition-colors"
              title="Share"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <button
              onClick={handleDownload}
              className="text-white bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full p-2 transition-colors"
              title="Download"
            >
              <Download className="w-5 h-5" />
            </button>
          </div>

          {/* Featured badge */}
          {currentArtwork.is_featured && (
            <div className="absolute bottom-4 left-4">
              <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                Featured
              </span>
            </div>
          )}
        </div>

        {/* Details Section */}
        <div className="lg:w-1/3 p-6 overflow-y-auto">
          {/* Header */}
          <div className="border-b border-gray-200 pb-4 mb-4">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {currentArtwork.title}
            </h1>

            {currentArtwork.artist_display && (
              <div className="flex items-center text-gray-600 mb-2">
                <User className="w-4 h-4 mr-2" />
                <span className="font-medium">
                  {currentArtwork.artist_display}
                </span>
              </div>
            )}

            <div className="flex items-center text-gray-500 text-sm space-x-4">
              <div className="flex items-center">
                <Eye className="w-4 h-4 mr-1" />
                <span>{currentArtwork.view_count} views</span>
              </div>
              {currentArtwork.year_created && (
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>{currentArtwork.year_created}</span>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Description
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {currentArtwork.description}
            </p>
          </div>

          {/* Cultural Significance */}
          {currentArtwork.cultural_significance && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Cultural Significance
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {currentArtwork.cultural_significance}
              </p>
            </div>
          )}

          {/* Details Grid */}
          <div className="space-y-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Details</h3>

            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-start">
                <Tag className="w-4 h-4 mr-2 mt-0.5 text-gray-400" />
                <div>
                  <span className="text-sm font-medium text-gray-900">
                    Category:
                  </span>
                  <span className="text-sm text-gray-600 ml-2">
                    {currentArtwork.category_name}
                  </span>
                </div>
              </div>

              <div className="flex items-start">
                <Palette className="w-4 h-4 mr-2 mt-0.5 text-gray-400" />
                <div>
                  <span className="text-sm font-medium text-gray-900">
                    Type:
                  </span>
                  <span className="text-sm text-gray-600 ml-2 capitalize">
                    {currentArtwork.artwork_type}
                  </span>
                </div>
              </div>

              {currentArtwork.medium && (
                <div className="flex items-start">
                  <Palette className="w-4 h-4 mr-2 mt-0.5 text-gray-400" />
                  <div>
                    <span className="text-sm font-medium text-gray-900">
                      Medium:
                    </span>
                    <span className="text-sm text-gray-600 ml-2">
                      {currentArtwork.medium}
                    </span>
                  </div>
                </div>
              )}

              {currentArtwork.dimensions && (
                <div className="flex items-start">
                  <Ruler className="w-4 h-4 mr-2 mt-0.5 text-gray-400" />
                  <div>
                    <span className="text-sm font-medium text-gray-900">
                      Dimensions:
                    </span>
                    <span className="text-sm text-gray-600 ml-2">
                      {currentArtwork.dimensions}
                    </span>
                  </div>
                </div>
              )}

              {currentArtwork.location && (
                <div className="flex items-start">
                  <MapPin className="w-4 h-4 mr-2 mt-0.5 text-gray-400" />
                  <div>
                    <span className="text-sm font-medium text-gray-900">
                      Origin:
                    </span>
                    <span className="text-sm text-gray-600 ml-2">
                      {currentArtwork.location}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex items-start">
                <User className="w-4 h-4 mr-2 mt-0.5 text-gray-400" />
                <div>
                  <span className="text-sm font-medium text-gray-900">
                    Uploaded by:
                  </span>
                  <span className="text-sm text-gray-600 ml-2">
                    {currentArtwork.uploaded_by_name}
                  </span>
                </div>
              </div>

              <div className="flex items-start">
                <Calendar className="w-4 h-4 mr-2 mt-0.5 text-gray-400" />
                <div>
                  <span className="text-sm font-medium text-gray-900">
                    Added:
                  </span>
                  <span className="text-sm text-gray-600 ml-2">
                    {new Date(currentArtwork.created_at).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tags */}
          {currentArtwork.tags_list.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {currentArtwork.tags_list.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-block px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex gap-3">
              <button
                onClick={handleShare}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
              <button
                onClick={handleDownload}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
