import { useState, useEffect } from 'react';
import { Heart, ShoppingCart, Eye, Star, Filter, Grid, List } from 'lucide-react';
import type { Product } from '../../types/marketTypes';
import { fetchFilteredProducts } from '../../app/utlis/GetProductUtils';

export default function RecommendedItemsSection() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetchFilteredProducts({ category: selectedCategory === 'All' ? undefined : selectedCategory });
        setProducts(response.data);
      } catch (err) {
        setError('Failed to load products. Please try again later.');
        console.error('Error fetching products:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, [selectedCategory]);

  const categories = ['All', 'Art', 'Crafts', 'Instruments'];

  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(product => {
        // You would need to map your category IDs to names here
        // This is just a placeholder implementation
        return categories[product.category] === selectedCategory;
      });

  const toggleLike = (id: number) => {
    // Handle like toggle
    console.log('Toggle like for product:', id);
  };

  const addToCart = (product: Product) => {
    console.log('Add to cart:', product);
  };

  const getPrimaryImage = (product: Product) => {
    const primaryImage = product.images.find(img => img.is_primary);
    return primaryImage ? primaryImage.image : product.images[0]?.image || '/api/placeholder/300/200';
  };

  return (
    <div className="w-full md:max-w-11/12 mx-auto px-4 py-12 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Recommended Items</h1>
            <p className="text-gray-600">Discover unique handcrafted items from talented artisans</p>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-2 bg-white rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-green-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list'
                  ? 'bg-green-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">Filter by:</span>
          </div>

          {/* <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-green-50 hover:text-green-600'
                } border border-gray-200`}
              >
                {category}
              </button>
            ))}
          </div> */}
        </div>
      </div>

      {/* Loading and Error States */}
      {isLoading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Products Grid */}
      {!isLoading && !error && (
        <div className={`grid gap-6 ${
          viewMode === 'grid'
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'
            : 'grid-cols-1'
        }`}>
          {filteredProducts && filteredProducts?.map((product) => (
            <div key={product.id} className={`group bg-white rounded-2xl hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 ${
              viewMode === 'list' ? 'flex' : ''
            }`}>
              {/* Image Container */}
              <div className={`relative overflow-hidden ${
                viewMode === 'list' ? 'w-48 h-48 flex-shrink-0' : ''
              }`}>
                <div className={`bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center ${
                  viewMode === 'list' ? 'w-full h-full' : 'aspect-square'
                }`}>
                  <img
                    src={getPrimaryImage(product)}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/api/placeholder/300/200';
                    }}
                  />
                </div>

                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleLike(product.id)}
                      className="p-2 bg-white text-gray-600 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors"
                    >
                      <Heart className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => addToCart(product)}
                      className="p-2 bg-white text-gray-600 rounded-full hover:bg-green-50 hover:text-green-600 transition-colors"
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Condition Badge */}
                <div className="absolute top-3 left-3">
                  <span className="px-2 py-1 bg-white bg-opacity-90 backdrop-blur-sm text-xs font-medium text-gray-700 rounded-full capitalize">
                    {product.condition}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className={`p-4 ${viewMode === 'list' ? 'flex-1 flex flex-col justify-between' : ''}`}>
                {viewMode === 'list' ? (
                  // List view layout
                  <div className="flex flex-col h-full">
                    <div className="flex-1">
                      <div className="flex items-center gap-1 mb-2">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium text-gray-700">{product.rating}</span>
                        <span className="text-xs text-gray-500 ml-1">({product.review_count} reviews)</span>
                        {product.is_featured && (
                          <span className="ml-auto px-2 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">
                            Featured
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{product.name}</h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>

                      <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-3xl font-bold text-primary">RWF {product.price}</span>
                        {product.original_price && (
                          <span className="text-sm text-gray-500 line-through">RWF {product.original_price}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleLike(product.id)}
                        className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-500 transition-colors"
                      >
                        <Heart className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => addToCart(product)}
                        className="flex-1 px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <ShoppingCart className="w-5 h-5" />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ) : (
                  // Grid view layout
                  <>
                    <div className="flex items-center gap-1 mb-2">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium text-gray-700">{product.rating}</span>
                      <span className="text-xs text-gray-500 ml-1">({product.review_count} reviews)</span>
                      {product.is_featured && (
                        <span className="ml-auto px-2 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">
                          Featured
                        </span>
                      )}
                    </div>

                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-2xl font-bold text-primary">RWF {product.price}</span>
                        {product.original_price && (
                          <span className="text-sm text-gray-500 line-through">RWF {product.original_price}</span>
                        )}
                      </div>
                      <button
                        onClick={() => addToCart(product)}
                        className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1"
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
      )}

      {/* Empty State */}
      {!isLoading && !error && filteredProducts && filteredProducts?.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Eye className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No products found</h3>
          <p className="text-gray-600">Try adjusting your filters to find what you're looking for.</p>
        </div>
      )}
    </div>
  );
}