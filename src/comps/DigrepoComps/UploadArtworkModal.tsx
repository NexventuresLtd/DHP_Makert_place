import React, { useState, useRef, useEffect } from "react";
import { X, Loader2, ImageIcon } from "lucide-react";
import { apiService } from "../../services/api";
import { useApi } from "../../hooks/useApi";

interface UploadArtworkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function UploadArtworkModal({
  isOpen,
  onClose,
  onSuccess,
}: UploadArtworkModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    artist_display: "",
    year_created: "",
    medium: "",
    dimensions: "",
    location: "",
    cultural_significance: "",
    tags: "",
    category: "",
    artwork_type: "painting",
    is_featured: false,
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCreatingNewCategory, setIsCreatingNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDescription, setNewCategoryDescription] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch categories
  const { data: categories, loading: categoriesLoading } = useApi(() =>
    apiService.getCategories()
  );

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please select an image file");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      setError("Please select an image file");
      return;
    }

    if (!formData.title.trim()) {
      setError("Please enter a title");
      return;
    }

    if (!formData.category && !isCreatingNewCategory) {
      setError("Please select a category or create a new one");
      return;
    }

    if (isCreatingNewCategory && !newCategoryName.trim()) {
      setError("Please enter a name for the new category");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      let categoryId = formData.category;

      // Create new category if needed
      if (isCreatingNewCategory) {
        try {
          const newCategory = await apiService.createCategory({
            name: newCategoryName.trim(),
            description: newCategoryDescription.trim() || undefined,
          });
          categoryId = newCategory.id.toString();
        } catch (categoryError) {
          console.error("Failed to create category:", categoryError);
          setError("Failed to create new category. Please try again.");
          return;
        }
      }

      const uploadData = new FormData();
      uploadData.append("image", selectedFile);
      uploadData.append("title", formData.title);
      uploadData.append("description", formData.description);
      uploadData.append("artist_display", formData.artist_display);
      uploadData.append("category", categoryId);
      uploadData.append("artwork_type", formData.artwork_type);
      uploadData.append("is_featured", formData.is_featured.toString());

      if (formData.year_created) {
        uploadData.append("year_created", formData.year_created);
      }
      if (formData.medium) {
        uploadData.append("medium", formData.medium);
      }
      if (formData.dimensions) {
        uploadData.append("dimensions", formData.dimensions);
      }
      if (formData.location) {
        uploadData.append("location", formData.location);
      }
      if (formData.cultural_significance) {
        uploadData.append(
          "cultural_significance",
          formData.cultural_significance
        );
      }
      if (formData.tags) {
        // Convert comma-separated tags to array
        const tagsArray = formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag);
        uploadData.append("tags", JSON.stringify(tagsArray));
      }

      await apiService.createArtwork(uploadData);

      // Reset form
      setFormData({
        title: "",
        description: "",
        artist_display: "",
        year_created: "",
        medium: "",
        dimensions: "",
        location: "",
        cultural_significance: "",
        tags: "",
        category: "",
        artwork_type: "painting",
        is_featured: false,
      });
      setSelectedFile(null);
      setPreviewUrl(null);
      setIsCreatingNewCategory(false);
      setNewCategoryName("");
      setNewCategoryDescription("");

      // Reset body overflow
      document.body.style.overflow = "unset";
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Upload failed:", error);
      setError("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    if (!isUploading) {
      // Clean up preview URL
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      // Reset body overflow
      document.body.style.overflow = "unset";
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-gray-500/75"
      onClick={handleClose}
    >
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="inline-block w-full max-w-2xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Upload Artwork
            </h3>
            <button
              onClick={handleClose}
              disabled={isUploading}
              className="text-gray-400 hover:text-gray-500 disabled:opacity-50"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Form */}
          <div className="max-h-[70vh] overflow-y-auto">
            <form onSubmit={handleSubmit} className="px-6 py-4">
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              {/* File Upload */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image *
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 transition-colors">
                  <div className="space-y-1 text-center">
                    {previewUrl ? (
                      <div className="relative">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="mx-auto h-32 w-auto rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedFile(null);
                            setPreviewUrl(null);
                            if (fileInputRef.current) {
                              fileInputRef.current.value = "";
                            }
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label className="relative cursor-pointer rounded-md font-medium text-orange-600 hover:text-orange-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-orange-500">
                            <span>Upload a file</span>
                            <input
                              ref={fileInputRef}
                              type="file"
                              className="sr-only"
                              accept="image/*"
                              onChange={handleFileSelect}
                              disabled={isUploading}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {/* Title */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    disabled={isUploading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:opacity-50"
                    placeholder="Enter artwork title"
                  />
                </div>

                {/* Artist */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Artist
                  </label>
                  <input
                    type="text"
                    name="artist_display"
                    value={formData.artist_display}
                    onChange={handleInputChange}
                    disabled={isUploading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:opacity-50"
                    placeholder="Artist name"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>

                  {/* Toggle between existing and new category */}
                  <div className="mb-3">
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="categoryType"
                          checked={!isCreatingNewCategory}
                          onChange={() => setIsCreatingNewCategory(false)}
                          className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          Select existing
                        </span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="categoryType"
                          checked={isCreatingNewCategory}
                          onChange={() => setIsCreatingNewCategory(true)}
                          className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          Create new
                        </span>
                      </label>
                    </div>
                  </div>

                  {isCreatingNewCategory ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        disabled={isUploading}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:opacity-50"
                        placeholder="New category name"
                      />
                      <textarea
                        value={newCategoryDescription}
                        onChange={(e) =>
                          setNewCategoryDescription(e.target.value)
                        }
                        disabled={isUploading}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:opacity-50"
                        placeholder="Category description (optional)"
                      />
                    </div>
                  ) : (
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      disabled={isUploading || categoriesLoading}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:opacity-50"
                    >
                      <option value="">Select a category</option>
                      {categories?.results.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Year Created */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Year Created
                  </label>
                  <input
                    type="number"
                    name="year_created"
                    value={formData.year_created}
                    onChange={handleInputChange}
                    disabled={isUploading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:opacity-50"
                    placeholder="e.g., 2023"
                  />
                </div>

                {/* Medium */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Medium
                  </label>
                  <input
                    type="text"
                    name="medium"
                    value={formData.medium}
                    onChange={handleInputChange}
                    disabled={isUploading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:opacity-50"
                    placeholder="e.g., Oil on canvas"
                  />
                </div>

                {/* Dimensions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dimensions
                  </label>
                  <input
                    type="text"
                    name="dimensions"
                    value={formData.dimensions}
                    onChange={handleInputChange}
                    disabled={isUploading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:opacity-50"
                    placeholder="e.g., 50 x 70 cm"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    disabled={isUploading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:opacity-50"
                    placeholder="Current location"
                  />
                </div>

                {/* Tags */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tags
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    disabled={isUploading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:opacity-50"
                    placeholder="Enter tags separated by commas"
                  />
                </div>

                {/* Description */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    disabled={isUploading}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:opacity-50"
                    placeholder="Describe the artwork"
                  />
                </div>

                {/* Cultural Significance */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cultural Significance
                  </label>
                  <textarea
                    name="cultural_significance"
                    value={formData.cultural_significance}
                    onChange={handleInputChange}
                    disabled={isUploading}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:opacity-50"
                    placeholder="Explain the cultural significance of this artwork"
                  />
                </div>

                {/* Featured */}
                <div className="sm:col-span-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="is_featured"
                      checked={formData.is_featured}
                      onChange={handleInputChange}
                      disabled={isUploading}
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded disabled:opacity-50"
                    />
                    <label className="ml-2 block text-sm text-gray-700">
                      Mark as featured artwork
                    </label>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isUploading}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 disabled:opacity-50 inline-flex items-center gap-2"
                >
                  {isUploading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isUploading ? "Uploading..." : "Upload Artwork"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
