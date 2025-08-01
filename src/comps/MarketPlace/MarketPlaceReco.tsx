import { useState, useEffect } from 'react';
import { Heart, ShoppingCart, Eye, Star, Filter, Grid, List, Sparkles, ArrowRight } from 'lucide-react';
import type { Product } from '../../types/marketTypes';
import { fetchFilteredProducts } from '../../app/utlis/GetProductUtils';
import ProductDetailModal from '../dashboard/AdminProduct/ViewMoreDetails';

export default function RecommendedItemsSection() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        console.log('Fetching products...');

        const response = await fetchFilteredProducts({ category: "" });
        console.log('API Response:', response);

        // Handle different response structures
        const productsData = response?.data || response || [];
        if (!Array.isArray(productsData)) {
          throw new Error('Invalid products data format');
        }

        setProducts(productsData);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
        setProducts([]); // Ensure products is always an array
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  const toggleLike = (id: number) => {
    console.log('Toggle like for product:', id);
  };

  const getPrimaryImage = (product: Product) => {
    if (!product.images || product.images.length === 0) {
      return '/placeholder/300/200';
    }
    const primaryImage = product.images.find(img => img?.is_primary);
    return primaryImage?.image || product.images[0]?.image || '/placeholder/300/200';
  };

  console.log('Current products state:', products);

  return (
    <>
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
        {/* Floating Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-200/20 to-green-200/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 -left-40 w-60 h-60 bg-gradient-to-br from-blue-200/20 to-cyan-200/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 right-1/3 w-96 h-96 bg-gradient-to-br from-emerald-200/20 to-teal-200/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative w-full md:max-w-11/12 mx-auto px-6 py-16">
          {/* Enhanced Header Section */}
          <div className="mb-12">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 mb-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r bg-second rounded-lg">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-emerald-600 tracking-wide uppercase">Curated Selection</span>
                </div>
                <h1 className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600 bg-clip-text text-transparent leading-tight">
                  Recommended
                  <span className="block text-4xl lg:text-5xl bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    Items
                  </span>
                </h1>
                <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
                  Discover unique handcrafted treasures from talented artisans around the world, each piece telling its own story
                </p>
              </div>

              {/* Enhanced View Toggle */}
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-slate-600">View:</span>
                <div className="flex items-center bg-white/80 backdrop-blur-sm rounded-2xl p-1.5  border border-white/20">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 ${viewMode === 'grid'
                      ? 'bg-primary text-white  shadow-emerald-500/25'
                      : 'text-slate-600 hover:bg-slate-100/50'
                      }`}
                  >
                    <Grid className="w-4 h-4" />
                    <span className="text-sm font-medium">Grid</span>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 ${viewMode === 'list'
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white  shadow-emerald-500/25'
                      : 'text-slate-600 hover:bg-slate-100/50'
                      }`}
                  >
                    <List className="w-4 h-4" />
                    <span className="text-sm font-medium">List</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Enhanced Filters */}
            <div className="flex flex-wrap items-center gap-4 p-6 bg-white/60 backdrop-blur-sm rounded-3xl border border-white/20 ">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-slate-100 to-slate-200 rounded-2xl">
                  <Filter className="w-5 h-5 text-slate-600" />
                </div>
                <span className="text-sm font-semibold text-slate-700">Filter by:</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="px-4 py-2 bg-white/70 rounded-full text-sm font-medium text-slate-600 border border-slate-200/50">
                  All Categories
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Loading State */}
          {isLoading && (
            <div className="flex flex-col justify-center items-center py-24">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-emerald-200 rounded-full animate-spin border-t-emerald-500"></div>
                <div className="absolute inset-0 w-20 h-20 border-4 border-transparent rounded-full animate-ping border-t-emerald-300"></div>
              </div>
              <div className="mt-6 text-center">
                <h3 className="text-lg font-semibold text-slate-700 mb-2">Loading amazing products...</h3>
                <p className="text-slate-500">Please wait while we fetch the latest items</p>
              </div>
            </div>
          )}

          {/* Enhanced Error State */}
          {error && (
            <div className="max-w-md mx-auto">
              <div className="bg-gradient-to-r from-red-50 to-green-50 border border-red-200/50 rounded-3xl p-8 text-center ">
                <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Eye className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-lg font-semibold text-red-800 mb-2">Oops! Something went wrong</h3>
                <p className="text-red-700 mb-6">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 bg-gradient-to-r from-red-500 to-green-500 text-white font-medium rounded-2xl hover:from-red-600 hover:to-green-600 transition-all duration-300  shadow-red-500/25"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* Enhanced Products Grid */}
          {!isLoading && !error && (
            <>
              {products.length > 0 ? (
                <div
                  className={`grid gap-8 ${viewMode === 'grid'
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'
                    : 'grid-cols-1 max-w-4xl mx-auto'
                    }`}
                >
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className={`group bg-white/80 backdrop-blur-sm rounded-3xl hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 overflow-hidden border border-white/20 hover:-translate-y-2 hover:bg-white/90 ${viewMode === 'list' ? 'flex' : ''
                        }`}
                    >
                      {/* Enhanced Image Container */}
                      <div
                        className={`relative overflow-hidden ${viewMode === 'list' ? 'w-56 h-56 flex-shrink-0' : ''
                          }`}
                      >
                        <div
                          className={`bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100 flex items-center justify-center relative ${viewMode === 'list' ? 'w-full h-full rounded-l-3xl' : 'aspect-square rounded-t-3xl'
                            }`}
                        >
                          <img
                            src={getPrimaryImage(product)}
                            alt={product.name || 'Product image'}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/placeholder/300/200';
                            }}
                          />

                          {/* Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        </div>

                        {/* Enhanced Overlay Actions */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <div className="flex gap-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                            <button
                              onClick={() => toggleLike(product.id)}
                              className="p-3 bg-white/90 backdrop-blur-sm text-slate-600 rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all duration-300  hover:shadow-red-500/25 hover:scale-110"
                            >
                              <Heart className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => { setSelectedProduct(product); setIsModalOpen(true); }}
                              className="p-3 bg-white/90 backdrop-blur-sm text-slate-600 rounded-2xl hover:bg-emerald-50 hover:text-emerald-600 transition-all duration-300  hover:shadow-emerald-500/25 hover:scale-110"
                            >
                              <ShoppingCart className="w-5 h-5" />
                            </button>
                          </div>
                        </div>

                        {/* Enhanced Condition Badge */}
                        {product.condition && (
                          <div className="absolute top-4 left-4">
                            <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm text-xs font-semibold text-slate-700 rounded-2xl border border-white/20  capitalize">
                              {product.condition}
                            </span>
                          </div>
                        )}

                        {/* New Badge for Featured Items */}
                        {product.is_featured && (
                          <div className="absolute top-4 right-4">
                            <div className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r bg-second text-white text-xs font-semibold rounded-2xl ">
                              <Sparkles className="w-3 h-3" />
                              Featured
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Enhanced Content */}
                      <div
                        className={`p-6 ${viewMode === 'list' ? 'flex-1 flex flex-col justify-between' : ''
                          }`}
                      >
                        {viewMode === 'list' ? (
                          // Enhanced List view layout
                          <div className="flex flex-col h-full">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-3">
                                <div className="flex items-center gap-1">
                                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                  <span className="text-sm font-semibold text-slate-700">
                                    {product.rating || '0'}
                                  </span>
                                  <span className="text-xs text-slate-500 ml-1">
                                    ({product.review_count || 0} reviews)
                                  </span>
                                </div>
                              </div>

                              <h3 className="text-2xl font-bold text-slate-800 mb-3 leading-tight">
                                {product.name || 'Untitled Product'}
                              </h3>
                              <p className="text-slate-600 mb-6 line-clamp-3 leading-relaxed">
                                {product.description || 'No description available'}
                              </p>

                              <div className="flex items-baseline gap-3 mb-6">
                                <span className="text-xl font-bold text-primary bg-clip-text text-transparent">
                                  RWF {product.price || '0'}
                                </span>
                                {product.original_price && (
                                  <span className="text-slate-400 line-through">
                                    RWF {product.original_price}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-4">
                              <button
                                onClick={() => toggleLike(product.id)}
                                className="p-3 rounded-2xl bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-500 transition-all duration-300 hover:scale-105"
                              >
                                <Heart className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => { setSelectedProduct(product); setIsModalOpen(true); }}
                                className="flex-1 px-8 py-4 bg-primary text-white font-semibold rounded-2xl transition-all duration-300 flex items-center justify-center gap-3  shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-105"
                              >
                                <ShoppingCart className="w-5 h-5" />
                                Add to Cart
                                <ArrowRight className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          // Enhanced Grid view layout
                          <>
                            <div className="flex items-center gap-2 mb-3">
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm font-semibold text-slate-700">
                                  {product.rating || '0'}
                                </span>
                                <span className="text-xs text-slate-500 ml-1">
                                  ({product.review_count || 0})
                                </span>
                              </div>
                            </div>

                            <h3 className="font-bold text-slate-800 mb-2 line-clamp-2 text-lg leading-tight">
                              {product.name || 'Untitled Product'}
                            </h3>
                            <p className="text-sm text-slate-600 mb-4 line-clamp-2 leading-relaxed">
                              {product.description || 'No description available'}
                            </p>

                            <div className="flex items-center justify-between">
                              <div className="flex flex-col">
                                <span className="text-xl font-bold text-primary bg-clip-text text-transparent">
                                  RWF {product.price || '0'}
                                </span>
                                {product.original_price && (
                                  <span className="text-sm text-slate-400 line-through">
                                    RWF {product.original_price}
                                  </span>
                                )}
                              </div>
                              <button
                                onClick={() => { setSelectedProduct(product); setIsModalOpen(true); }}
                                className="px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-2xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 flex items-center gap-2  shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-105"
                              >
                                <ShoppingCart className="w-4 h-4" />
                                Add
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // Enhanced Empty State
                <div className="text-center py-16">
                  <div className="mx-auto w-32 h-32 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center mb-8 ">
                    <Eye className="w-16 h-16 text-slate-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-3">No products found</h3>
                  <p className="text-slate-600 text-lg max-w-md mx-auto leading-relaxed">
                    {products.length === 0
                      ? 'There are currently no products available. Check back soon for amazing new items!'
                      : 'Try adjusting your filters to discover what you\'re looking for.'}
                  </p>
                  <div className="mt-8">
                    <button className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-2xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-300  shadow-emerald-500/25 hover:shadow-emerald-500/40">
                      Refresh Page
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

      </div>
    </>
  );
}