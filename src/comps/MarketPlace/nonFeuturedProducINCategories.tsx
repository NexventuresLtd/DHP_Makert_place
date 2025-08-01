import React, { useState, useEffect, useCallback } from 'react';
import { Heart, Star, ChevronRight, ShoppingCart, Sparkles, X, ArrowRight, Package } from 'lucide-react';
import type { Category, Product } from '../../types/marketTypes';
import { fetchFilteredProducts } from '../../app/utlis/GetProductUtils';

interface ProductsShowcaseProps {
  data: Category;
}

const ProductsShowcase: React.FC<ProductsShowcaseProps> = ({ data }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [likedProducts, setLikedProducts] = useState<Set<number>>(new Set());
  const [activeTab, setActiveTab] = useState<'featured' | 'new' | 'discounted'>('featured');

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedProducts = await fetchFilteredProducts({ category: data.slug });
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

  const getFilteredProducts = () => {
    switch (activeTab) {
      case 'featured':
        return products.filter(p => p.is_featured);
      case 'new':
        return products.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        ).slice(0, 6);
      case 'discounted':
        return products.filter(p => 
          parseFloat(p.original_price) > parseFloat(p.price)
        );
      default:
        return products;
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
            className="px-6 py-2 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors"
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
    <div className="relative overflow-hidden">
      {/* Floating Category Header */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-md py-4 px-6 border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-lg overflow-hidden">
              <img 
                src={data.image} 
                alt={data.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="text-xl font-bold text-gray-900">{data.name}</h1>
          </div>
          
          <div className="hidden md:flex space-x-1 bg-gray-100 p-1 rounded-full">
            <button
              onClick={() => setActiveTab('featured')}
              className={`px-4 py-1 text-sm rounded-full transition-colors ${activeTab === 'featured' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-200'}`}
            >
              Featured
            </button>
            <button
              onClick={() => setActiveTab('new')}
              className={`px-4 py-1 text-sm rounded-full transition-colors ${activeTab === 'new' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-200'}`}
            >
              New Arrivals
            </button>
            <button
              onClick={() => setActiveTab('discounted')}
              className={`px-4 py-1 text-sm rounded-full transition-colors ${activeTab === 'discounted' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-200'}`}
            >
              Discounted
            </button>
          </div>
        </div>
      </div>

      {/* Asymmetric Product Grid */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Main featured product (left) */}
          {getFilteredProducts().length > 0 && (
            <div className="md:col-span-7 lg:col-span-8">
              <div 
                className="relative h-[500px] rounded-2xl overflow-hidden shadow-lg cursor-pointer group"
                onClick={() => setSelectedProduct(getFilteredProducts()[0])}
              >
                <img
                  src={getFilteredProducts()[0].images.find(img => img.is_primary)?.image || getFilteredProducts()[0].images[0]?.image}
                  alt={getFilteredProducts()[0].name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex flex-col justify-end p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-bold text-white">{getFilteredProducts()[0].name}</h2>
                      <p className="text-gray-200 line-clamp-2">{getFilteredProducts()[0].description}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLike(getFilteredProducts()[0].id);
                      }}
                      className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
                    >
                      <Heart 
                        className={`w-5 h-5 ${likedProducts.has(getFilteredProducts()[0].id) ? 'fill-red-500 text-red-500' : 'text-white'}`}
                      />
                    </button>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-baseline space-x-2">
                      <span className="text-xl font-bold text-white">
                        {formatPrice(getFilteredProducts()[0].price)}
                      </span>
                      {parseFloat(getFilteredProducts()[0].original_price) > parseFloat(getFilteredProducts()[0].price) && (
                        <span className="text-gray-300 line-through">
                          {formatPrice(getFilteredProducts()[0].original_price)}
                        </span>
                      )}
                    </div>
                    <span className="bg-primary text-white px-3 py-1 rounded-full text-sm">
                      {getFilteredProducts()[0].stock > 0 ? 'In Stock' : 'Sold Out'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Secondary products (right) */}
          <div className="md:col-span-5 lg:col-span-4">
            <div className="grid grid-cols-2 gap-4 h-full">
              {getFilteredProducts().slice(1, 5).map((product, index) => (
                <div 
                  key={product.id} 
                  className={`relative rounded-xl overflow-hidden shadow-md cursor-pointer group ${index === 2 ? 'md:col-span-2' : ''}`}
                  onClick={() => setSelectedProduct(product)}
                >
                  <div className="aspect-square">
                    <img
                      src={product.images.find(img => img.is_primary)?.image || product.images[0]?.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent p-4 flex flex-col justify-end">
                    <h3 className="text-white font-medium line-clamp-1">{product.name}</h3>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-white font-medium">
                        {formatPrice(product.price)}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLike(product.id);
                        }}
                        className="text-white hover:text-red-400 transition-colors"
                      >
                        <Heart 
                          className={`w-4 h-4 ${likedProducts.has(product.id) ? 'fill-red-500 text-red-500' : ''}`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Horizontal scroll for remaining products */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">More in {data.name}</h3>
            <button className="flex items-center text-primary hover:text-primary-dark">
              View all <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
          <div className="relative">
            <div className="overflow-x-auto pb-4">
              <div className="flex space-x-4">
                {getFilteredProducts().slice(5).map(product => (
                  <div 
                    key={product.id} 
                    className="flex-shrink-0 w-64 rounded-lg overflow-hidden shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setSelectedProduct(product)}
                  >
                    <div className="relative aspect-square">
                      <img
                        src={product.images.find(img => img.is_primary)?.image || product.images[0]?.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      {product.is_featured && (
                        <div className="absolute top-2 left-2 bg-purple-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                          <Sparkles className="w-3 h-3 mr-1" />
                          Featured
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h4 className="font-medium text-gray-900 line-clamp-1">{product.name}</h4>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-primary font-bold">
                          {formatPrice(product.price)}
                        </span>
                        <div className="flex items-center text-xs text-gray-500">
                          <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                          {product.rating}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
          <div className="relative bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Product Images */}
              <div className="sticky top-0">
                <div className="h-96 bg-gray-100">
                  <img
                    src={selectedProduct.images.find(img => img.is_primary)?.image || selectedProduct.images[0]?.image}
                    alt={selectedProduct.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="grid grid-cols-4 gap-2 p-4">
                  {selectedProduct.images.slice(0, 4).map((img, index) => (
                    <div key={index} className="aspect-square bg-gray-100 rounded overflow-hidden">
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
                    <span className="text-sm text-gray-600">{selectedProduct.rating} ({selectedProduct.review_count} reviews)</span>
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
                  <div className="border border-gray-200 rounded-lg p-3">
                    <h4 className="text-xs text-gray-500 mb-1">Condition</h4>
                    <p className="font-medium capitalize">{selectedProduct.condition}</p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-3">
                    <h4 className="text-xs text-gray-500 mb-1">Availability</h4>
                    <p className={`font-medium ${selectedProduct.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {selectedProduct.stock > 0 ? `${selectedProduct.stock} in stock` : 'Out of stock'}
                    </p>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button 
                    onClick={() => toggleLike(selectedProduct.id)}
                    className={`flex-1 flex items-center justify-center space-x-2 py-3 px-6 rounded-lg border ${likedProducts.has(selectedProduct.id) ? 'border-red-500 text-red-500' : 'border-gray-300 text-gray-700'} hover:bg-gray-50 transition-colors`}
                  >
                    <Heart 
                      className={`w-5 h-5 ${likedProducts.has(selectedProduct.id) ? 'fill-red-500' : ''}`}
                    />
                    <span>{likedProducts.has(selectedProduct.id) ? 'Saved' : 'Save'}</span>
                  </button>
                  <button className="flex-1 bg-primary hover:bg-primary-dark text-white py-3 px-6 rounded-lg flex items-center justify-center space-x-2 transition-colors">
                    <ShoppingCart className="w-5 h-5" />
                    <span>Add to Cart</span>
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