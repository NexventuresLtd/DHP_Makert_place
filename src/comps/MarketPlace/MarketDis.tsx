import React, { useState, useEffect, useCallback } from 'react';
import { Heart, Star, ChevronLeft, ChevronRight, ShoppingCart, Package, TrendingUp, Eye, Loader2 } from 'lucide-react';
import type { Category, Product } from '../../types/marketTypes';
import { fetchFilteredProducts } from '../../app/utlis/GetProductUtils';

interface ProductsShowcaseProps {
  data: Category;
}

const ProductsShowcase: React.FC<ProductsShowcaseProps> = ({ data }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [likedProducts, setLikedProducts] = useState<Set<number>>(new Set());
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const ITEMS_PER_SLIDE = 3;
  const AUTO_SLIDE_INTERVAL = 5000;
  const totalSlides = Math.ceil(products.length / ITEMS_PER_SLIDE);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedProducts = await fetchFilteredProducts({
        category: data.slug,
      });
      setProducts(fetchedProducts);
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

  // Auto-slide functionality with pause on hover
  useEffect(() => {
    if (!isAutoPlaying || products.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % totalSlides);
    }, AUTO_SLIDE_INTERVAL);

    return () => clearInterval(interval);
  }, [isAutoPlaying, totalSlides, products.length]);

  const toggleLike = (productId: number) => {
    setLikedProducts(prev => {
      const newLiked = new Set(prev);
      newLiked.has(productId) ? newLiked.delete(productId) : newLiked.add(productId);
      return newLiked;
    });
  };

  const navigateSlide = (direction: 'prev' | 'next') => {
    setCurrentSlide(prev => 
      direction === 'next' 
        ? (prev + 1) % totalSlides 
        : (prev - 1 + totalSlides) % totalSlides
    );
    setIsAutoPlaying(false);
  };

  const calculateDiscount = (original: string, current: string) => {
    const originalPrice = parseFloat(original);
    const currentPrice = parseFloat(current);
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  };

  const getCategoryStats = useCallback(() => {
    const inStockCount = products.filter(p => p.stock > 0).length;
    const featuredCount = products.filter(p => p.is_featured).length;

    const ratings = products
      .map(p => parseFloat(p.rating))
      .filter(r => !isNaN(r));

    const averageRating = ratings.length > 0
      ? (ratings.reduce((acc, r) => acc + r, 0) / ratings.length).toFixed(1)
      : '0.0';

    return {
      totalProducts: products.length,
      inStock: inStockCount,
      featured: featuredCount,
      avgRating: averageRating
    };
  }, [products]);

  const renderProductCard = (product: Product) => {
    const primaryImage = product.images.find(img => img.is_primary) || product.images[0];
    const discount = calculateDiscount(product.original_price, product.price);
    const isLiked = likedProducts.has(product.id);
    const stockStatus = product.stock > 10 
      ? { text: 'In Stock', class: 'bg-green-100 text-green-700' }
      : product.stock > 0 
        ? { text: `${product.stock} left`, class: 'bg-yellow-100 text-yellow-700' }
        : { text: 'Out of Stock', class: 'bg-red-100 text-red-700' };

    return (
      <div key={product.id} className="group relative bg-white rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-200">
        {/* Product Image with Overlays */}
        <div className="relative aspect-square overflow-hidden">
          <img
            src={primaryImage?.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col space-y-2">
            {discount > 0 && (
              <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                -{discount}%
              </span>
            )}
            {product.is_featured && (
              <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                Featured
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={() => toggleLike(product.id)}
            className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:shadow-lg transition-all"
            aria-label={isLiked ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart
              size={18}
              className={`transition-colors ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-400'}`}
            />
          </button>

          {/* Quick Actions */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <button className="bg-white text-gray-900 px-4 py-2 rounded-full font-medium shadow-lg hover:bg-gray-50 transition-all flex items-center space-x-2">
              <ShoppingCart size={16} />
              <span>Add to Cart</span>
            </button>
          </div>
        </div>

        {/* Product Details */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-1 hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {product.description}
          </p>

          <div className="flex flex-col space-y-3">
            {/* Rating */}
            <div className="flex items-center space-x-1">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={`${i < Math.floor(parseFloat(product.rating)) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500">({product.review_count})</span>
            </div>

            {/* Price */}
            <div className="flex items-center justify-between">
              <div className="flex items-baseline space-x-2">
                <span className="text-lg font-bold text-gray-900">${product.price}</span>
                {parseFloat(product.original_price) > parseFloat(product.price) && (
                  <span className="text-sm text-gray-400 line-through">${product.original_price}</span>
                )}
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${stockStatus.class}`}>
                {stockStatus.text}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center py-20">
        <Loader2 className="animate-spin text-blue-500" size={32} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full text-center py-12">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={fetchProducts}
          className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Retry
        </button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="w-full text-center py-12">
        <h3 className="text-lg font-medium text-gray-600">No products available in this category</h3>
      </div>
    );
  }

  const stats = getCategoryStats();

  return (
    <div className="max-w-full md:max-w-11/12 mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Category Overview Panel */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-full flex flex-col">
            {/* Category Header */}
            <div className="relative h-56 overflow-hidden">
              <img
                src={data.image}
                alt={data.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
                <div className="absolute bottom-5 left-5 right-5">
                  <h1 className="text-2xl font-bold text-white capitalize">
                    {data.name}
                  </h1>
                  <div className="h-1 w-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mt-2"></div>
                </div>
              </div>
            </div>

            {/* Category Content */}
            <div className="p-6 flex-grow flex flex-col">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Category Overview</h3>
                <p className="text-gray-600 leading-relaxed">
                  {data.description || 'Explore our premium selection of products in this category.'}
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <StatCard 
                  icon={<Package className="text-blue-600" size={20} />} 
                  value={stats.totalProducts} 
                  label="Total Products" 
                  color="blue"
                />
                <StatCard 
                  icon={<TrendingUp className="text-green-600" size={20} />} 
                  value={stats.inStock} 
                  label="In Stock" 
                  color="green"
                />
                <StatCard 
                  icon={<Star className="text-purple-600 fill-purple-600" size={20} />} 
                  value={stats.featured} 
                  label="Featured" 
                  color="purple"
                />
                <StatCard 
                  icon={<Eye className="text-orange-600" size={20} />} 
                  value={stats.avgRating} 
                  label="Avg Rating" 
                  color="orange"
                />
              </div>

              {/* CTA Button */}
              <div className="mt-auto">
                <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:-translate-y-0.5">
                  Browse All Products
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Products Carousel */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Carousel Header */}
            <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Featured Products</h2>
                <p className="text-gray-500 text-sm">Top selections in {data.name.toLowerCase()}</p>
              </div>

              {/* Controls */}
              <div className="flex items-center space-x-3">
                <div className="flex items-center bg-gray-50 rounded-full px-1.5 py-1">
                  <NavButton 
                    direction="prev" 
                    onClick={() => navigateSlide('prev')} 
                  />
                  <PaginationDots 
                    total={totalSlides} 
                    current={currentSlide} 
                    onClick={(i) => {
                      setCurrentSlide(i);
                      setIsAutoPlaying(false);
                    }} 
                  />
                  <NavButton 
                    direction="next" 
                    onClick={() => navigateSlide('next')} 
                  />
                </div>
                <AutoPlayToggle 
                  isPlaying={isAutoPlaying} 
                  onToggle={() => setIsAutoPlaying(!isAutoPlaying)} 
                />
              </div>
            </div>

            {/* Carousel Content */}
            <div className="p-6">
              <div className="relative overflow-hidden">
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                    <div key={slideIndex} className="w-full flex-shrink-0">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {products
                          .slice(slideIndex * ITEMS_PER_SLIDE, (slideIndex + 1) * ITEMS_PER_SLIDE)
                          .map(renderProductCard)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Auto-play progress indicator */}
              {isAutoPlaying && (
                <div className="mt-6 w-full bg-gray-200 rounded-full h-1 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${((currentSlide + 1) / totalSlides) * 100}%`,
                      transition: 'width 0.5s linear'
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Stat Card Component
const StatCard: React.FC<{
  icon: React.ReactNode;
  value: string | number;
  label: string;
  color: 'blue' | 'green' | 'purple' | 'orange';
}> = ({ icon, value, label, color }) => {
  const colorClasses = {
    blue: 'from-blue-50 to-blue-100 border-blue-200 text-blue-700',
    green: 'from-green-50 to-green-100 border-green-200 text-green-700',
    purple: 'from-purple-50 to-purple-100 border-purple-200 text-purple-700',
    orange: 'from-orange-50 to-orange-100 border-orange-200 text-orange-700'
  };

  return (
    <div className={`bg-gradient-to-br rounded-lg p-3 border ${colorClasses[color]}`}>
      <div className="flex items-center justify-between mb-1">
        {icon}
        <span className="text-xs font-medium bg-white/50 px-2 py-0.5 rounded-full">
          {label.split(' ')[0]}
        </span>
      </div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs opacity-80">{label}</div>
    </div>
  );
};

// Reusable Navigation Button
const NavButton: React.FC<{
  direction: 'prev' | 'next';
  onClick: () => void;
}> = ({ direction, onClick }) => (
  <button
    onClick={onClick}
    className="p-2 hover:bg-white rounded-full transition-colors"
    aria-label={`${direction === 'prev' ? 'Previous' : 'Next'} slide`}
  >
    {direction === 'prev' ? (
      <ChevronLeft size={18} className="text-gray-600" />
    ) : (
      <ChevronRight size={18} className="text-gray-600" />
    )}
  </button>
);

// Reusable Pagination Dots
const PaginationDots: React.FC<{
  total: number;
  current: number;
  onClick: (index: number) => void;
}> = ({ total, current, onClick }) => (
  <div className="flex mx-2">
    {Array.from({ length: total }).map((_, i) => (
      <button
        key={i}
        onClick={() => onClick(i)}
        className={`w-2 h-2 mx-1 rounded-full transition-all ${i === current ? 'bg-blue-500 w-4' : 'bg-gray-300'}`}
        aria-label={`Go to slide ${i + 1}`}
      />
    ))}
  </div>
);

// Reusable Auto-play Toggle
const AutoPlayToggle: React.FC<{
  isPlaying: boolean;
  onToggle: () => void;
}> = ({ isPlaying, onToggle }) => (
  <button
    onClick={onToggle}
    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
      isPlaying 
        ? 'bg-blue-600 text-white' 
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    }`}
    aria-label={isPlaying ? 'Pause auto-play' : 'Play auto-play'}
  >
    {isPlaying ? 'Pause' : 'Play'}
  </button>
);

export default ProductsShowcase;