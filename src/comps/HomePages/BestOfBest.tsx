import { useState, useCallback, useEffect } from 'react';
import { ShoppingCart, ArrowRight } from 'lucide-react';
import type { Product } from '../../types/marketTypes';
import { fetchFilteredProducts } from '../../app/utlis/GetProductUtils';
import { Link } from 'react-router-dom';
import ProductDetailModal from '../dashboard/AdminProduct/ViewMoreDetails';


const ProductView = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            const fetchedProducts = await fetchFilteredProducts({
                is_featured: true,
            });
            setProducts(fetchedProducts);
        } catch (err) {
            setError('Failed to fetch products. Please try again later.');
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    if (loading) {
        return (
            <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-full md:max-w-11/12 mx-auto">
                    <div className="animate-pulse space-y-8">
                        <div className="h-10 bg-gray-200 rounded w-1/3 mx-auto"></div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="bg-white rounded-lg shadow p-6 space-y-4">
                                    <div className="h-48 bg-gray-200 rounded"></div>
                                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                                    <div className="h-10 bg-gray-200 rounded w-full mt-4"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto text-center">
                    <p className="text-red-500">{error}</p>
                    <button
                        onClick={fetchProducts}
                        className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="bg-gradient-to-r from-primary to-primary-dark py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-full md:max-w-11/12 mx-auto">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
                        <div className="text-center md:text-left">
                            <h2 className="text-3xl md:text-4xl font-bold text-black mb-2">
                                The Best Of Best
                            </h2>
                            <p className="text-black/80 max-w-lg">
                                Our curated selection of top-rated products, showcasing the best of the best in quality and craftsmanship. Discover unique items that stand out for their excellence and innovation.
                            </p>
                        </div>

                        <div className="flex gap-4">
                            <Link
                                to="/market"
                                className="flex items-center gap-2 px-6 py-3 bg-white text-primary font-medium rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                View All Products
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>

                    {/* Products Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {products?.map((product) => {
                            const primaryImage = product.images.find(img => img.is_primary) || product.images[0];
                            const imageUrl = primaryImage?.image || '/placeholder-product.jpg';
                            const price = parseFloat(product.price) || 0;
                            const originalPrice = parseFloat(product.original_price) || 0;
                            const hasDiscount = originalPrice > price;

                            return (
                                <div
                                    key={product.id}
                                    className="group bg-white rounded-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
                                >
                                    {/* Product Image */}
                                    <div className="relative overflow-hidden h-64">
                                        <img
                                            src={imageUrl}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                        {/* Product Badges */}
                                        <div className="absolute top-2 left-2 flex gap-2">
                                            {product.is_featured && (
                                                <span className="bg-primary text-white text-xs font-bold px-2 py-1 rounded">
                                                    Featured
                                                </span>
                                            )}
                                            {product.condition !== 'new' && (
                                                <span className="bg-gray-800 text-white text-xs font-bold px-2 py-1 rounded">
                                                    {product.condition.charAt(0).toUpperCase() + product.condition.slice(1)}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Product Content */}
                                    <div className="p-6 space-y-4">
                                        {/* Title */}
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-primary transition-colors duration-200 line-clamp-1">
                                                {product.name}
                                            </h3>
                                            <div className="flex items-center gap-1">
                                                <span className="text-yellow-500">★</span>
                                                <span className="text-sm text-gray-600">
                                                    {product.rating} ({product.review_count} reviews)
                                                </span>
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                                            {product.description}
                                        </p>

                                        {/* Price and Purchase Button */}
                                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                            <div className="flex flex-col">
                                                <div className="text-2xl font-bold text-primary">
                                                    {new Intl.NumberFormat('rw', {
                                                        style: 'currency',
                                                        currency: 'RWF',
                                                    }).format(price)}
                                                </div>
                                                {hasDiscount && (
                                                    <div className="text-sm text-gray-500 line-through">
                                                        {new Intl.NumberFormat('rw', {
                                                            style: 'currency',
                                                            currency: 'RWF',
                                                        }).format(originalPrice)}
                                                    </div>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => {
                                                    setSelectedProduct(product);
                                                    setIsModalOpen(true);
                                                }}
                                                className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-lg font-medium transition-all duration-200 hover:scale-[1.02] active:scale-95 shadow-md hovershadow-lg"
                                                aria-label={`Add ${product.name} to cart`}
                                                disabled={product.stock <= 0}
                                            >
                                                <ShoppingCart className="w-4 h-4" />
                                                <span>{product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            {/* Modal */}
            {selectedProduct && isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-200">
                        <ProductDetailModal
                            product={selectedProduct}
                            onClose={() => setIsModalOpen(false)}
                        />
                    </div>
                </div>
            )}
        </>



    );
};

export default ProductView;