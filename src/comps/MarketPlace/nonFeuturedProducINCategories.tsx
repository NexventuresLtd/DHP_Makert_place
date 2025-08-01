import React, { useState, useEffect, useCallback } from 'react';
import { Heart, Star, ShoppingCart, Sparkles, X, Filter, Sliders, Info, Package, Minus, Plus } from 'lucide-react';
import type { Category, Product } from '../../types/marketTypes';
import { fetchFilteredProducts } from '../../app/utlis/GetProductUtils';
import { addItemToCart } from '../../app/utlis/addToCartUtil';

interface ProductsShowcaseProps {
    data: Category;
}

const ProductsShowcase: React.FC<ProductsShowcaseProps> = ({ data }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [likedProducts, setLikedProducts] = useState<Set<number>>(new Set());
    const [activeFilter, setActiveFilter] = useState<string>('all');
    const [showFilters, setShowFilters] = useState(false);
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
    const [sortOption, setSortOption] = useState<string>('featured');
    const [quantity, setQuantity] = useState(1);
    const [cartLoading, setCartLoading] = useState(false);

    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            const fetchedProducts = await fetchFilteredProducts({ category: data.slug });
            setProducts(fetchedProducts);
            setFilteredProducts(fetchedProducts);
        } catch (err) {
            setError('Failed to fetch products. Please try again later.');
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    }, [data.slug]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    // Apply filters and sorting
    useEffect(() => {
        let result = [...products];

        // Apply category filter
        if (activeFilter !== 'all') {
            result = result.filter(product => {
                if (activeFilter === 'featured') return product.is_featured;
                if (activeFilter === 'new') {
                    const oneWeekAgo = new Date();
                    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                    return new Date(product.created_at) > oneWeekAgo;
                }
                if (activeFilter === 'discounted') {
                    return parseFloat(product.original_price) > parseFloat(product.price);
                }
                return true;
            });
        }

        // Apply price filter
        result = result.filter(product => {
            const price = parseFloat(product.price);
            return price >= priceRange[0] && price <= priceRange[1];
        });

        // Apply sorting
        result.sort((a, b) => {
            if (sortOption === 'price-low') {
                return parseFloat(a.price) - parseFloat(b.price);
            }
            if (sortOption === 'price-high') {
                return parseFloat(b.price) - parseFloat(a.price);
            }
            if (sortOption === 'newest') {
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            }
            if (sortOption === 'rating') {
                return parseFloat(b.rating) - parseFloat(a.rating);
            }
            // Default: featured first
            return b.is_featured ? 1 : -1;
        });

        setFilteredProducts(result);
    }, [products, activeFilter, priceRange, sortOption]);

    const toggleLike = (productId: number) => {
        setLikedProducts(prev => {
            const newLiked = new Set(prev);
            newLiked.has(productId) ? newLiked.delete(productId) : newLiked.add(productId);
            return newLiked;
        });
    };

    const calculateDiscount = (original: string, current: string) => {
        const originalPrice = parseFloat(original);
        const currentPrice = parseFloat(current);
        return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
    };

    const formatPrice = (price: string) => {
        return new Intl.NumberFormat('rw-RW', {
            style: 'currency',
            currency: 'RWF',
            minimumFractionDigits: 0,
        }).format(parseFloat(price));
    };

    const getStockStatus = (stock: number) => {
        if (stock > 10) return { text: 'In Stock', class: 'text-green-600 bg-green-50' };
        if (stock > 0) return { text: `${stock} left`, class: 'text-yellow-600 bg-yellow-50' };
        return { text: 'Out of Stock', class: 'text-red-600 bg-red-50' };
    };

    const handleAddToCart = async (product: Product, qty: number = 1) => {
        setCartLoading(true);
        try {
            const result = await addItemToCart(product.id, qty);
            if (result.status) {
                alert(`${qty} ${product.name} added to cart`);
            } else {
                alert(`Failed to add ${product.name} to cart: ${result.message}`);
            }
        } catch (err) {
            alert('Error adding to cart. Please try again.');
            console.error('Cart error:', err);
        } finally {
            setCartLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-[400px] flex items-center justify-center text-center p-6">
                <div>
                    <p className="text-red-500 mb-4">{error}</p>
                    <button
                        onClick={fetchProducts}
                        className="px-6 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="min-h-[400px] flex items-center justify-center text-center p-6">
                <div>
                    <Package className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-gray-800 mb-1">No products found</h3>
                    <p className="text-gray-500">This category is currently empty</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50">
            {/* Floating Filter Bar */}
            <div className="sticky top-0 z-20 bg-white border-b border-gray-100 py-3 px-6">
                <div className="max-w-full md:max-w-11/12 mx-auto flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="hidden md:block w-10 h-10 rounded-lg overflow-hidden">
                            <img
                                src={data.image}
                                alt={data.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <h1 className="text-xl font-bold text-gray-900">{data.name}</h1>
                    </div>

                    <div className="flex items-center space-x-3">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center space-x-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                        >
                            <Filter className="w-4 h-4" />
                            <span className="text-sm">Filters</span>
                        </button>

                        <div className="relative">
                            <select
                                value={sortOption}
                                onChange={(e) => setSortOption(e.target.value)}
                                className="appearance-none pl-3 pr-8 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors cursor-pointer"
                            >
                                <option value="featured">Featured</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="newest">Newest</option>
                                <option value="rating">Top Rated</option>
                            </select>
                            <Sliders className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter Panel */}
            {showFilters && (
                <div className="bg-white border-b border-gray-100 py-4 px-6">
                    <div className="max-w-full md:max-w-11/12 mx-auto">
                        <div className="flex flex-wrap items-center gap-4">
                            <button
                                onClick={() => setActiveFilter('all')}
                                className={`px-4 py-1.5 rounded-full text-sm transition-colors ${activeFilter === 'all' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                            >
                                All Products
                            </button>
                            <button
                                onClick={() => setActiveFilter('featured')}
                                className={`px-4 py-1.5 rounded-full text-sm transition-colors ${activeFilter === 'featured' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                            >
                                Featured
                            </button>
                            <button
                                onClick={() => setActiveFilter('new')}
                                className={`px-4 py-1.5 rounded-full text-sm transition-colors ${activeFilter === 'new' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                            >
                                New Arrivals
                            </button>
                            <button
                                onClick={() => setActiveFilter('discounted')}
                                className={`px-4 py-1.5 rounded-full text-sm transition-colors ${activeFilter === 'discounted' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                            >
                                On Sale
                            </button>

                            <div className="flex-1 min-w-[200px]">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
                                <div className="flex items-center space-x-3">
                                    <input
                                        type="range"
                                        min="0"
                                        max="100000"
                                        step="1000"
                                        value={priceRange[0]}
                                        onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                                        className="w-full"
                                    />
                                    <span className="text-sm whitespace-nowrap">
                                        {formatPrice(priceRange[0].toString())} - {formatPrice(priceRange[1].toString())}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="max-w-full md:max-w-11/12 mx-auto px-6 py-8">
                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map(product => (
                        <div
                            key={product.id}
                            className="bg-white rounded-xl border border-gray-100 overflow-hidden group"
                        >
                            {/* Product Image */}
                            <div
                                className="relative aspect-square overflow-hidden cursor-pointer"
                                onClick={() => setSelectedProduct(product)}
                            >
                                <img
                                    src={product.images.find(img => img.is_primary)?.image || product.images[0]?.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />

                                {/* Badges */}
                                <div className="absolute top-2 left-2 flex flex-col space-y-1">
                                    {product.is_featured && (
                                        <div className="bg-purple-500 text-white px-2 py-1 text-xs rounded-full flex items-center">
                                            <Sparkles className="w-3 h-3 mr-1" />
                                            <span>Featured</span>
                                        </div>
                                    )}
                                    {parseFloat(product.original_price) > parseFloat(product.price) && (
                                        <div className="bg-primary text-white px-2 py-1 text-xs rounded-full">
                                            {calculateDiscount(product.original_price, product.price)}% OFF
                                        </div>
                                    )}
                                </div>

                                {/* Quick View */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                                    <button className="bg-white text-primary px-4 py-2 rounded-full text-sm font-medium flex items-center">
                                        <Info className="w-4 h-4 mr-1" />
                                        Quick View
                                    </button>
                                </div>
                            </div>

                            {/* Product Info */}
                            <div className="p-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3
                                            className="font-medium text-gray-900 line-clamp-1 cursor-pointer hover:text-primary"
                                            onClick={() => setSelectedProduct(product)}
                                        >
                                            {product.name}
                                        </h3>
                                        <p className="text-gray-500 text-xs line-clamp-2 mt-1">{product.description}</p>
                                    </div>
                                    <button
                                        onClick={() => toggleLike(product.id)}
                                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                                    >
                                        <Heart
                                            className={`w-5 h-5 ${likedProducts.has(product.id) ? 'fill-red-500 text-red-500' : ''}`}
                                        />
                                    </button>
                                </div>

                                {/* Rating */}
                                <div className="flex items-center mt-2">
                                    <div className="flex mr-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-3 h-3 ${i < Math.floor(parseFloat(product.rating)) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-xs text-gray-500">({product.review_count})</span>
                                </div>

                                {/* Price and Stock */}
                                <div className="mt-3 flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <span className="text-lg font-bold text-primary">
                                            {formatPrice(product.price)}
                                        </span>
                                        {parseFloat(product.original_price) > parseFloat(product.price) && (
                                            <span className="text-xs text-gray-400 line-through">
                                                {formatPrice(product.original_price)}
                                            </span>
                                        )}
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded-full ${getStockStatus(product.stock).class}`}>
                                        {getStockStatus(product.stock).text}
                                    </span>
                                </div>

                                {/* Actions */}
                                <div className="mt-4 grid grid-cols-2 gap-2">
                                    <button
                                        className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded transition-colors"
                                        onClick={() => setSelectedProduct(product)}
                                    >
                                        Details
                                    </button>
                                    <button
                                        className="text-xs bg-primary hover:bg-primary/90 text-white py-2 rounded transition-colors flex items-center justify-center"
                                        disabled={product.stock <= 0 || cartLoading}
                                        onClick={() => handleAddToCart(product, 1)}
                                    >
                                        {cartLoading ? (
                                            <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <ShoppingCart className="w-3 h-3 mr-1" />
                                                Add to Cart
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {filteredProducts.length === 0 && (
                    <div className="text-center py-12">
                        <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <h3 className="text-lg font-medium text-gray-800 mb-1">No products match your filters</h3>
                        <p className="text-gray-500 mb-4">Try adjusting your search criteria</p>
                        <button
                            onClick={() => {
                                setActiveFilter('all');
                                setPriceRange([0, 100000]);
                            }}
                            className="px-4 py-2 bg-primary text-white rounded-full text-sm hover:bg-primary/90 transition-colors"
                        >
                            Reset Filters
                        </button>
                    </div>
                )}
            </div>

            {/* Product Detail Modal */}
            {selectedProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
                    <div className="relative bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto border border-gray-100">
                        <button
                            onClick={() => {
                                setSelectedProduct(null);
                                setQuantity(1);
                            }}
                            className="absolute top-4 right-4 z-10 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-600" />
                        </button>

                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Product Gallery */}
                            <div className="sticky top-0 p-6">
                                <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden mb-4">
                                    <img
                                        src={selectedProduct.images.find(img => img.is_primary)?.image || selectedProduct.images[0]?.image}
                                        alt={selectedProduct.name}
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                                <div className="grid grid-cols-4 gap-3">
                                    {selectedProduct.images.slice(0, 4).map((img, index) => (
                                        <div
                                            key={index}
                                            className="aspect-square bg-gray-100 rounded overflow-hidden cursor-pointer hover:border-2 hover:border-primary transition-all"
                                            onClick={() => {
                                                // Swap with primary image
                                                const newImages = [...selectedProduct.images];
                                                [newImages[0], newImages[index]] = [newImages[index], newImages[0]];
                                                setSelectedProduct({ ...selectedProduct, images: newImages });
                                            }}
                                        >
                                            <img
                                                src={img.image}
                                                alt={`${selectedProduct.name} ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Product Details */}
                            <div className="p-6">
                                <div className="mb-6">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-900">{selectedProduct.name}</h2>
                                            <div className="flex items-center mt-2">
                                                <div className="flex mr-2">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`w-4 h-4 ${i < Math.floor(parseFloat(selectedProduct.rating)) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                                                        />
                                                    ))}
                                                </div>
                                                <span className="text-sm text-gray-600">
                                                    {selectedProduct.rating} ({selectedProduct.review_count} reviews)
                                                </span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => toggleLike(selectedProduct.id)}
                                            className={`p-2 rounded-full ${likedProducts.has(selectedProduct.id) ? 'text-red-500' : 'text-gray-400 hover:text-red-500'} transition-colors`}
                                        >
                                            <Heart
                                                className={`w-5 h-5 ${likedProducts.has(selectedProduct.id) ? 'fill-red-500' : ''}`}
                                            />
                                        </button>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <div className="flex items-baseline space-x-3">
                                        <span className="text-2xl font-bold text-primary">
                                            {formatPrice(selectedProduct.price)}
                                        </span>
                                        {parseFloat(selectedProduct.original_price) > parseFloat(selectedProduct.price) && (
                                            <span className="text-gray-400 line-through">
                                                {formatPrice(selectedProduct.original_price)}
                                            </span>
                                        )}
                                    </div>
                                    {parseFloat(selectedProduct.original_price) > parseFloat(selectedProduct.price) && (
                                        <span className="inline-block mt-1 bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                                            Save {calculateDiscount(selectedProduct.original_price, selectedProduct.price)}%
                                        </span>
                                    )}
                                </div>

                                <div className="mb-6">
                                    <h3 className="font-medium text-gray-900 mb-2">Description</h3>
                                    <p className="text-gray-600">{selectedProduct.description}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="border border-gray-100 rounded-lg p-3">
                                        <h4 className="text-xs text-gray-500 mb-1">Condition</h4>
                                        <p className="font-medium capitalize">{selectedProduct.condition}</p>
                                    </div>
                                    <div className="border border-gray-100 rounded-lg p-3">
                                        <h4 className="text-xs text-gray-500 mb-1">Availability</h4>
                                        <p className={`font-medium ${selectedProduct.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {selectedProduct.stock > 0 ? `${selectedProduct.stock} in stock` : 'Out of stock'}
                                        </p>
                                    </div>
                                    <div className="border border-gray-100 rounded-lg p-3">
                                        <h4 className="text-xs text-gray-500 mb-1">Category</h4>
                                        <p className="font-medium">{data.name}</p>
                                    </div>
                                    <div className="border border-gray-100 rounded-lg p-3">
                                        <h4 className="text-xs text-gray-500 mb-1">Added</h4>
                                        <p className="font-medium">
                                            {new Date(selectedProduct.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                {/* Quantity Selector */}
                                <div className="mb-6">
                                    <h4 className="text-xs text-gray-500 mb-2">Quantity</h4>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                                            className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded"
                                            disabled={quantity <= 1}
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="w-10 text-center">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(prev => Math.min(selectedProduct.stock, prev + 1))}
                                            className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded"
                                            disabled={quantity >= selectedProduct.stock}
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="flex space-x-4">
                                    <button
                                        onClick={() => handleAddToCart(selectedProduct, quantity)}
                                        disabled={selectedProduct.stock <= 0 || cartLoading}
                                        className="flex-1 bg-primary hover:bg-primary/90 text-white py-3 px-6 rounded-lg flex items-center justify-center space-x-2 transition-colors"
                                    >
                                        {cartLoading ? (
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <ShoppingCart className="w-5 h-5" />
                                                <span>Add to Cart ({quantity})</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductsShowcase;