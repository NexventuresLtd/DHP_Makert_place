import React, { useState, useRef, useEffect } from "react";
import { X, Loader2, ImageIcon } from "lucide-react";
import { apiService } from "../../services/api";
import { useApi } from "../../hooks/useApi";
import type { Artwork } from "../../types";

interface EditArtworkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (artwork: Artwork) => void;
  artwork: Artwork;
}

export default function EditArtworkModal({
  isOpen,
  onClose,
  onSuccess,
  artwork,
}: EditArtworkModalProps) {
  const [formData, setFormData] = useState({
    title: artwork.title,
    description: artwork.description,
    artist_display: artwork.artist_display,
    year_created: artwork.year_created?.toString() || "",
    medium: artwork.medium || "",
    dimensions: artwork.dimensions || "",
    location: artwork.location || "",
    cultural_significance: artwork.cultural_significance || "",
    tags: artwork.tags_list.join(", "),
    category: "",
    artwork_type: artwork.artwork_type,
    is_featured: artwork.is_featured,
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(artwork.image);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch categories
  const { data: categories, loading: categoriesLoading } = useApi(() =>
    apiService.getCategories()
  );

  // Set category once categories are loaded
  useEffect(() => {
    if (categories && categories.results) {
      const currentCategory = categories.results.find(
        (cat) => cat.name === artwork.category_name
      );
      if (currentCategory) {
        setFormData((prev) => ({
          ...prev,
          category: currentCategory.id.toString(),
        }));
      }
    }
  }, [categories, artwork.category_name]);

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

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file");
        return;
      }

      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        setError("File size must be less than 10MB");
        return;
      }

      setSelectedFile(file);
      setError(null);

      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    // Validation
    if (!formData.title.trim()) {
      setError("Title is required");
      return;
    }

    if (!formData.description.trim()) {
      setError("Description is required");
      return;
    }

    if (!formData.category) {
      setError("Please select a category");
      return;
    }

    setIsUpdating(true);

    try {
      // Create FormData with only changed fields
      const submitData = new FormData();

      // Always include basic required fields if they've changed
      if (formData.title.trim() !== artwork.title) {
        submitData.append("title", formData.title.trim());
      }
      if (formData.description.trim() !== artwork.description) {
        submitData.append("description", formData.description.trim());
      }

      // Category comparison
      const currentCategory = categories?.results.find(
        (cat) => cat.name === artwork.category_name
      );
      if (formData.category !== currentCategory?.id.toString()) {
        submitData.append("category", formData.category);
      }

      // Artwork type
      if (formData.artwork_type !== artwork.artwork_type) {
        submitData.append("artwork_type", formData.artwork_type);
      }

      // Featured status
      if (formData.is_featured !== artwork.is_featured) {
        submitData.append("is_featured", formData.is_featured.toString());
      }

      // Optional fields - only send if changed
      if (formData.artist_display.trim() !== artwork.artist_display) {
        submitData.append("artist_display", formData.artist_display.trim());
      }

      const originalYear = artwork.year_created?.toString() || "";
      if (formData.year_created !== originalYear) {
        if (formData.year_created) {
          submitData.append("year_created", formData.year_created);
        } else {
          submitData.append("year_created", ""); // Clear the field
        }
      }

      if (formData.medium.trim() !== (artwork.medium || "")) {
        submitData.append("medium", formData.medium.trim());
      }

      if (formData.dimensions.trim() !== (artwork.dimensions || "")) {
        submitData.append("dimensions", formData.dimensions.trim());
      }

      if (formData.location.trim() !== (artwork.location || "")) {
        submitData.append("location", formData.location.trim());
      }

      if (
        formData.cultural_significance.trim() !==
        (artwork.cultural_significance || "")
      ) {
        submitData.append(
          "cultural_significance",
          formData.cultural_significance.trim()
        );
      }

      const originalTags = artwork.tags_list.join(", ");
      if (formData.tags.trim() !== originalTags) {
        submitData.append("tags", formData.tags.trim());
      }

      // Only add image if a new one was selected
      if (selectedFile) {
        submitData.append("image", selectedFile);
      }

      // If no fields changed and no new image, show a message
      if (!selectedFile && submitData.entries().next().done) {
        setError("No changes detected. Please modify at least one field.");
        setIsUpdating(false);
        return;
      }

      const updatedArtwork = await apiService.updateArtwork(
        artwork.slug,
        submitData
      );
      onSuccess(updatedArtwork);
      handleClose();
    } catch (err: any) {
      console.error("Update failed:", err);
      setError(err.message || "Failed to update artwork. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle close
  const handleClose = () => {
    if (previewUrl && previewUrl !== artwork.image) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(artwork.image);
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Edit Artwork</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image (Optional)
            </label>
            <div className="flex items-start space-x-4">
              {/* Current/Preview Image */}
              <div className="w-32 h-32 border border-gray-300 rounded-lg overflow-hidden flex-shrink-0">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Upload Button */}
              <div className="flex-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  {selectedFile ? "Change Image" : "Update Image"}
                </button>
                <p className="text-xs text-gray-500 mt-1">
                  Optional: Only upload if you want to change the current image.
                  Max 10MB.
                </p>
              </div>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Enter artwork title"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Describe the artwork, its style, technique, and significance"
              required
            />
          </div>

          {/* Artist and Category Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Artist
              </label>
              <input
                type="text"
                value={formData.artist_display}
                onChange={(e) =>
                  setFormData({ ...formData, artist_display: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Artist name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              {categoriesLoading ? (
                <div className="flex items-center justify-center py-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
              ) : (
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                >
                  <option value="">Select category</option>
                  {categories?.results.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Year and Type Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Year Created
              </label>
              <input
                type="number"
                value={formData.year_created}
                onChange={(e) =>
                  setFormData({ ...formData, year_created: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="e.g., 1990"
                min="1000"
                max={new Date().getFullYear()}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Artwork Type
              </label>
              <select
                value={formData.artwork_type}
                onChange={(e) =>
                  setFormData({ ...formData, artwork_type: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="painting">Painting</option>
                <option value="sculpture">Sculpture</option>
                <option value="craft">Traditional Craft</option>
                <option value="textile">Textile</option>
                <option value="pottery">Pottery</option>
                <option value="jewelry">Jewelry</option>
                <option value="mask">Mask</option>
                <option value="tool">Traditional Tool</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Medium and Dimensions Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Medium
              </label>
              <input
                type="text"
                value={formData.medium}
                onChange={(e) =>
                  setFormData({ ...formData, medium: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="e.g., Oil on canvas, Acrylic, Clay"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dimensions
              </label>
              <input
                type="text"
                value={formData.dimensions}
                onChange={(e) =>
                  setFormData({ ...formData, dimensions: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="e.g., 50cm x 70cm"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location/Origin
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="e.g., Kigali, Rwanda"
            />
          </div>

          {/* Cultural Significance */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cultural Significance
            </label>
            <textarea
              value={formData.cultural_significance}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  cultural_significance: e.target.value,
                })
              }
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Describe the cultural importance and historical context"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) =>
                setFormData({ ...formData, tags: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="e.g., traditional, contemporary, colorful (comma-separated)"
            />
            <p className="text-xs text-gray-500 mt-1">
              Separate multiple tags with commas
            </p>
          </div>

          {/* Featured Toggle */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_featured"
              checked={formData.is_featured}
              onChange={(e) =>
                setFormData({ ...formData, is_featured: e.target.checked })
              }
              className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
            />
            <label htmlFor="is_featured" className="ml-2 text-sm text-gray-700">
              Feature this artwork
            </label>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUpdating}
              className="px-4 py-2 text-sm font-medium text-white bg-orange-600 border border-transparent rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center"
            >
              {isUpdating && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              {isUpdating ? "Updating..." : "Update Artwork"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
