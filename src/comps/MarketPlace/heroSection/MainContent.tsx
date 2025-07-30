import { ChevronLeft, ChevronRight, Star, Eye, Percent, Clock, Settings, Loader2, ShoppingCart, ArrowRight, Zap, Shield, Heart } from 'lucide-react';
import ProductDetailModal from '../../dashboard/AdminProduct/ViewMoreDetails';
import { useState } from 'react';
import type { Product } from '../../../types/marketTypes';

interface MainContentProps {
    isMobileMenuOpen: boolean;
    categories: string[];
    featuredProducts: Product[];
    isLoadingProducts: boolean;
    currentSlide: number;
    setCurrentSlide: (slide: number) => void;
    nextSlide: () => void;
    prevSlide: () => void;
    formatPrice: (price: string | number | undefined) => string;
    getProductImage: (product: Product | undefined) => string;
}

const MainContent = ({
    isMobileMenuOpen,
    categories,
    featuredProducts,
    isLoadingProducts,
    currentSlide,
    setCurrentSlide,
    nextSlide,
    prevSlide,
    formatPrice,
    getProductImage
}: MainContentProps) => {
    const currentProduct = featuredProducts[currentSlide];
    const sidebarCategories = categories.length > 0 ? categories : ['All category'];
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    return (
        <div className="w-full bg-gradient-to-br from-slate-50 to-gray-100">
            <div className=" mx-auto px-4 sm:px-6 py-6">
                {/* Modern Layout with Better Spacing */}
                <div className="flex flex-col xl:flex-row gap-6 h-full">
                    
                    {/* Redesigned Sidebar - Floating Modern Card */}
                    <aside className={`${isMobileMenuOpen ? 'block' : 'hidden'} xl:block xl:w-80 2xl:w-96`}>
                        <div className="bg-white rounded-3xl  border border-gray-100 p-6 h-full backdrop-blur-sm">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-1">Categories</h3>
                                    <p className="text-sm text-gray-500">Discover by category</p>
                                </div>
                                {isMobileMenuOpen && (
                                    <button className="xl:hidden p-2 rounded-full hover:bg-gray-100 transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                )}
                            </div>

                            <div className="space-y-2">
                                {sidebarCategories.map((category, index) => (
                                    <button 
                                        key={index}
                                        className="w-full group flex items-center justify-between p-4 rounded-2xl transition-all duration-200 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 hover: border border-transparent hover:border-emerald-100"
                                    >
                                        <span className="font-medium text-gray-700 group-hover:text-emerald-700 transition-colors">
                                            {category}
                                        </span>
                                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-emerald-500 transition-all group-hover:translate-x-1" />
                                    </button>
                                ))}
                            </div>

                            <button className="w-full mt-8 p-4 rounded-2xl border-2 border-dashed border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 text-gray-600 hover:text-emerald-600 font-medium transition-all duration-300 group">
                                <span className="flex items-center justify-center space-x-2">
                                    <span>View All Categories</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </button>
                        </div>
                    </aside>

                    {/* Main Hero Section - Modern Card Layout */}
                    <div className="flex-1 flex flex-col lg:flex-row gap-6">
                        
                        {/* Product Showcase - Equal Height Container */}
                        <div className="flex-1 bg-white rounded-3xl  overflow-hidden border border-gray-100">
                            {isLoadingProducts ? (
                                <div className="h-[500px] lg:h-[600px] flex items-center justify-center">
                                    <div className="text-center space-y-4">
                                        <div className="relative">
                                            <div className="w-16 h-16 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-2xl mx-auto flex items-center justify-center">
                                                <Loader2 className="w-8 h-8 text-white animate-spin" />
                                            </div>
                                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-2xl animate-pulse opacity-20"></div>
                                        </div>
                                        <p className="text-gray-600 font-medium">Loading amazing products...</p>
                                    </div>
                                </div>
                            ) : featuredProducts.length > 0 && currentProduct ? (
                                <div className="h-full flex flex-col lg:flex-row relative bg-white/20">
                                    
                                    {/* Product Image - Exactly Half Height */}
                                    <div className="relative lg:w-1/2 h-1/2 lg:h-full overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-emerald-900/30 via-transparent to-transparent z-10"></div>
                                        <img
                                            src={getProductImage(currentProduct)}
                                            alt={currentProduct.name}
                                            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                                            onError={(e) => {
                                                e.currentTarget.src = 'https://via.placeholder.com/800x600/f8fafc/64748b?text=Product+Image';
                                            }}
                                        />
                                        
                                        {/* Modern Floating Badges */}
                                        <div className="absolute top-6 left-6 z-20 flex flex-col space-y-3">
                                            <div className="flex items-center space-x-2">
                                                <span className="px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-bold backdrop-blur-sm flex items-center space-x-1">
                                                    <Zap className="w-3 h-3" />
                                                    <span>Featured</span>
                                                </span>
                                            </div>
                                            <span className="px-4 py-2 rounded-full bg-white/90 backdrop-blur-md text-gray-800 text-xs font-semibold border border-white/20">
                                                {currentProduct.condition === 'new' ? '✨ New' : '💎 Pre-owned'}
                                            </span>
                                        </div>

                                        {/* Heart Icon */}
                                        <button className="absolute top-6 right-6 z-20 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white transition-all hover:scale-105">
                                            <Heart className="w-5 h-5 text-gray-600 hover:text-red-500 transition-colors" />
                                        </button>
                                    </div>

                                    {/* Product Details - Exactly Half Height */}
                                    <div className="lg:w-1/2 h-1/2 lg:h-full p-6 lg:p-8 flex flex-col justify-between">
                                        <div className="space-y-6">
                                            {/* Title */}
                                            <div>
                                                <h1 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 leading-tight mb-3">
                                                    {currentProduct.name}
                                                </h1>
                                                <p className="text-gray-600 text-sm lg:text-base line-clamp-2 lg:line-clamp-3">
                                                    {currentProduct.description}
                                                </p>
                                            </div>

                                            {/* Price Section */}
                                            <div className="space-y-3">
                                                <div className="flex items-center flex-wrap gap-3">
                                                    <span className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                                                        {formatPrice(currentProduct.price)}
                                                    </span>
                                                    {currentProduct.original_price && currentProduct.original_price !== currentProduct.price && (
                                                        <>
                                                            <span className="text-lg text-gray-400 line-through">
                                                                {formatPrice(currentProduct.original_price)}
                                                            </span>
                                                            <span className="text-xs font-bold text-white bg-gradient-to-r from-red-500 to-pink-500 px-3 py-1.5 rounded-full ">
                                                                -{Math.round((1 - Number(currentProduct.price) / Number(currentProduct.original_price)) * 100)}%
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Rating & Stock */}
                                            <div className="flex items-center flex-wrap gap-3">
                                                <div className="flex items-center space-x-2 bg-gradient-to-r from-amber-50 to-orange-50 px-4 py-2 rounded-full border border-amber-100">
                                                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                                    <span className="text-sm font-semibold text-amber-700">
                                                        {currentProduct.rating}
                                                    </span>
                                                    <span className="text-xs text-amber-600">
                                                        ({currentProduct.review_count} reviews)
                                                    </span>
                                                </div>
                                                <div className={`px-4 py-2 rounded-full text-sm font-semibold border ${
                                                    currentProduct.stock > 0 
                                                        ? 'bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 border-emerald-200' 
                                                        : 'bg-gradient-to-r from-red-50 to-pink-50 text-red-600 border-red-200'
                                                }`}>
                                                    <div className="flex items-center space-x-2">
                                                        <div className={`w-2 h-2 rounded-full ${
                                                            currentProduct.stock > 0 ? 'bg-emerald-500' : 'bg-red-500'
                                                        }`}></div>
                                                        <span>
                                                            {currentProduct.stock > 0 ? `${currentProduct.stock} in stock` : 'Out of stock'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex flex-col sm:flex-row gap-3 mt-6">
                                            <button
                                                onClick={() => { setSelectedProduct(currentProduct); setIsModalOpen(true); }}
                                                className="flex-1 px-6 py-4 rounded-2xl border-2 border-gray-200 hover:border-emerald-300 text-gray-700 hover:text-emerald-600 font-semibold flex items-center justify-center space-x-2 transition-all hover:bg-emerald-50 group"
                                            >
                                                <Eye className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                                <span>Quick View</span>
                                            </button>
                                            <button
                                                onClick={() => { setSelectedProduct(currentProduct); setIsModalOpen(true); }}
                                                className="flex-1 px-6 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold flex items-center justify-center space-x-2 transition-all  hover:scale-105"
                                            >
                                                <ShoppingCart className="w-5 h-5" />
                                                <span>Add to Cart</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Navigation - Modern Floating Style */}
                                    {featuredProducts.length > 1 && (
                                        <>
                                            <button
                                                onClick={prevSlide}
                                                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-30 w-12 h-12 bg-white/90 backdrop-blur-md rounded-full  hover:bg-white hover:scale-110 transition-all flex items-center justify-center border border-white/20"
                                            >
                                                <ChevronLeft className="w-6 h-6 text-gray-700" />
                                            </button>
                                            <button
                                                onClick={nextSlide}
                                                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-30 w-12 h-12 bg-white/90 backdrop-blur-md rounded-full  hover:bg-white hover:scale-110 transition-all flex items-center justify-center border border-white/20"
                                            >
                                                <ChevronRight className="w-6 h-6 text-gray-700" />
                                            </button>
                                        </>
                                    )}

                                    {/* Slide Indicators - Modern Pills */}
                                    {featuredProducts.length > 1 && (
                                        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
                                            {featuredProducts.map((_, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => setCurrentSlide(index)}
                                                    className={`h-2 rounded-full transition-all duration-300 ${index === currentSlide
                                                        ? 'bg-white w-8'
                                                        : 'bg-white/50 w-2 hover:bg-white/70'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="h-[500px] lg:h-[600px] flex items-center justify-center">
                                    <div className="text-center space-y-6">
                                        <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto">
                                            <ShoppingCart className="w-10 h-10 text-gray-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Featured Products</h3>
                                            <p className="text-gray-500">Exciting products coming soon!</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Promo Cards - Modern Gradient Cards */}
                        <div className="lg:w-80 xl:w-96 flex flex-col gap-4">
                            {/* First Purchase Card */}
                            <div className="bg-gradient-to-br from-orange-500 via-orange-600 to-red-500 rounded-3xl p-6 text-white  relative overflow-hidden group hover:shadow-2xl transition-all duration-300">
                                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="relative z-10">
                                    <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <Percent className="w-7 h-7" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">First Purchase?</h3>
                                    <p className="text-orange-100 text-sm mb-6">Get 10% off your first order with code WELCOME10</p>
                                    <button className="w-full py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl font-semibold transition-all hover:scale-105 border border-white/20">
                                        Claim Offer
                                    </button>
                                </div>
                            </div>

                            {/* Help Card */}
                            <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-3xl p-6 text-white  relative overflow-hidden group hover:shadow-2xl transition-all duration-300">
                                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="relative z-10">
                                    <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <Shield className="w-7 h-7" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">Expert Support</h3>
                                    <p className="text-blue-100 text-sm mb-6">Free consultation with our heritage experts available 24/7</p>
                                    <button className="w-full py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl font-semibold transition-all hover:scale-105 border border-white/20">
                                        Get Help
                                    </button>
                                </div>
                            </div>

                            {/* Limited Edition Card */}
                            <div className="bg-gradient-to-br from-purple-500 via-purple-600 to-pink-600 rounded-3xl p-6 text-white  relative overflow-hidden group hover:shadow-2xl transition-all duration-300">
                                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="relative z-10">
                                    <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <Clock className="w-7 h-7" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">Limited Edition</h3>
                                    <p className="text-purple-100 text-sm mb-6">Exclusive heritage pieces - limited time collection</p>
                                    <button className="w-full py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl font-semibold transition-all hover:scale-105 border border-white/20">
                                        Explore Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Enhanced Modal */}
            {selectedProduct && isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
                    <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 animate-in slide-in-from-bottom-4 duration-300">
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

export default MainContent;