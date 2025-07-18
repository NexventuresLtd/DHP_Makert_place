import { useState, useRef } from "react";
import {  Upload, AlertCircle, CheckCircle, Loader2, X, Star, PlusCircle } from "lucide-react";
import mainAxios from "../../Instance/mainAxios";

interface ProductFormData {
    uploaded_images: string[];
    name: string;
    description: string;
    price: string;
    original_price: string;
    condition: "new" | "used" | "refurbished";
    stock: number;
    rating: string;
    is_featured: boolean;
    is_active: boolean;
    category: number;
}

interface FormErrors {
    uploaded_images?: string;
    name?: string;
    description?: string;
    price?: string;
    original_price?: string;
    condition?: string;
    stock?: string;
    category?: string;
    general?: string;
}

interface AddProductFormProps {
    onSuccess: () => void;
    onCancel: () => void;
}

export default function AddProductForm({ onSuccess, onCancel }: AddProductFormProps) {
    const [formData, setFormData] = useState<ProductFormData>({
        uploaded_images: [],
        name: "",
        description: "",
        price: "",
        original_price: "",
        condition: "new",
        stock: 0,
        rating: "0",
        is_featured: false,
        is_active: true,
        category: 0
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Handle image upload
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const newImages: string[] = [];
        const newPreviews: string[] = [];

        Array.from(files).forEach(file => {
            // Validate file type
            if (!file.type.match('image.*')) {
                setErrors(prev => ({
                    ...prev,
                    uploaded_images: "Please select valid image files"
                }));
                return;
            }

            // Validate file size (2MB max)
            if (file.size > 2 * 1024 * 1024) {
                setErrors(prev => ({
                    ...prev,
                    uploaded_images: "Image size must be less than 2MB"
                }));
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                newPreviews.push(reader.result as string);
                newImages.push(reader.result as string);

                if (newPreviews.length === files.length) {
                    setImagePreviews(prev => [...prev, ...newPreviews]);
                    setFormData(prev => ({
                        ...prev,
                        uploaded_images: [...prev.uploaded_images, ...newImages]
                    }));
                }
            };
            reader.readAsDataURL(file);
        });

        // Clear image error
        setErrors(prev => ({
            ...prev,
            uploaded_images: undefined,
            general: undefined
        }));
    };

    // Remove image
    const removeImage = (index: number) => {
        const newPreviews = [...imagePreviews];
        newPreviews.splice(index, 1);
        setImagePreviews(newPreviews);

        const newImages = [...formData.uploaded_images];
        newImages.splice(index, 1);
        setFormData(prev => ({
            ...prev,
            uploaded_images: newImages
        }));
    };

    // Set primary image
    const setPrimaryImage = (index: number) => {
        const newImages = [...formData.uploaded_images];
        const primaryImage = newImages.splice(index, 1)[0];
        newImages.unshift(primaryImage);
        setFormData(prev => ({
            ...prev,
            uploaded_images: newImages
        }));

        const newPreviews = [...imagePreviews];
        const primaryPreview = newPreviews.splice(index, 1)[0];
        newPreviews.unshift(primaryPreview);
        setImagePreviews(newPreviews);
    };

    // Handle input changes
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

    // Validate form
    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (formData.uploaded_images.length === 0) {
            newErrors.uploaded_images = "At least one image is required";
        }

        if (!formData.name.trim()) {
            newErrors.name = "Product name is required";
        } else if (formData.name.length < 3) {
            newErrors.name = "Name must be at least 3 characters";
        }

        if (!formData.price) {
            newErrors.price = "Price is required";
        } else if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
            newErrors.price = "Price must be a positive number";
        }

        if (formData.original_price && (isNaN(parseFloat(formData.original_price)) || parseFloat(formData.original_price) <= 0)) {
            newErrors.original_price = "Original price must be a positive number";
        }

        if (isNaN(formData.stock) || formData.stock < 0) {
            newErrors.stock = "Stock must be a positive number";
        }

        if (isNaN(formData.category) || formData.category <= 0) {
            newErrors.category = "Category is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSuccessMessage("");

        if (validateForm()) {
            setIsLoading(true);

            try {
                // Convert numeric fields to appropriate types
                const payload = {
                    ...formData,
                    price: parseFloat(formData.price).toString(),
                    original_price: formData.original_price ? parseFloat(formData.original_price).toString() : "",
                    stock: parseInt(formData.stock.toString()),
                    category: parseInt(formData.category.toString())
                };

                const response = await mainAxios.post("/market/products/", payload);

                setSuccessMessage("Product added successfully!");
                setTimeout(() => {
                    onSuccess();
                }, 1500);
            } catch (error: any) {
                console.error("Error adding product:", error);

                if (error.response?.data) {
                    // Handle API validation errors
                    const apiErrors = error.response.data;
                    const fieldErrors: FormErrors = {};

                    if (apiErrors.uploaded_images) fieldErrors.uploaded_images = apiErrors.uploaded_images.join(" ");
                    if (apiErrors.name) fieldErrors.name = apiErrors.name.join(" ");
                    if (apiErrors.description) fieldErrors.description = apiErrors.description.join(" ");
                    if (apiErrors.price) fieldErrors.price = apiErrors.price.join(" ");
                    if (apiErrors.original_price) fieldErrors.original_price = apiErrors.original_price.join(" ");
                    if (apiErrors.condition) fieldErrors.condition = apiErrors.condition.join(" ");
                    if (apiErrors.stock) fieldErrors.stock = apiErrors.stock.join(" ");
                    if (apiErrors.category) fieldErrors.category = apiErrors.category.join(" ");

                    setErrors(fieldErrors);
                } else {
                    setErrors({
                        general: "Failed to add product. Please try again."
                    });
                }
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
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

            {/* Images Upload */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Images *
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-4">
                    {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                            <img
                                src={preview}
                                alt={`Product preview ${index + 1}`}
                                className="h-32 w-full object-cover rounded-lg border border-gray-200"
                            />
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                                {index === 0 ? (
                                    <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                                        Primary
                                    </span>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => setPrimaryImage(index)}
                                        className="bg-white/80 hover:bg-white text-gray-800 rounded-full p-1.5 shadow-sm transition-colors"
                                        title="Set as primary"
                                    >
                                        <Star className="w-4 h-4" />
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="bg-white/80 hover:bg-white text-gray-800 rounded-full p-1.5 shadow-sm transition-colors"
                                    title="Remove image"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}

                    {imagePreviews.length < 10 && (
                        <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
                                <Upload className="w-8 h-8 mb-3 text-gray-400" />
                                <p className="text-sm text-gray-500">
                                    <span className="font-semibold">Click to upload</span>
                                </p>
                                <p className="text-xs text-gray-500">
                                    PNG, JPG up to 2MB
                                </p>
                            </div>
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageUpload}
                                ref={fileInputRef}
                                multiple
                            />
                        </label>
                    )}
                </div>

                {errors.uploaded_images && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.uploaded_images}
                    </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                    First image will be used as primary. You can upload up to 10 images.
                </p>
            </div>

            {/* Name */}
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name *
                </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors ${errors.name ? 'border-red-300' : 'border-gray-300'
                        }`}
                    placeholder="Enter product name"
                />
                {errors.name && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.name}
                    </p>
                )}
            </div>

            {/* Description */}
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                </label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
                    placeholder="Enter product description (optional)"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Price */}
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
                            onChange={handleInputChange}
                            className={`block w-full pl-8 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors ${errors.price ? 'border-red-300' : 'border-gray-300'
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

                {/* Original Price */}
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
                            onChange={handleInputChange}
                            className={`block w-full pl-8 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors ${errors.original_price ? 'border-red-300' : 'border-gray-300'
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

                {/* Condition */}
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

                {/* Stock */}
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
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors ${errors.stock ? 'border-red-300' : 'border-gray-300'
                            }`}
                        placeholder="0"
                    />
                    {errors.stock && (
                        <p className="mt-2 text-sm text-red-600 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {errors.stock}
                        </p>
                    )}
                </div>

                {/* Category */}
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                        Category *
                    </label>
                    <input
                        type="number"
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        min="1"
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors ${errors.category ? 'border-red-300' : 'border-gray-300'
                            }`}
                        placeholder="Category ID"
                    />
                    {errors.category && (
                        <p className="mt-2 text-sm text-red-600 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {errors.category}
                        </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                        Enter the numeric ID of the category
                    </p>
                </div>

                {/* Rating */}
                <div>
                    <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-2">
                        Initial Rating (optional)
                    </label>
                    <input
                        type="text"
                        id="rating"
                        name="rating"
                        value={formData.rating}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
                        placeholder="0.0 to 5.0"
                    />
                </div>
            </div>

            {/* Toggles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="is_featured"
                        name="is_featured"
                        checked={formData.is_featured}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-primary rounded focus:ring-primary/50 border-gray-300"
                    />
                    <label htmlFor="is_featured" className="ml-2 block text-sm text-gray-700">
                        Feature this product
                    </label>
                </div>

                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="is_active"
                        name="is_active"
                        checked={formData.is_active}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-primary rounded focus:ring-primary/50 border-gray-300"
                    />
                    <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
                        Product is active
                    </label>
                </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
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
                        <>
                            <PlusCircle className="w-5 h-5 mr-2" />
                            Add Product
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}