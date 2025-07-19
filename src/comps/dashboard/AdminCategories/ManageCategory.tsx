import { useState, useEffect } from "react";
import { PlusCircle, Edit, Trash2, Image as ImageIcon, Loader2, ChevronLeft, ChevronRight, AlertCircle, Eye } from "lucide-react";
import mainAxios from "../../Instance/mainAxios";
import AddCategoryForm from "./AddCategory";
import CategoryDetailModal from "./ViewMoreDetails";

interface Category {
    id: number;
    name: string;
    slug: string;
    description: string;
    image: string;
}

export default function CategoriesDashboard() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 8;
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [editCategory, setEditCategory] = useState<Category | null>(null);
    // Fetch categories from API
    const fetchCategories = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await mainAxios.get("/market/categories/");
            setCategories(response.data);
            setTotalPages(Math.ceil(response.data.length / itemsPerPage));
        } catch (err) {
            console.error("Failed to fetch categories:", err);
            setError("Failed to load categories. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // Handle category deletion
    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this category?")) return;

        try {
            await mainAxios.delete(`/market/categories/${id}/`);
            setCategories(categories.filter(cat => cat.id !== id));
            // Show success message or refresh list
            fetchCategories();
        } catch (err) {
            console.error("Failed to delete category:", err);
            setError("Failed to delete category. Please try again.");
        }
    };

    // Handle successful category addition
    const handleCategoryAdded = () => {
        setIsModalOpen(false);
        fetchCategories(); // Refresh the list
    };

    // Pagination logic
    const paginatedCategories = categories.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header with Add Button */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Product Categories</h1>
                    <p className="text-gray-600">Manage your marketplace categories</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg transition-colors"
                >
                    <PlusCircle size={18} />
                    Add New Category
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
                    <AlertCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                    <p className="text-red-700">{error}</p>
                </div>
            )}

            {/* Loading State */}
            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
            ) : (
                <>
                    {/* Categories Table */}
                    <div className="bg-white rounded-xl shadow overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Image
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Name
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Slug
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Description
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {paginatedCategories.length > 0 ? (
                                        paginatedCategories.map((category) => (
                                            <tr key={category.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        {category.image ? (
                                                            <img
                                                                className="h-10 w-10 rounded-md object-cover"
                                                                src={category.image}
                                                                alt={category.name}
                                                                onError={(e) => {
                                                                    (e.target as HTMLImageElement).src = "https://via.placeholder.com/40";
                                                                }}
                                                            />
                                                        ) : (
                                                            <div className="h-10 w-10 rounded-md bg-gray-100 flex items-center justify-center">
                                                                <ImageIcon className="w-5 h-5 text-gray-400" />
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">{category.name}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-500">/{category.slug}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-500 truncate max-w-xs">
                                                        {category.description || "No description"}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button
                                                        onClick={() => setSelectedCategory(category)}
                                                        className="text-primary hover:text-primary mr-4 flex gap-2 items-center"
                                                        title="View details"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                        View
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                                                No categories found. Add your first category to get started.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                                <div className="flex-1 flex justify-between sm:hidden">
                                    <button
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                    >
                                        Previous
                                    </button>
                                    <button
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                    >
                                        Next
                                    </button>
                                </div>
                                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm text-gray-700">
                                            Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                                            <span className="font-medium">
                                                {Math.min(currentPage * itemsPerPage, categories.length)}
                                            </span>{' '}
                                            of <span className="font-medium">{categories.length}</span> results
                                        </p>
                                    </div>
                                    <div>
                                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                            <button
                                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                                disabled={currentPage === 1}
                                                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                            >
                                                <span className="sr-only">Previous</span>
                                                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                                            </button>
                                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                                <button
                                                    key={page}
                                                    onClick={() => setCurrentPage(page)}
                                                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === page
                                                        ? 'z-10 bg-primary border-primary text-white'
                                                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                        }`}
                                                >
                                                    {page}
                                                </button>
                                            ))}
                                            <button
                                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                                disabled={currentPage === totalPages}
                                                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                            >
                                                <span className="sr-only">Next</span>
                                                <ChevronRight className="h-5 w-5" aria-hidden="true" />
                                            </button>
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* Add Category Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center bg-primary p-6 text-white sticky top-0 z-10">
                            <div className="flex items-center">
                                <PlusCircle className="w-8 h-8 mr-3" />
                                <h2 className="text-xl font-bold">
                                    {editCategory ? 'Edit Category' : 'Add New Category'}
                                </h2>
                            </div>
                            <button
                                onClick={() => {
                                    setIsModalOpen(false);
                                    setEditCategory(null);
                                }}
                                className="text-white text-4xl hover:text-gray-200"
                            >
                                &times;
                            </button>
                        </div>
                        <div className="p-6">
                            <AddCategoryForm
                                categoryToEdit={editCategory ?? undefined}
                                handleCategoryAdded={() => {
                                    handleCategoryAdded();
                                    setIsModalOpen(false);
                                    setEditCategory(null);
                                }}
                                onCancel={() => {
                                    setIsModalOpen(false);
                                    setEditCategory(null);
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}
            {selectedCategory && (
                <CategoryDetailModal
                    category={selectedCategory}
                    onClose={() => setSelectedCategory(null)}
                    onEdit={() => {
                        setEditCategory(selectedCategory);
                        setSelectedCategory(null);
                        setIsModalOpen(true);
                    }}
                    onDelete={handleDelete}
                />
            )}

        </div>
    );
}