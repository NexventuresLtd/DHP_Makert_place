import { useState } from "react";
import { Image as ImageIcon, AlertCircle, CheckCircle, Loader2, X } from "lucide-react";
import mainAxios from "../../Instance/mainAxios";


interface ProductFormData {
  name: string;
  description: string;
  price: string;
  original_price: string;
  condition: "new" | "used" | "refurbished";
  stock: number;
  is_featured: boolean;
  is_active: boolean;
  category: number;
  images: File[];
}

interface FormErrors {
  name?: string;
  description?: string;
  price?: string;
  original_price?: string;
  condition?: string;
  stock?: string;
  category?: string;
  images?: string;
  general?: string;
}

export default function AddProductForm({ onSuccess, onCancel }: { 
  onSuccess: () => void; 
  onCancel: () => void 
}) {
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    price: "",
    original_price: "",
    condition: "new",
    stock: 0,
    is_featured: false,
    is_active: true,
    category: 0,
    images: []
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [primaryImageIndex, setPrimaryImageIndex] = useState<number | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));

    // Clear errors when typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
        general: undefined
      }));
    }
  };

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Only allow numbers and decimals
    if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
      handleInputChange(e);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: File[] = [];
    const newPreviews: string[] = [];

    // Validate each file
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Check file type
      if (!file.type.match('image.*')) {
        setErrors(prev => ({
          ...prev,
          images: "Please select valid image files"
        }));
        continue;
      }

      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          images: "Image size must be less than 2MB"
        }));
        continue;
      }

      newImages.push(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result as string);
        if (newPreviews.length === newImages.length) {
          setImagePreviews(prev => [...prev, ...newPreviews]);
          setFormData(prev => ({
            ...prev,
            images: [...prev.images, ...newImages]
          }));
          if (primaryImageIndex === null && newPreviews.length > 0) {
            setPrimaryImageIndex(0);
          }
        }
      };
      reader.readAsDataURL(file);
    }

    // Clear image error
    setErrors(prev => ({
      ...prev,
      images: undefined,
      general: undefined
    }));
  };

  const removeImage = (index: number) => {
    const newImages = [...formData.images];
    const newPreviews = [...imagePreviews];
    
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);
    
    setFormData(prev => ({
      ...prev,
      images: newImages
    }));
    setImagePreviews(newPreviews);
    
    // Adjust primary image index if needed
    if (primaryImageIndex === index) {
      setPrimaryImageIndex(newPreviews.length > 0 ? 0 : null);
    } else if (primaryImageIndex !== null && primaryImageIndex > index) {
      setPrimaryImageIndex(primaryImageIndex - 1);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
    } else if (formData.name.length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    }

    if (!formData.price) {
      newErrors.price = "Price is required";
    } else if (parseFloat(formData.price) <= 0) {
      newErrors.price = "Price must be greater than 0";
    }

    if (formData.original_price && parseFloat(formData.original_price) <= 0) {
      newErrors.original_price = "Original price must be greater than 0";
    }

    if (formData.stock < 0) {
      newErrors.stock = "Stock cannot be negative";
    }

    if (formData.category === 0) {
      newErrors.category = "Category is required";
    }

    if (formData.images.length === 0) {
      newErrors.images = "At least one image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage("");

    if (validateForm()) {
      setIsLoading(true);

      try {
        // Create FormData for file upload
        const formDataToSend = new FormData();
        formDataToSend.append("name", formData.name);
        formDataToSend.append("description", formData.description);
        formDataToSend.append("price", formData.price);
        formDataToSend.append("original_price", formData.original_price || formData.price);
        formDataToSend.append("condition", formData.condition);
        formDataToSend.append("stock", formData.stock.toString());
        formDataToSend.append("is_featured", formData.is_featured.toString());
        formDataToSend.append("is_active", formData.is_active.toString());
        formDataToSend.append("category", formData.category.toString());

        // Append images with primary flag
        formData.images.forEach((file, index) => {
          formDataToSend.append("images", file);
          if (index === primaryImageIndex) {
            formDataToSend.append("primary_image_index", index.toString());
          }
        });

        const response = await mainAxios.post("/market/products/", formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        });
        
        setSuccessMessage("Product added successfully!");
        
        // Clear form after successful submission
        setTimeout(() => {
          onSuccess();
        }, 1500);
      } catch (error: any) {
        console.error("Error adding product:", error);
        
        if (error.response) {
          // Handle API validation errors
          if (error.response.data) {
            const apiErrors = error.response.data;
            const fieldErrors: FormErrors = {};
            
            if (apiErrors.name) fieldErrors.name = apiErrors.name.join(" ");
            if (apiErrors.price) fieldErrors.price = apiErrors.price.join(" ");
            if (apiErrors.original_price) fieldErrors.original_price = apiErrors.original_price.join(" ");
            if (apiErrors.stock) fieldErrors.stock = apiErrors.stock.join(" ");
            if (apiErrors.category) fieldErrors.category = apiErrors.category.join(" ");
            if (apiErrors.images) fieldErrors.images = apiErrors.images.join(" ");
            
            setErrors(fieldErrors);
          } else {
            setErrors({
              general: "Failed to add product. Please try again."
            });
          }
        } else {
          setErrors({
            general: "Network error. Please check your connection."
          });
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start">
          <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-green-700 font-medium">{successMessage}</p>
            <p className="text-green-600 text-sm mt-1">
              The product has been added to your marketplace.
            </p>
          </div>
        </div>
      )}

      {/* General Error Message */}
      {errors.general && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
          <AlertCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
          <p className="text-red-700">{errors.general}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name Field */}
          <div className="md:col-span-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Product Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors ${
                errors.name ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="e.g. Premium Wireless Headphones"
            />
            {errors.name && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.name}
              </p>
            )}
          </div>

          {/* Description Field */}
          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors ${
                errors.description ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Detailed description of your product..."
            />
            {errors.description && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.description}
              </p>
            )}
          </div>

          {/* Price Field */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
              Price *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">$</span>
              </div>
              <input
                type="text"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleNumberInputChange}
                className={`w-full pl-8 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors ${
                  errors.price ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="0.00"
              />
            </div>
            {errors.price && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.price}
              </p>
            )}
          </div>

          {/* Original Price Field */}
          <div>
            <label htmlFor="original_price" className="block text-sm font-medium text-gray-700 mb-2">
              Original Price (optional)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">$</span>
              </div>
              <input
                type="text"
                id="original_price"
                name="original_price"
                value={formData.original_price}
                onChange={handleNumberInputChange}
                className={`w-full pl-8 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors ${
                  errors.original_price ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="0.00"
              />
            </div>
            {errors.original_price && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.original_price}
              </p>
            )}
          </div>

          {/* Stock Field */}
          <div>
            <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-2">
              Stock Quantity *
            </label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={formData.stock}
              onChange={handleInputChange}
              min="0"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors ${
                errors.stock ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.stock && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.stock}
              </p>
            )}
          </div>

          {/* Condition Field */}
          <div>
            <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-2">
              Condition *
            </label>
            <select
              id="condition"
              name="condition"
              value={formData.condition}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
            >
              <option value="new">New</option>
              <option value="used">Used</option>
              <option value="refurbished">Refurbished</option>
            </select>
          </div>

          {/* Category Field */}
          <div className="md:col-span-2">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors ${
                errors.category ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="0">Select a category</option>
              {/* In a real app, you would map through categories from your API */}
              <option value="1">Electronics</option>
              <option value="2">Clothing</option>
              <option value="3">Home & Garden</option>
              <option value="4">Sports</option>
            </select>
            {errors.category && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.category}
              </p>
            )}
          </div>

          {/* Image Upload */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Images *
            </label>
            
            {imagePreviews.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Product preview ${index + 1}`}
                      className={`rounded-lg border-2 object-cover h-32 w-full ${
                        primaryImageIndex === index ? 'border-primary' : 'border-gray-200'
                      }`}
                    />
                    <div className="absolute top-2 right-2 flex gap-1">
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="bg-white/90 hover:bg-white text-gray-800 rounded-full p-1 shadow-sm transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPrimaryImageIndex(index)}
                      className={`absolute bottom-2 left-2 text-xs px-2 py-1 rounded ${
                        primaryImageIndex === index 
                          ? 'bg-primary text-white' 
                          : 'bg-white/90 text-gray-800 hover:bg-white'
                      }`}
                    >
                      {primaryImageIndex === index ? 'Primary' : 'Set Primary'}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
                  <ImageIcon className="w-10 h-10 mb-3 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG up to 2MB (At least one image required)
                  </p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                  multiple
                />
              </label>
            )}
            
            {errors.images && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.images}
              </p>
            )}
          </div>

          {/* Toggle Fields */}
          <div className="md:col-span-2 flex flex-wrap gap-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_featured"
                name="is_featured"
                checked={formData.is_featured}
                onChange={handleInputChange}
                className="w-4 h-4 text-primary rounded focus:ring-primary border-gray-300"
              />
              <label htmlFor="is_featured" className="ml-2 text-sm text-gray-700">
                Featured Product
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_active"
                name="is_active"
                checked={formData.is_active}
                onChange={handleInputChange}
                className="w-4 h-4 text-primary rounded focus:ring-primary border-gray-300"
              />
              <label htmlFor="is_active" className="ml-2 text-sm text-gray-700">
                Active (Visible in store)
              </label>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Adding...
              </>
            ) : (
              'Add Product'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}