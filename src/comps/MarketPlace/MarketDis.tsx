import React, { useState, useEffect, useCallback } from 'react';
import { Heart, Star, ChevronLeft, ChevronRight, ShoppingCart, Package, TrendingUp, Eye, Play, Pause, Sparkles } from 'lucide-react';
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
      ? { text: 'In Stock', class: 'bg-emerald-50 text-emerald-700 border border-emerald-200' }
      : product.stock > 0 
        ? { text: `${product.stock} left`, class: 'bg-amber-50 text-amber-700 border border-amber-200' }
        : { text: 'Out of Stock', class: 'bg-red-50 text-red-700 border border-red-200' };

    return (
      <div key={product.id} className="group relative bg-white border-2 border-slate-100 rounded-3xl overflow-hidden hover:border-primary/20 transition-all duration-500">
        {/* Product Image with Overlays */}
        <div className="relative aspect-square overflow-hidden">
          <img
            src={primaryImage?.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col space-y-2">
            {discount > 0 && (
              <div className="flex items-center gap-1 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1.5 rounded-2xl text-xs font-bold">
                <span>-{discount}%</span>
              </div>
            )}
            {product.is_featured && (
              <div className="flex items-center gap-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1.5 rounded-2xl text-xs font-semibold">
                <Sparkles className="w-3 h-3" />
                <span>Featured</span>
              </div>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={() => toggleLike(product.id)}
            className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-sm rounded-2xl hover:bg-white transition-all duration-300 hover:scale-110"
            aria-label={isLiked ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart
              size={18}
              className={`transition-colors ${isLiked ? 'fill-red-500 text-red-500' : 'text-slate-400 hover:text-red-400'}`}
            />
          </button>

          {/* Quick Actions */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <button className="bg-white/95 backdrop-blur-sm text-slate-900 px-6 py-3 rounded-2xl font-semibold hover:bg-white transition-all duration-300 flex items-center space-x-2 hover:scale-105">
              <ShoppingCart size={18} />
              <span>Add to Cart</span>
            </button>
          </div>
        </div>

        {/* Product Details */}
        <div className="p-6">
          <h3 className="font-bold text-slate-800 text-lg mb-2 line-clamp-1 hover:text-primary transition-colors leading-tight">
            {product.name}
          </h3>
          <p className="text-slate-600 text-sm mb-4 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          <div className="flex flex-col space-y-4">
            {/* Rating */}
            <div className="flex items-center space-x-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={`${i < Math.floor(parseFloat(product.rating)) ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-slate-700">{product.rating}</span>
              <span className="text-xs text-slate-500">({product.review_count} reviews)</span>
            </div>

            {/* Price and Stock */}
            <div className="flex items-center justify-between">
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-bold text-primary">RWF {product.price}</span>
                {parseFloat(product.original_price) > parseFloat(product.price) && (
                  <span className="text-sm text-slate-400 line-through">RWF {product.original_price}</span>
                )}
              </div>
              <span className={`text-xs px-3 py-1.5 rounded-2xl font-medium ${stockStatus.class}`}>
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
      <div className="w-full flex flex-col justify-center items-center py-24">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-slate-200 rounded-full animate-spin border-t-primary"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent rounded-full animate-ping border-t-primary/30"></div>
        </div>
        <div className="mt-6 text-center">
          <h3 className="text-lg font-semibold text-slate-700 mb-2">Loading amazing products...</h3>
          <p className="text-slate-500">Please wait while we fetch the latest items</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full text-center py-16">
        <div className="max-w-md mx-auto bg-red-50 border-2 border-red-200 rounded-3xl p-8">
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Eye className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">Something went wrong</h3>
          <div className="text-red-700 mb-6">{error}</div>
          <button
            onClick={fetchProducts}
            className="px-6 py-3 bg-primary text-white rounded-2xl hover:bg-primary/90 transition-colors font-semibold"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="w-full text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Package className="w-12 h-12 text-slate-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-3">No products available</h3>
          <p className="text-slate-600">No products found in this category. Check back soon for new arrivals!</p>
        </div>
      </div>
    );
  }

  const stats = getCategoryStats();

  return (
    <div className="max-w-full md:max-w-11/12 mx-auto px-6 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Enhanced Category Overview Panel */}
        <div className="lg:col-span-4">
          <div className="bg-white border-2 border-slate-100 rounded-3xl overflow-hidden h-full flex flex-col">
            {/* Category Header */}
            <div className="relative h-64 overflow-hidden">
              <img
                src={data.image}
                alt={data.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-white/90 uppercase tracking-wide">Category</span>
                  </div>
                  <h1 className="text-3xl font-bold text-white capitalize mb-2">
                    {data.name}
                  </h1>
                  <div className="h-1.5 w-16 bg-gradient-to-r from-primary to-primary/60 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Category Content */}
            <div className="p-8 flex-grow flex flex-col">
              <div className="mb-8">
                <h3 className="text-xl font-bold text-slate-800 mb-4">Category Overview</h3>
                <p className="text-slate-600 leading-relaxed">
                  {data.description || 'Explore our premium selection of products in this category, carefully curated for quality and style.'}
                </p>
              </div>

              {/* Enhanced Stats Grid */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <StatCard 
                  icon={<Package className="text-blue-600" size={22} />} 
                  value={stats.totalProducts} 
                  label="Total Products" 
                  color="blue"
                />
                <StatCard 
                  icon={<TrendingUp className="text-emerald-600" size={22} />} 
                  value={stats.inStock} 
                  label="In Stock" 
                  color="emerald"
                />
                <StatCard 
                  icon={<Star className="text-amber-600 fill-amber-600" size={22} />} 
                  value={stats.featured} 
                  label="Featured" 
                  color="amber"
                />
                <StatCard 
                  icon={<Eye className="text-purple-600" size={22} />} 
                  value={stats.avgRating} 
                  label="Avg Rating" 
                  color="purple"
                />
              </div>

              {/* Enhanced CTA Button */}
              <div className="mt-auto">
                <button className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2">
                  <span>Browse All Products</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Products Carousel */}
        <div className="lg:col-span-8">
          <div className="bg-white border-2 border-slate-100 rounded-3xl overflow-hidden">
            {/* Enhanced Carousel Header */}
            <div className="p-8 border-b-2 border-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-gradient-to-r from-primary to-primary/60 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-primary uppercase tracking-wide">Featured Collection</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-800">Featured Products</h2>
                <p className="text-slate-500">Top selections in {data.name.toLowerCase()}</p>
              </div>

              {/* Enhanced Controls */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center bg-slate-50 rounded-2xl p-1">
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

            {/* Enhanced Carousel Content */}
            <div className="p-8">
              <div className="relative overflow-hidden rounded-2xl">
                <div
                  className="flex transition-transform duration-700 ease-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                    <div key={slideIndex} className="w-full flex-shrink-0">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products
                          .slice(slideIndex * ITEMS_PER_SLIDE, (slideIndex + 1) * ITEMS_PER_SLIDE)
                          .map(renderProductCard)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Enhanced Auto-play progress indicator */}
              {isAutoPlaying && (
                <div className="mt-8 w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-primary to-primary/60 h-full rounded-full transition-all duration-300"
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

// Enhanced Stat Card Component
const StatCard: React.FC<{
  icon: React.ReactNode;
  value: string | number;
  label: string;
  color: 'blue' | 'emerald' | 'amber' | 'purple';
}> = ({ icon, value, label, color }) => {
  const colorClasses = {
    blue: 'from-blue-50 to-blue-100 border-blue-200 text-blue-700',
    emerald: 'from-emerald-50 to-emerald-100 border-emerald-200 text-emerald-700',
    amber: 'from-amber-50 to-amber-100 border-amber-200 text-amber-700',
    purple: 'from-purple-50 to-purple-100 border-purple-200 text-purple-700'
  };

  return (
    <div className={`bg-gradient-to-br rounded-2xl p-4 border-2 ${colorClasses[color]} transition-all duration-300 hover:scale-105`}>
      <div className="flex items-center justify-between mb-2">
        {icon}
        <span className="text-xs font-semibold bg-white/60 px-2 py-1 rounded-xl">
          {label.split(' ')[0]}
        </span>
      </div>
      <div className="text-2xl font-bold mb-1">{value}</div>
      <div className="text-xs font-medium opacity-80">{label}</div>
    </div>
  );
};

// Enhanced Navigation Button
const NavButton: React.FC<{
  direction: 'prev' | 'next';
  onClick: () => void;
}> = ({ direction, onClick }) => (
  <button
    onClick={onClick}
    className="p-3 hover:bg-white rounded-2xl transition-all duration-300 hover:scale-110"
    aria-label={`${direction === 'prev' ? 'Previous' : 'Next'} slide`}
  >
    {direction === 'prev' ? (
      <ChevronLeft size={20} className="text-slate-600" />
    ) : (
      <ChevronRight size={20} className="text-slate-600" />
    )}
  </button>
);

// Enhanced Pagination Dots
const PaginationDots: React.FC<{
  total: number;
  current: number;
  onClick: (index: number) => void;
}> = ({ total, current, onClick }) => (
  <div className="flex mx-3 space-x-1">
    {Array.from({ length: total }).map((_, i) => (
      <button
        key={i}
        onClick={() => onClick(i)}
        className={`h-2 rounded-full transition-all duration-300 ${
          i === current 
            ? 'bg-primary w-6' 
            : 'bg-slate-300 w-2 hover:bg-slate-400'
        }`}
        aria-label={`Go to slide ${i + 1}`}
      />
    ))}
  </div>
);

// Enhanced Auto-play Toggle
const AutoPlayToggle: React.FC<{
  isPlaying: boolean;
  onToggle: () => void;
}> = ({ isPlaying, onToggle }) => (
  <button
    onClick={onToggle}
    className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-300 ${
      isPlaying 
        ? 'bg-primary text-white hover:bg-primary/90' 
        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
    }`}
    aria-label={isPlaying ? 'Pause auto-play' : 'Play auto-play'}
  >
    {isPlaying ? <Pause size={16} /> : <Play size={16} />}
    <span>{isPlaying ? 'Pause' : 'Play'}</span>
  </button>
);

export default ProductsShowcase;