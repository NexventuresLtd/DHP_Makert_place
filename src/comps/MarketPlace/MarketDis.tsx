import React, { useState, useEffect, useCallback } from 'react';
import { Star, ChevronLeft, ChevronRight, ShoppingCart, Package, TrendingUp, Eye, Play, Pause, Sparkles } from 'lucide-react';
import type { Category, Product } from '../../types/marketTypes';
import { fetchFilteredProducts } from '../../app/utlis/GetProductUtils';
import ProductDetailModal from '../dashboard/AdminProduct/ViewMoreDetails';
import { WishlistHeart } from '../sharedComps/WishListHeart';

interface ProductsShowcaseProps {
  data: Category;
}

const ProductsShowcase: React.FC<ProductsShowcaseProps> = ({ data }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const ITEMS_PER_SLIDE = 3;
  const AUTO_SLIDE_INTERVAL = 5000;
  const totalSlides = Math.ceil(products.length / ITEMS_PER_SLIDE);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedProducts = await fetchFilteredProducts({
        category: data.slug,
        is_featured: true,
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

  useEffect(() => {
    if (!isAutoPlaying || products.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % totalSlides);
    }, AUTO_SLIDE_INTERVAL);

    return () => clearInterval(interval);
  }, [isAutoPlaying, totalSlides, products.length]);


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

    const stockStatus = product.stock > 10
      ? { text: 'In Stock', class: 'bg-emerald-50 text-emerald-700 border border-emerald-200' }
      : product.stock > 0
        ? { text: `${product.stock} left`, class: 'bg-amber-50 text-amber-700 border border-amber-200' }
        : { text: 'Out of Stock', class: 'bg-red-50 text-red-700 border border-red-200' };

    return (
      <div key={product.id} className="group relative bg-white border border-slate-100 rounded-xl overflow-hidden hover:border-primary/20 transition-all duration-300">
        <div className="relative aspect-square overflow-hidden">
          <img
            src={primaryImage?.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          <div className="absolute top-3 left-3 flex flex-col space-y-1">
            {discount > 0 && (
              <div className="flex items-center gap-1 bg-gradient-to-r bg-second text-white px-2 py-1 rounded-lg text-xs font-bold">
                <span>-{discount}%</span>
              </div>
            )}
            {product.is_featured && (
              <div className="flex items-center gap-1 bg-gradient-to-r bg-second text-white px-2 py-1 rounded-lg text-xs font-semibold">
                <Sparkles className="w-3 h-3" />
                <span>Featured</span>
              </div>
            )}
          </div>

          <WishlistHeart productId={product.id} className="w-5 h-5" size={16} />

          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <button onClick={() => { setSelectedProduct(product); setIsModalOpen(true); }} className="bg-white/95 backdrop-blur-sm text-slate-900 px-4 py-2 rounded-xl font-medium hover:bg-white transition-all duration-200 flex items-center space-x-2 hover:scale-105 text-sm">
              <ShoppingCart size={16} />
              <span>Add to Cart</span>
            </button>
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-slate-800 text-base mb-1 line-clamp-1 hover:text-primary transition-colors">
            {product.name}
          </h3>
          <p className="text-slate-600 text-xs mb-3 line-clamp-2">
            {product.description}
          </p>

          <div className="flex flex-col space-y-3">
            <div className="flex items-center space-x-1">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={`${i < Math.floor(parseFloat(product.rating)) ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`}
                  />
                ))}
              </div>
              <span className="text-xs font-medium text-slate-700">{product.rating}</span>
              <span className="text-xs text-slate-500">({product.review_count})</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-baseline space-x-1">
                <span className="text-lg font-bold text-primary">{new Intl.NumberFormat('rw', {
                  style: 'currency',
                  currency: 'RWF',
                }).format(parseFloat(product.price))}</span>
                {parseFloat(product.original_price) > parseFloat(product.price) && (
                  <span className="text-xs text-slate-400 line-through">{new Intl.NumberFormat('rw', {
                    style: 'currency',
                    currency: 'RWF',
                  }).format(parseFloat(product.original_price))}</span>
                )}
              </div>
              <span className={`text-xs px-2 py-1 rounded-xl font-medium ${stockStatus.class}`}>
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
      <div className="w-full flex flex-col justify-center items-center py-16">
        <div className="relative">
          <div className="w-12 h-12 border-3 border-slate-200 rounded-full animate-spin border-t-primary"></div>
        </div>
        <div className="mt-4 text-center">
          <h3 className="text-base font-semibold text-slate-700 mb-1">Loading products...</h3>
          <p className="text-slate-500 text-sm">Please wait while we fetch items</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-full md:max-w-11/12 text-center py-12">
        <div className="max-w-md mx-auto bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Eye className="w-6 h-6 text-red-500" />
          </div>
          <h3 className="text-base font-semibold text-red-800 mb-1">Something went wrong</h3>
          <div className="text-red-700 text-sm mb-4">{error}</div>
          <button
            onClick={fetchProducts}
            className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors font-medium text-sm"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="max-w-full md:max-w-11/12 text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">No products available</h3>
          <p className="text-slate-600 text-sm">No products found in this category</p>
        </div>
      </div>
    );
  }

  const stats = getCategoryStats();

  return (
    <div className="max-w-full md:max-w-11/12 mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4">
          <div className="bg-white border border-slate-100 rounded-xl overflow-hidden h-full flex flex-col">
            <div className="relative h-48 overflow-hidden">
              <img
                src={data.image}
                alt={data.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center gap-1 mb-2">
                    <div className="w-6 h-6 bg-primary rounded-lg flex items-center justify-center">
                      <Sparkles className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-xs font-semibold text-white/90 uppercase tracking-wide">Category</span>
                  </div>
                  <h1 className="text-xl font-bold text-white capitalize mb-1">
                    {data.name}
                  </h1>
                  <div className="h-1 w-12 bg-gradient-to-r from-primary to-primary/60 rounded-full"></div>
                </div>
              </div>
            </div>

            <div className="p-6 flex-grow flex flex-col">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-800 mb-3">Category Overview</h3>
                <p className="text-slate-600 text-sm">
                  {data.description || 'Explore our premium selection of products in this category.'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <StatCard
                  icon={<Package className="text-blue-600" size={18} />}
                  value={stats.totalProducts}
                  label="Total Products"
                  color="blue"
                />
                <StatCard
                  icon={<TrendingUp className="text-emerald-600" size={18} />}
                  value={stats.inStock}
                  label="In Stock"
                  color="emerald"
                />
                <StatCard
                  icon={<Star className="text-amber-600 fill-amber-600" size={18} />}
                  value={stats.featured}
                  label="Featured"
                  color="amber"
                />
                <StatCard
                  icon={<Eye className="text-purple-600" size={18} />}
                  value={stats.avgRating}
                  label="Avg Rating"
                  color="purple"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8">
          <div className="bg-white border border-slate-100 rounded-xl overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <div className="flex items-center gap-1 mb-1">
                  <div className="w-5 h-5 bg-gradient-to-r from-primary to-primary/60 rounded-md flex items-center justify-center">
                    <Sparkles className="w-2.5 h-2.5 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-primary uppercase tracking-wide">Featured</span>
                </div>
                <h2 className="text-xl font-bold text-slate-800">Featured Products</h2>
                <p className="text-slate-500 text-sm">Top selections in {data.name.toLowerCase()}</p>
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex items-center bg-slate-50 rounded-xl p-1">
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

            <div className="p-6">
              <div className="relative overflow-hidden rounded-xl">
                <div
                  className="flex transition-transform duration-500 ease-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                    <div key={slideIndex} className="w-full flex-shrink-0">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {products
                          .slice(slideIndex * ITEMS_PER_SLIDE, (slideIndex + 1) * ITEMS_PER_SLIDE)
                          .map(renderProductCard)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {isAutoPlaying && (
                <div className="mt-6 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
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

      {selectedProduct && isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-200">
            <ProductDetailModal
              product={selectedProduct}
              onClose={() => setIsModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

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
    <div className={`bg-gradient-to-br rounded-xl p-3 border ${colorClasses[color]}`}>
      <div className="flex items-center justify-between mb-1">
        {icon}
        <span className="text-xs font-semibold bg-white/60 px-1.5 py-0.5 rounded-lg">
          {label.split(' ')[0]}
        </span>
      </div>
      <div className="text-lg font-bold mb-0.5">{value}</div>
      <div className="text-xs opacity-80">{label}</div>
    </div>
  );
};

const NavButton: React.FC<{
  direction: 'prev' | 'next';
  onClick: () => void;
}> = ({ direction, onClick }) => (
  <button
    onClick={onClick}
    className="p-2 hover:bg-white rounded-xl transition-all duration-200"
    aria-label={`${direction === 'prev' ? 'Previous' : 'Next'} slide`}
  >
    {direction === 'prev' ? (
      <ChevronLeft size={18} className="text-slate-600" />
    ) : (
      <ChevronRight size={18} className="text-slate-600" />
    )}
  </button>
);

const PaginationDots: React.FC<{
  total: number;
  current: number;
  onClick: (index: number) => void;
}> = ({ total, current, onClick }) => (
  <div className="flex mx-2 space-x-1">
    {Array.from({ length: total }).map((_, i) => (
      <button
        key={i}
        onClick={() => onClick(i)}
        className={`h-1.5 rounded-full transition-all duration-200 ${i === current
          ? 'bg-primary w-4'
          : 'bg-slate-300 w-1.5 hover:bg-slate-400'
          }`}
        aria-label={`Go to slide ${i + 1}`}
      />
    ))}
  </div>
);

const AutoPlayToggle: React.FC<{
  isPlaying: boolean;
  onToggle: () => void;
}> = ({ isPlaying, onToggle }) => (
  <button
    onClick={onToggle}
    className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${isPlaying
      ? 'bg-primary text-white hover:bg-primary/90'
      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
      }`}
    aria-label={isPlaying ? 'Pause auto-play' : 'Play auto-play'}
  >
    {isPlaying ? <Pause size={14} /> : <Play size={14} />}
    <span>{isPlaying ? 'Pause' : 'Play'}</span>
  </button>
);

export default ProductsShowcase;