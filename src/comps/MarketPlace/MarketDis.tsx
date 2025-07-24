import React, { useState, useEffect } from 'react';
import { Heart, Star, ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';

export interface ProductImage {
  image: string;
  is_primary: boolean;
  product?: number;
}

export interface Product {
  sales: number;
  status: string;
  id: number;
  images: ProductImage[];
  name: string;
  slug: string;
  description: string;
  price: string;
  original_price: string;
  condition: "new" | "used" | "refurbished";
  stock: number;
  rating: string;
  review_count: number;
  created_at: string;
  updated_at: string;
  is_featured: boolean;
  is_active: boolean;
  seller: number;
  category: number;
}

const ModernProductsShowcase: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [likedProducts, setLikedProducts] = useState<Set<number>>(new Set());

  // Mock products data based on your interface
  const [products] = useState<Product[]>([
    {
      id: 1,
      name: "Premium Handcrafted Flute",
      slug: "premium-handcrafted-flute",
      description: "Exquisite bamboo flute with traditional craftsmanship, perfect for meditation and musical performances.",
      price: "89.99",
      original_price: "119.99",
      condition: "new",
      stock: 15,
      rating: "4.8",
      review_count: 124,
      sales: 89,
      status: "active",
      is_featured: true,
      is_active: true,
      seller: 1,
      category: 1,
      created_at: "2024-01-15T10:00:00Z",
      updated_at: "2024-01-20T14:30:00Z",
      images: [
        {
          image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&crop=center",
          is_primary: true,
          product: 1
        }
      ]
    },
    {
      id: 2,
      name: "Contemporary Art Collection",
      slug: "contemporary-art-collection",
      description: "Modern artistic masterpiece featuring abstract elements with vibrant color combinations.",
      price: "299.99",
      original_price: "399.99",
      condition: "new",
      stock: 8,
      rating: "4.9",
      review_count: 67,
      sales: 34,
      status: "active",
      is_featured: true,
      is_active: true,
      seller: 2,
      category: 2,
      created_at: "2024-01-10T08:00:00Z",
      updated_at: "2024-01-18T16:45:00Z",
      images: [
        {
          image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop&crop=center",
          is_primary: true,
          product: 2
        }
      ]
    },
    {
      id: 3,
      name: "Rustic Farm Artwork",
      slug: "rustic-farm-artwork",
      description: "Charming countryside painting capturing the essence of rural life with warm, earthy tones.",
      price: "149.99",
      original_price: "249.99",
      condition: "new",
      stock: 12,
      rating: "4.7",
      review_count: 89,
      sales: 156,
      status: "active",
      is_featured: false,
      is_active: true,
      seller: 3,
      category: 2,
      created_at: "2024-01-05T12:00:00Z",
      updated_at: "2024-01-15T09:20:00Z",
      images: [
        {
          image: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=400&h=400&fit=crop&crop=center",
          is_primary: true,
          product: 3
        }
      ]
    },
    {
      id: 4,
      name: "Traditional Agaseke Basket",
      slug: "traditional-agaseke-basket",
      description: "Authentic Rwandan woven basket with intricate patterns, perfect for home decoration and storage.",
      price: "79.99",
      original_price: "99.99",
      condition: "new",
      stock: 25,
      rating: "4.6",
      review_count: 203,
      sales: 278,
      status: "active",
      is_featured: true,
      is_active: true,
      seller: 4,
      category: 3,
      created_at: "2024-01-08T15:30:00Z",
      updated_at: "2024-01-22T11:15:00Z",
      images: [
        {
          image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop&crop=center",
          is_primary: true,
          product: 4
        }
      ]
    },
    {
      id: 5,
      name: "Cultural Ikibindi Craft",
      slug: "cultural-ikibindi-craft",
      description: "Beautiful handmade cultural artifact showcasing traditional design elements and craftsmanship.",
      price: "129.99",
      original_price: "159.99",
      condition: "new",
      stock: 18,
      rating: "4.8",
      review_count: 145,
      sales: 92,
      status: "active",
      is_featured: false,
      is_active: true,
      seller: 5,
      category: 3,
      created_at: "2024-01-12T09:45:00Z",
      updated_at: "2024-01-19T13:30:00Z",
      images: [
        {
          image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop&crop=center",
          is_primary: true,
          product: 5
        }
      ]
    },
    {
      id: 6,
      name: "Artisan Ceramic Vase",
      slug: "artisan-ceramic-vase",
      description: "Elegant handcrafted ceramic vase with unique glazing techniques and contemporary design.",
      price: "199.99",
      original_price: "259.99",
      condition: "new",
      stock: 10,
      rating: "4.9",
      review_count: 76,
      sales: 45,
      status: "active",
      is_featured: true,
      is_active: true,
      seller: 6,
      category: 4,
      created_at: "2024-01-14T11:20:00Z",
      updated_at: "2024-01-21T10:10:00Z",
      images: [
        {
          image: "https://images.unsplash.com/photo-1578928675248-a57617d9bb1e?w=400&h=400&fit=crop&crop=center",
          is_primary: true,
          product: 6
        }
      ]
    }
  ]);

  const itemsPerSlide = 4;
  const totalSlides = Math.ceil(products.length / itemsPerSlide);

  // Auto-slide functionality
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % totalSlides);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, totalSlides]);

  const toggleLike = (productId: number) => {
    setLikedProducts(prev => {
      const newLiked = new Set(prev);
      if (newLiked.has(productId)) {
        newLiked.delete(productId);
      } else {
        newLiked.add(productId);
      }
      return newLiked;
    });
  };

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % totalSlides);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + totalSlides) % totalSlides);
    setIsAutoPlaying(false);
  };

  const getDiscountPercentage = (original: string, current: string) => {
    const originalPrice = parseFloat(original);
    const currentPrice = parseFloat(current);
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  };

  // const getCurrentSlideProducts = () => {
  //   const start = currentSlide * itemsPerSlide;
  //   return products.slice(start, start + itemsPerSlide);
  // };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gradient-to-br from-gray-50 to-white">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12">
        <div className="mb-6 lg:mb-0">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">
            New Products
          </h2>
          <p className="text-lg text-gray-600 font-medium">Discover our latest collection of premium cultural artifacts</p>
          <div className="mt-2 h-1 w-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
        </div>
        
        {/* Navigation Controls */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-white rounded-full px-4 py-2 shadow-lg border">
            <button
              onClick={prevSlide}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <ChevronLeft size={20} className="text-gray-600" />
            </button>
            
            <div className="flex space-x-1">
              {Array.from({ length: totalSlides }, (_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setCurrentSlide(i);
                    setIsAutoPlaying(false);
                  }}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i === currentSlide ? 'bg-blue-500 w-6' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            
            <button
              onClick={nextSlide}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <ChevronRight size={20} className="text-gray-600" />
            </button>
          </div>
          
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              isAutoPlaying 
                ? 'bg-blue-500 text-white shadow-lg' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {isAutoPlaying ? 'Pause' : 'Play'}
          </button>
        </div>
      </div>

      {/* Products Carousel */}
      <div className="relative overflow-hidden">
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {Array.from({ length: totalSlides }, (_, slideIndex) => (
            <div key={slideIndex} className="w-full flex-shrink-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.slice(slideIndex * itemsPerSlide, (slideIndex + 1) * itemsPerSlide).map((product) => {
                  const primaryImage = product.images.find(img => img.is_primary) || product.images[0];
                  const discount = getDiscountPercentage(product.original_price, product.price);
                  
                  return (
                    <div key={product.id} className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-gray-200">
                      <div className="relative overflow-hidden">
                        {/* Product Image */}
                        <div className="aspect-square overflow-hidden bg-gray-50">
                          <img 
                            src={primaryImage?.image} 
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                        
                        {/* Discount Badge */}
                        {discount > 0 && (
                          <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                            -{discount}%
                          </div>
                        )}
                        
                        {/* Featured Badge */}
                        {product.is_featured && (
                          <div className="absolute top-4 right-14 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                            Featured
                          </div>
                        )}
                        
                        {/* Heart Icon */}
                        <button 
                          onClick={() => toggleLike(product.id)}
                          className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
                        >
                          <Heart 
                            size={18} 
                            className={`transition-colors duration-200 ${
                              likedProducts.has(product.id) 
                                ? 'fill-red-500 text-red-500' 
                                : 'text-gray-400 hover:text-red-400'
                            }`}
                          />
                        </button>
                        
                        {/* Quick Actions Overlay */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <button className="bg-white text-gray-900 px-4 py-2 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2 transform translate-y-4 group-hover:translate-y-0">
                            <ShoppingCart size={16} />
                            <span>Quick Add</span>
                          </button>
                        </div>
                      </div>
                      
                      {/* Product Info */}
                      <div className="p-6">
                        <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors duration-200">
                          {product.name}
                        </h3>
                        
                        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
                          {product.description}
                        </p>
                        
                        {/* Rating */}
                        <div className="flex items-center space-x-2 mb-3">
                          <div className="flex items-center">
                            <Star size={14} className="fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium text-gray-700 ml-1">{product.rating}</span>
                          </div>
                          <span className="text-xs text-gray-500">({product.review_count} reviews)</span>
                        </div>
                        
                        {/* Price */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-xl font-bold text-gray-900">${product.price}</span>
                            {parseFloat(product.original_price) > parseFloat(product.price) && (
                              <span className="text-sm text-gray-500 line-through">${product.original_price}</span>
                            )}
                          </div>
                          
                          {/* Stock Indicator */}
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                            product.stock > 10 
                              ? 'bg-green-100 text-green-700' 
                              : product.stock > 0 
                                ? 'bg-yellow-100 text-yellow-700' 
                                : 'bg-red-100 text-red-700'
                          }`}>
                            {product.stock > 10 ? 'In Stock' : product.stock > 0 ? `${product.stock} left` : 'Out of Stock'}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Progress Bar */}
      {isAutoPlaying && (
        <div className="mt-8 w-full bg-gray-200 rounded-full h-1">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-1 rounded-full transition-all duration-100"
            style={{ 
              width: `${((currentSlide + 1) / totalSlides) * 100}%`,
              animation: isAutoPlaying ? `progress 4s linear infinite` : 'none'
            }}
          />
        </div>
      )}
      
      <style>{`
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default ModernProductsShowcase;