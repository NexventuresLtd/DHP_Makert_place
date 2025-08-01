import { useState, useEffect } from 'react';
import { Star, ShoppingCart, Eye, Grid, List, Loader2, X } from 'lucide-react';
import type { Product } from '../../types/marketTypes';
import mainAxios from '../Instance/mainAxios';
import ProductDetailModal from '../dashboard/AdminProduct/ViewMoreDetails';

interface ProductSearchProps {
    searchTerm: string;
    selectedCategory: string;
    // onProductSelect?: (product: Product) => void;
    onClose?: () => void;
}


export default function ProductSearch({ searchTerm, selectedCategory, onClose }: ProductSearchProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [totalCount, setTotalCount] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const performSearch = async (search: string, category: string) => {
        setLoading(true);
        try {
            const filters: any = {};
            if (search.trim()) filters.search = search.trim();
            if (category) filters.category = category;

            const response = await mainAxios.get('/market/products/', {
                params: {
                    category: category.toLocaleLowerCase(),
                    search: search.toLocaleLowerCase()
                }
            });
            console.log('Search response:', response);
            setProducts(response.data || []);
            setTotalCount(response.data.length || 0);
        } catch (error) {
            console.error('Search failed:', error);
            setProducts([]);
            setTotalCount(0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        performSearch(searchTerm, selectedCategory);
    }, [searchTerm, selectedCategory]);

    const formatPrice = (price: string) => {
        return new Intl.NumberFormat('en-RW', {
            style: 'currency',
            currency: 'RWF',
            minimumFractionDigits: 0
        }).format(parseInt(price));
    };

    const getConditionColor = (condition: string) => {
        switch (condition) {
            case 'new': return 'bg-green-100 text-green-800 border-green-200';
            case 'used': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'refurbished': return 'bg-blue-100 text-blue-800 border-blue-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const ProductCard = ({ product }: { product: Product }) => {
        const primaryImage = product.images.find(img => img.is_primary) || product.images[0];

        return (
            <div className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-blue-200 hover:-translate-y-1">
                {/* Product Image */}
                <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                    <img
                        src={primaryImage?.image || '/api/placeholder/300/300'}
                        alt={product.name}
                        className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-700"
                    />

                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                        {product.is_featured && (
                            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                                ✨ Featured
                            </span>
                        )}
                        <span className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize border ${getConditionColor(product.condition)} backdrop-blur-sm`}>
                            {product.condition}
                        </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                        {/* <button className="w-11 h-11 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-300">
              <Heart className="w-5 h-5 text-gray-600 hover:text-red-500" />
            </button> */}
                        <button
                            onClick={() => {
                                setSelectedProduct(product);
                                setIsModalOpen(true);
                            }}
                            className="w-11 h-11 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-300"
                        >
                            <Eye className="w-5 h-5 text-gray-600 hover:text-blue-600" />
                        </button>
                    </div>

                    {/* Discount Badge */}
                    {product.original_price !== product.price && (
                        <div className="absolute bottom-4 left-4">
                            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                                {Math.round((1 - parseInt(product.price) / parseInt(product.original_price)) * 100)}% OFF
                            </span>
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="p-6 space-y-4">
                    <div>
                        <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                            {product.name}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">{product.description}</p>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-4 h-4 ${i < Math.floor(parseFloat(product.rating))
                                            ? 'text-yellow-400 fill-current'
                                            : 'text-gray-300'
                                            }`}
                                    />
                                ))}
                            </div>
                            <span className="text-sm text-gray-600 font-medium">
                                {product.rating} ({product.review_count})
                            </span>
                        </div>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                            {product.sales} sold
                        </span>
                    </div>

                    {/* Price */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl font-bold text-gray-900">
                                {formatPrice(product.price)}
                            </span>
                            {product.original_price !== product.price && (
                                <span className="text-lg text-gray-500 line-through">
                                    {formatPrice(product.original_price)}
                                </span>
                            )}
                        </div>

                        {/* Stock Status */}
                        <div className="flex items-center justify-between">
                            <span className={`text-sm font-semibold px-3 py-1 rounded-full ${product.stock > 10 ? 'text-green-600 bg-green-50' :
                                product.stock > 0 ? 'text-yellow-600 bg-yellow-50' : 'text-red-600 bg-red-50'
                                }`}>
                                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                            </span>
                        </div>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                        onClick={() => {
                            setSelectedProduct(product);
                            setIsModalOpen(true);
                        }}
                        disabled={product.stock === 0}
                        className="w-full bg-second text-white py-3.5 rounded-xl font-semibold hover:from-blue-700 hover:to-green-700 transition-all duration-300 flex items-center justify-center gap-2 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed shadow-lg hover:shadow-xl disabled:shadow-none transform hover:scale-[1.02] disabled:transform-none"
                    >
                        <ShoppingCart className="w-5 h-5" />
                        {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                </div>
            </div>
        );
    };

    const ListProductCard = ({ product }: { product: Product }) => {
        const primaryImage = product.images.find(img => img.is_primary) || product.images[0];

        return (
            <div className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200">

                <div className="flex flex-col md:flex-row">
                    {/* Image */}
                    <div className="relative w-full md:w-80 h-64 md:h-48 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                        <img
                            src={primaryImage?.image || '/api/placeholder/300/300'}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />

                        {/* Badges */}
                        <div className="absolute top-3 left-3 flex gap-2">
                            {product.is_featured && (
                                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                                    Featured
                                </span>
                            )}
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${getConditionColor(product.condition)}`}>
                                {product.condition}
                            </span>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-6 flex flex-col justify-between">
                        <div>
                            <h3 className="font-bold text-xl text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                                {product.name}
                            </h3>
                            <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>

                            {/* Rating & Sales */}
                            <div className="flex items-center gap-4 mb-4">
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-4 h-4 ${i < Math.floor(parseFloat(product.rating))
                                                ? 'text-yellow-400 fill-current'
                                                : 'text-gray-300'
                                                }`}
                                        />
                                    ))}
                                    <span className="text-sm text-gray-600 ml-1">
                                        {product.rating} ({product.review_count})
                                    </span>
                                </div>
                                <span className="text-sm text-gray-500">
                                    {product.sales} sold
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            {/* Price */}
                            <div className="flex items-center gap-3">
                                <span className="text-2xl font-bold text-gray-900">
                                    {formatPrice(product.price)}
                                </span>
                                {product.original_price !== product.price && (
                                    <span className="text-lg text-gray-500 line-through">
                                        {formatPrice(product.original_price)}
                                    </span>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-3">
                                <span className={`text-sm font-semibold px-3 py-1 rounded-full ${product.stock > 10 ? 'text-green-600 bg-green-50' :
                                    product.stock > 0 ? 'text-yellow-600 bg-yellow-50' : 'text-red-600 bg-red-50'
                                    }`}>
                                    {product.stock > 0 ? `${product.stock} left` : 'Out of stock'}
                                </span>

                                <button
                                    onClick={() => {
                                        setSelectedProduct(product);
                                        setIsModalOpen(true);
                                        alert()
                                    }}
                                    disabled={product.stock === 0}
                                    className="bg-second text-white px-6 py-2.5 rounded-xl font-semibold hover:from-blue-700 hover:to-green-700 transition-all duration-300 flex items-center gap-2 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed"
                                >
                                    <ShoppingCart className="w-4 h-4" />
                                    {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="w-full bg-gray-50 min-h-screen">
            {/* Modal */}
            {selectedProduct && isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 h-screen w-screen">
                    <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-200">
                        <ProductDetailModal
                            product={selectedProduct}
                            onClose={() => setIsModalOpen(false)}
                        />
                    </div>
                </div>
            )}
            <div className="max-w-full md:max-w-11/12 mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Results Header */}
                <button title='Close Search' onClick={() => { onClose && onClose() }} className='cursor-pointer p-2 bg-red-500 rounded-full shadow-md hover:shadow-lg transition-shadow duration-300'>
                    <X className="w-5 h-5 text-white" />
                </button>
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <h2 className="text-2xl font-bold text-gray-900">
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                                    Searching...
                                </div>
                            ) : (
                                `${totalCount} Products Found`
                            )}
                        </h2>
                        {(searchTerm || selectedCategory) && !loading && (
                            <div className="text-gray-600">
                                {searchTerm && (
                                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mr-2">
                                        "{searchTerm}"
                                    </span>
                                )}
                                {selectedCategory && (
                                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                                        Category: {selectedCategory}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    {/* View Mode Toggle */}
                    {!loading && products.length > 0 && (
                        <>
                            <div className="flex items-center bg-white rounded-xl shadow-md p-1 border border-gray-200">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-3 rounded-lg transition-all duration-300 ${viewMode === 'grid'
                                        ? 'bg-second text-white shadow-md'
                                        : 'text-gray-600 hover:text-gray-800'
                                        }`}
                                >
                                    <Grid className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-3 rounded-lg transition-all duration-300 ${viewMode === 'list'
                                        ? 'bg-second text-white shadow-md'
                                        : 'text-gray-600 hover:text-gray-800'
                                        }`}
                                >
                                    <List className="w-5 h-5" />
                                </button>
                            </div>
                        </>
                    )}
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl shadow-md overflow-hidden animate-pulse">
                                <div className="h-72 bg-gray-200"></div>
                                <div className="p-6 space-y-4">
                                    <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                                    <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                                    <div className="h-12 bg-gray-200 rounded"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Products Display */}
                {!loading && products.length > 0 && (
                    <>

                        <div className={`gap-8 ${viewMode === 'grid'
                            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                            : 'flex flex-col space-y-6'
                            }`}>

                            {products.map(product =>
                                viewMode === 'grid' ? (
                                    <ProductCard key={product.id} product={product} />
                                ) : (
                                    <ListProductCard key={product.id} product={product} />
                                )
                            )}
                        </div>
                    </>
                )}

                {/* No Results */}
                {!loading && products.length === 0 && (
                    <div className="text-center py-20">
                        <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
                            <div onClick={() => {
                                setSelectedProduct(null);
                                setIsModalOpen(true);
                            }} className="w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                                <Eye className="w-8 h-8 text-white" />
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">No products found</h3>
                        <p className="text-gray-600 text-lg max-w-md mx-auto">
                            We couldn't find any products matching your search criteria. Try different keywords or browse our categories.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}