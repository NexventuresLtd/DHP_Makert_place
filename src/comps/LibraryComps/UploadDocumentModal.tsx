import { useState, useRef } from "react";
import { X, Upload, FileText, AlertCircle, Check, Loader2 } from "lucide-react";
import { libraryApiService } from "../../services/libraryApi";
import { useApi } from "../../hooks/useApi";

interface UploadDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (document: any) => void;
}

export default function UploadDocumentModal({
  isOpen,
  onClose,
  onSuccess,
}: UploadDocumentModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    document_type: "",
    access_level: "public",
    language: "en",
    isbn: "",
    publication_year: new Date().getFullYear(),
    page_count: "",
    authors: [] as string[],
    subjects: [] as string[],
    tags: "",
    is_downloadable: true,
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [newAuthor, setNewAuthor] = useState("");
  const [newSubject, setNewSubject] = useState("");
  const [createNewDocumentType, setCreateNewDocumentType] = useState(false);
  const [newDocumentTypeName, setNewDocumentTypeName] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  // Fetch data for dropdowns
  const { data: documentTypes, loading: documentTypesLoading } = useApi(() =>
    libraryApiService.getDocumentTypes()
  );
  // const { data: authors, loading: authorsLoading } = useApi(() =>
  //   libraryApiService.getAuthors()
  // );
  // const { data: subjects, loading: subjectsLoading } = useApi(() =>
  //   libraryApiService.getSubjects()
  // );

  const ACCESS_LEVELS = [
    { value: "public", label: "Public Access" },
    { value: "restricted", label: "Restricted Access" },
    { value: "private", label: "Private" },
  ];

  const LANGUAGES = [
    { value: "en", label: "English" },
    { value: "rw", label: "Kinyarwanda" },
    { value: "fr", label: "French" },
    { value: "sw", label: "Swahili" },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
      ];

      if (!allowedTypes.includes(file.type)) {
        setError("Please select a valid document file (PDF, DOC, DOCX, TXT)");
        return;
      }

      // Validate file size (50MB max)
      if (file.size > 50 * 1024 * 1024) {
        setError("File size must be less than 50MB");
        return;
      }

      setSelectedFile(file);
      setError("");
    }
  };

  const handleCoverImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

      if (!allowedTypes.includes(file.type)) {
        setError("Please select a valid image file (JPEG, PNG, WebP)");
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB");
        return;
      }

      setCoverImage(file);
      setError("");
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
      ];

      if (!allowedTypes.includes(file.type)) {
        setError("Please select a valid document file (PDF, DOC, DOCX, TXT)");
        return;
      }

      // Validate file size (50MB max)
      if (file.size > 50 * 1024 * 1024) {
        setError("File size must be less than 50MB");
        return;
      }

      setSelectedFile(file);
      setError("");
    }
  };

  const addAuthor = () => {
    if (newAuthor.trim() && !formData.authors.includes(newAuthor.trim())) {
      setFormData((prev) => ({
        ...prev,
        authors: [...prev.authors, newAuthor.trim()],
      }));
      setNewAuthor("");
    }
  };

  const removeAuthor = (authorToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      authors: prev.authors.filter((author) => author !== authorToRemove),
    }));
  };

  const addSubject = () => {
    if (newSubject.trim() && !formData.subjects.includes(newSubject.trim())) {
      setFormData((prev) => ({
        ...prev,
        subjects: [...prev.subjects, newSubject.trim()],
      }));
      setNewSubject("");
    }
  };

  const removeSubject = (subjectToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      subjects: prev.subjects.filter((subject) => subject !== subjectToRemove),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      setError("Please select a document file");
      return;
    }

    if (!formData.title.trim()) {
      setError("Please enter a title");
      return;
    }

    if (!formData.description.trim()) {
      setError("Please enter a description");
      return;
    }

    if (!formData.document_type && !createNewDocumentType) {
      setError("Please select or create a document type");
      return;
    }

    if (createNewDocumentType && !newDocumentTypeName.trim()) {
      setError("Please enter a name for the new document type");
      return;
    }

    try {
      setIsUploading(true);
      setError("");
      setUploadProgress(10);

      // Create new document type if needed
      let documentTypeId = formData.document_type;
      if (createNewDocumentType && newDocumentTypeName.trim()) {
        setUploadProgress(20);
        const newDocType = await libraryApiService.createDocumentType({
          name: newDocumentTypeName.trim(),
          description: `Document type for ${newDocumentTypeName.trim()}`,
        });
        documentTypeId = newDocType.id.toString();
      }

      setUploadProgress(30);

      // Create FormData for upload
      const uploadFormData = new FormData();
      uploadFormData.append("title", formData.title.trim());
      uploadFormData.append("description", formData.description.trim());
      uploadFormData.append("document_type", documentTypeId);
      uploadFormData.append("access_level", formData.access_level);
      uploadFormData.append("language", formData.language);
      uploadFormData.append("document_file", selectedFile);

      if (coverImage) {
        uploadFormData.append("cover_image", coverImage);
      }

      if (formData.isbn.trim()) {
        uploadFormData.append("isbn", formData.isbn.trim());
      }

      if (formData.publication_year) {
        uploadFormData.append(
          "publication_year",
          formData.publication_year.toString()
        );
      }

      if (formData.page_count) {
        uploadFormData.append("page_count", formData.page_count);
      }

      if (formData.authors.length > 0) {
        uploadFormData.append("authors", JSON.stringify(formData.authors));
      }

      if (formData.subjects.length > 0) {
        uploadFormData.append("subjects", JSON.stringify(formData.subjects));
      }

      if (formData.tags.trim()) {
        uploadFormData.append("tags", formData.tags.trim());
      }

      // Add is_downloadable field
      uploadFormData.append(
        "is_downloadable",
        formData.is_downloadable.toString()
      );

      setUploadProgress(50);

      const document = await libraryApiService.createDocument(uploadFormData);

      setUploadProgress(100);

      // Success feedback
      setTimeout(() => {
        onSuccess?.(document);
        onClose();
        resetForm();
      }, 500);
    } catch (error: any) {
      console.error("Upload failed:", error);
      setError(error.message || "Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      document_type: "",
      access_level: "public",
      language: "en",
      isbn: "",
      publication_year: new Date().getFullYear(),
      page_count: "",
      authors: [],
      subjects: [],
      tags: "",
      is_downloadable: true,
    });
    setSelectedFile(null);
    setCoverImage(null);
    setError("");
    setNewAuthor("");
    setNewSubject("");
    setCreateNewDocumentType(false);
    setNewDocumentTypeName("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        style={{ scrollbarWidth: "thin" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-lg">
          <h2 className="text-2xl font-bold text-gray-900">Upload Document</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            disabled={isUploading}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* File Upload Area */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Document File *
            </label>
            <div
              className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                dragActive
                  ? "border-green-500 bg-green-50"
                  : selectedFile
                  ? "border-green-500 bg-green-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={isUploading}
              />

              {selectedFile ? (
                <div className="space-y-2">
                  <FileText className="w-12 h-12 text-green-500 mx-auto" />
                  <p className="text-green-700 font-medium">
                    {selectedFile.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                  <p className="text-gray-600">
                    Drag and drop your document here, or click to select
                  </p>
                  <p className="text-sm text-gray-400">
                    Supports PDF, DOC, DOCX, TXT (max 50MB)
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Cover Image Upload */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Cover Image (Optional)
            </label>
            <div className="flex items-center space-x-4">
              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                onChange={handleCoverImageSelect}
                className="hidden"
                disabled={isUploading}
              />
              <button
                type="button"
                onClick={() => coverInputRef.current?.click()}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={isUploading}
              >
                Select Cover Image
              </button>
              {coverImage && (
                <span className="text-sm text-green-600">
                  {coverImage.name}
                </span>
              )}
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter document title"
                disabled={isUploading}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ISBN (Optional)
              </label>
              <input
                type="text"
                name="isbn"
                value={formData.isbn}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter ISBN"
                disabled={isUploading}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Describe the document content"
              disabled={isUploading}
              required
            />
          </div>

          {/* Document Type */}
          <div className="space-y-4">
            {/* <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={!createNewDocumentType}
                  onChange={() => setCreateNewDocumentType(false)}
                  className="mr-2"
                  disabled={isUploading}
                />
                Select Existing Type
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={createNewDocumentType}
                  onChange={() => setCreateNewDocumentType(true)}
                  className="mr-2"
                  disabled={isUploading}
                />
                Create New Type
              </label>
            </div> */}

            {!createNewDocumentType ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Document Type *
                </label>
                <select
                  name="document_type"
                  value={formData.document_type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  disabled={isUploading || documentTypesLoading}
                  required={!createNewDocumentType}
                >
                  <option value="">Select a document type</option>
                  {documentTypes?.results.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Document Type Name *
                </label>
                <input
                  type="text"
                  value={newDocumentTypeName}
                  onChange={(e) => setNewDocumentTypeName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter new document type name"
                  disabled={isUploading}
                  required={createNewDocumentType}
                />
              </div>
            )}
          </div>

          {/* Additional Settings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Access Level
              </label>
              <select
                name="access_level"
                value={formData.access_level}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                disabled={isUploading}
              >
                {ACCESS_LEVELS.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Language
              </label>
              <select
                name="language"
                value={formData.language}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                disabled={isUploading}
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Publication Year
              </label>
              <input
                type="number"
                name="publication_year"
                value={formData.publication_year}
                onChange={handleInputChange}
                min="1000"
                max={new Date().getFullYear() + 10}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                disabled={isUploading}
              />
            </div>
          </div>

          {/* Download Settings */}
          <div>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="is_downloadable"
                checked={formData.is_downloadable}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    is_downloadable: e.target.checked,
                  }))
                }
                className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                disabled={isUploading}
              />
              <span className="text-sm font-medium text-gray-700">
                Allow users to download this document
              </span>
            </label>
            <p className="text-xs text-gray-500 mt-1 ml-7">
              When enabled, users will be able to download the document file
              directly
            </p>
          </div>

          {/* Authors */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Authors
            </label>
            <div className="space-y-2">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter author name"
                  disabled={isUploading}
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addAuthor())
                  }
                />
                <button
                  type="button"
                  onClick={addAuthor}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  disabled={isUploading || !newAuthor.trim()}
                >
                  Add
                </button>
              </div>
              {formData.authors.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.authors.map((author, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                    >
                      {author}
                      <button
                        type="button"
                        onClick={() => removeAuthor(author)}
                        className="ml-2 text-green-600 hover:text-green-800"
                        disabled={isUploading}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Subjects */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subjects/Topics
            </label>
            <div className="space-y-2">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter subject/topic"
                  disabled={isUploading}
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addSubject())
                  }
                />
                <button
                  type="button"
                  onClick={addSubject}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  disabled={isUploading || !newSubject.trim()}
                >
                  Add
                </button>
              </div>
              {formData.subjects.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.subjects.map((subject, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {subject}
                      <button
                        type="button"
                        onClick={() => removeSubject(subject)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                        disabled={isUploading}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter tags separated by commas"
              disabled={isUploading}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Upload Progress */}
          {isUploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Uploading document...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isUploading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              disabled={isUploading || !selectedFile || !formData.title.trim()}
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  <span>Upload Document</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
