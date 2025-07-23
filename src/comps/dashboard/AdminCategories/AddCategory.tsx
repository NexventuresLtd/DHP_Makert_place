import { useState, useEffect } from "react";
import { PlusCircle, Image, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import mainAxios from "../../Instance/mainAxios";

interface CategoryFormData {
    id?: number;
    name: string;
    slug: string;
    description: string;
    image: string;
}

interface FormErrors {
    name?: string;
    slug?: string;
    description?: string;
    image?: string;
    general?: string;
}

interface AddCategoryFormProps {
    categoryToEdit?: CategoryFormData;
    handleCategoryAdded: () => void;
    onCancel?: () => void;
}

export default function AddCategoryForm({ 
    categoryToEdit, 
    handleCategoryAdded,
    onCancel 
}: AddCategoryFormProps) {
    const [formData, setFormData] = useState<CategoryFormData>({
        name: "",
        slug: "",
        description: "",
        image: ""
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);

    // Initialize form when categoryToEdit changes
    useEffect(() => {
        if (categoryToEdit) {
            setFormData({
                name: categoryToEdit.name,
                slug: categoryToEdit.slug,
                description: categoryToEdit.description,
                image: categoryToEdit.image
            });
            setImagePreview(categoryToEdit.image);
            setIsEditMode(true);
        } else {
            resetForm();
            setIsEditMode(false);
        }
    }, [categoryToEdit]);

    const generateSlug = (name: string) => {
        const randomString = Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15);
        const baseSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        return `${baseSlug}_${randomString}`;
    };

    const resetForm = () => {
        setFormData({
            name: "",
            slug: "",
            description: "",
            image: ""
        });
        setImagePreview(null);
        setErrors({});
        setSuccessMessage("");
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Auto-generate slug when name changes (only in add mode)
        if (name === "name" && !isEditMode) {
            setFormData(prev => ({
                ...prev,
                slug: generateSlug(value)
            }));
        }

        // Clear errors when typing
        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined,
                general: undefined
            }));
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Basic image validation
            if (!file.type.match('image.*')) {
                setErrors(prev => ({
                    ...prev,
                    image: "Please select a valid image file"
                }));
                return;
            }

            if (file.size > 2 * 1024 * 1024) { // 2MB limit
                setErrors(prev => ({
                    ...prev,
                    image: "Image size must be less than 2MB"
                }));
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
                setFormData(prev => ({
                    ...prev,
                    image: reader.result as string
                }));
            };
            reader.readAsDataURL(file);

            // Clear image error
            setErrors(prev => ({
                ...prev,
                image: undefined,
                general: undefined
            }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Category name is required";
        } else if (formData.name.length < 3) {
            newErrors.name = "Name must be at least 3 characters";
        }

        if (!formData.slug.trim()) {
            newErrors.slug = "Slug is required";
        } else if (!/^[a-z0-9-_]+$/i.test(formData.slug)) {
            newErrors.slug = "Slug can only contain letters, numbers, hyphens and underscores";
        }

        if (!formData.image) {
            newErrors.image = "Category image is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSuccessMessage("");
        let response;

        if (validateForm()) {
            setIsLoading(true);

            try {
                if (isEditMode && categoryToEdit) {
                    // Update existing category
                    response = await mainAxios.put(`/market/categories/${categoryToEdit.id}/`, formData);
                    setSuccessMessage("Category updated successfully!");
                } else {
                    // Create new category
                    response = await mainAxios.post("/market/categories/", formData);
                    setSuccessMessage("Category added successfully!");
                }

                // Clear form if not in edit mode
                if (!isEditMode) {
                    resetForm();
                }

                // Clear success message after 5 seconds and trigger callback
                setTimeout(() => {
                    setSuccessMessage("");
                    handleCategoryAdded();
                }, 1000);
                console.log("Product response:", response.data); // 👈 use it!
            } catch (error: any) {
                console.error(isEditMode ? "Error updating category:" : "Error adding category:", error);

                if (error.response) {
                    // Handle API validation errors
                    if (error.response.data) {
                        const apiErrors = error.response.data;
                        const fieldErrors: FormErrors = {};

                        if (apiErrors.name) fieldErrors.name = apiErrors.name.join(" ");
                        if (apiErrors.slug) fieldErrors.slug = apiErrors.slug.join(" ");
                        if (apiErrors.image) fieldErrors.image = apiErrors.image.join(" ");

                        setErrors(fieldErrors);
                    } else {
                        setErrors({
                            general: isEditMode 
                                ? "Failed to update category. Please try again."
                                : "Failed to add category. Please try again."
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
        <div className="p-6 md:p-8">
            {/* Success Message */}
            {successMessage && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start fixed top-4 right-4 z-50 shadow-lg">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                        <p className="text-green-700 font-medium">{successMessage}</p>
                        <p className="text-green-600 text-sm mt-1">
                            {isEditMode 
                                ? "The category has been updated successfully."
                                : "The category has been added to your marketplace."}
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
                {/* Name Field */}
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Category Name *
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
                        placeholder="e.g. Electronics, Clothing"
                    />
                    {errors.name && (
                        <p className="mt-2 text-sm text-red-600 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {errors.name}
                        </p>
                    )}
                </div>

                {/* Slug Field */}
                <div>
                    <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
                        URL Slug *
                    </label>
                    <div className="flex items-center">
                        <span className="bg-gray-100 px-3 py-3 border border-r-0 rounded-l-lg text-gray-500">
                            /categories/
                        </span>
                        <input
                            type="text"
                            id="slug"
                            name="slug"
                            value={formData.slug}
                            onChange={handleInputChange}
                            className={`flex-1 px-4 py-3 border rounded-r-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors ${
                                errors.slug ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder="auto-generated-slug"
                            readOnly={isEditMode} // Slug should not be editable in edit mode
                        />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                        This will be used in the category URL. Only letters, numbers, hyphens and underscores are allowed.
                    </p>
                    {errors.slug && (
                        <p className="mt-2 text-sm text-red-600 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {errors.slug}
                        </p>
                    )}
                </div>

                {/* Description Field */}
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
                        placeholder="A brief description of this category (optional)"
                    />
                </div>

                {/* Image Upload */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category Image *
                    </label>

                    {imagePreview ? (
                        <div className="mb-4">
                            <div className="relative w-full max-w-xs">
                                <img
                                    src={imagePreview}
                                    alt="Category preview"
                                    className="rounded-lg border border-gray-200 w-full h-48 object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setImagePreview(null);
                                        setFormData(prev => ({ ...prev, image: "" }));
                                    }}
                                    className="absolute top-2 right-2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-1.5 shadow-sm transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
                                <Image className="w-10 h-10 mb-3 text-gray-400" />
                                <p className="mb-2 text-sm text-gray-500">
                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs text-gray-500">
                                    PNG, JPG up to 2MB
                                </p>
                            </div>
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </label>
                    )}

                    {errors.image && (
                        <p className="mt-2 text-sm text-red-600 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {errors.image}
                        </p>
                    )}
                </div>

                {/* Form Actions */}
                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={() => {
                            if (onCancel) {
                                onCancel();
                            } else {
                                resetForm();
                            }
                        }}
                        className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        disabled={isLoading}
                    >
                        {onCancel ? 'Cancel' : 'Reset Form'}
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <PlusCircle className="w-5 h-5 mr-2" />
                                {isEditMode ? 'Update Category' : 'Add Category'}
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}