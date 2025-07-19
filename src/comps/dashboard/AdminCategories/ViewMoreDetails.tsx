import { useState } from "react";
import { 
  ChevronLeft, 
  Edit, 
  Trash2, 
  Image as ImageIcon,
  AlertCircle,
  Info,
  Link as LinkIcon,
  Calendar,
  FileText
} from "lucide-react";

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string;
  created_at?: string;
  updated_at?: string;
  product_count?: number;
}

interface CategoryDetailModalProps {
  category: Category;
  onClose: () => void;
  onEdit: () => void;
  onDelete: (id: number) => void;
}

export default function CategoryDetailModal({ 
  category, 
  onClose, 
  onEdit,
  onDelete 
}: CategoryDetailModalProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = () => {
    onDelete(category.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 p-4 border-b border-gray-200 flex justify-between items-center">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-bold text-gray-900">Category Details</h2>
          <div className="flex gap-2">
            <button
              onClick={onEdit}
              className="text-primary hover:text-primary/80 p-1"
              title="Edit"
            >
              <Edit className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="text-red-600 hover:text-red-800 p-1"
              title="Delete"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Delete Confirmation */}
        {showDeleteConfirm && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mx-4 mt-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Confirm Deletion
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>
                    Are you sure you want to delete this category? This action cannot be undone.
                  </p>
                </div>
                <div className="mt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(false)}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700"
                  >
                    Delete Category
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Category Image */}
            <div>
              <div className="relative bg-gray-100 rounded-lg overflow-hidden mb-4 h-64">
                {category.image ? (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "logos/logo-circle.png";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-16 h-16 text-gray-400" />
                  </div>
                )}
              </div>
            </div>

            {/* Category Details */}
            <div>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {category.name}
                </h1>
                
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <LinkIcon className="w-4 h-4 mr-1" />
                  <span>/categories/{category.slug}</span>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-gray-500" />
                  Description
                </h3>
                <p className="text-gray-700">
                  {category.description || "No description available"}
                </p>
              </div>

              {/* Metadata */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <Info className="w-5 h-5 mr-2 text-gray-500" />
                  Category Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center text-sm text-gray-500 mb-1">
                      <Calendar className="w-4 h-4 mr-2" />
                      Created
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {category.created_at ? new Date(category.created_at).toLocaleDateString() : 'N/A'}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center text-sm text-gray-500 mb-1">
                      <Calendar className="w-4 h-4 mr-2" />
                      Last Updated
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {category.updated_at ? new Date(category.updated_at).toLocaleDateString() : 'N/A'}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">
                      Products in this category
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {category.product_count || 0}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">
                      Category ID
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {category.id}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}