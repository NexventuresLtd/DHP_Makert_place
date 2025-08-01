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
        <div className="max-w-full md:max-w-11/12 m-auto bg-gray-50">
            <div className="mx-auto px-4 sm:px-6 py-6">
                {/* Modern Layout with Better Spacing */}
                <div className="flex flex-col xl:flex-row gap-4 md:gap-6 h-full">

                    {/* Redesigned Sidebar - Clean Card */}
                    <aside className={`${isMobileMenuOpen ? 'block' : 'hidden'} xl:block xl:w-72 2xl:w-80`}>
                        <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6 h-full">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-lg md:text-xl font-semibold text-gray-800">Categories</h3>
                                    <p className="text-xs text-gray-500">Discover by category</p>
                                </div>
                                {isMobileMenuOpen && (
                                    <button className="xl:hidden p-1.5 rounded-md hover:bg-gray-100 transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                {sidebarCategories.map((category, index) => (
                                    <button
                                        key={index}
                                        className="w-full group flex items-center justify-between p-3 rounded-lg transition-all duration-200 hover:bg-gray-50 border border-transparent hover:border-gray-200"
                                    >
                                        <span className="text-sm font-medium text-gray-700 group-hover:text-emerald-600 transition-colors">
                                            {category}
                                        </span>
                                        <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-emerald-500 transition-all group-hover:translate-x-0.5" />
                                    </button>
                                ))}
                            </div>

                            <button className="w-full mt-6 p-3 rounded-lg border border-dashed border-gray-300 hover:border-emerald-400 hover:bg-emerald-50 text-gray-600 hover:text-emerald-600 text-sm font-medium transition-all duration-200 group">
                                <span className="flex items-center justify-center space-x-1.5">
                                    <span>View All Categories</span>
                                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                                </span>
                            </button>
                        </div>
                    </aside>

                    {/* Main Hero Section - Clean Card Layout */}
                    <div className="flex-1 flex flex-col lg:flex-row gap-4 md:gap-6 h-[550px] ">

                        {/* Product Showcase - Equal Height Container */}
                        <div className="flex-1 bg-white rounded-xl overflow-hidden border border-gray-200">
                            {isLoadingProducts ? (
                                <div className="h-[400px] lg:h-[500px] overflow-y-auto flex items-center justify-center">
                                    <div className="text-center space-y-3">
                                        <div className="relative">
                                            <div className="w-12 h-12 bg-emerald-500 rounded-xl mx-auto flex items-center justify-center">
                                                <Loader2 className="w-6 h-6 text-white animate-spin" />
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-600">Loading products...</p>
                                    </div>
                                </div>
                            ) : featuredProducts.length > 0 && currentProduct ? (
                                <div className="h-full flex flex-col lg:flex-row relative">

                                    {/* Product Image */}
                                    <div className="relative lg:w-1/2 h-1/2 lg:h-full overflow-hidden">
                                        <img
                                            src={getProductImage(currentProduct)}
                                            alt={currentProduct.name}
                                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                            onError={(e) => {
                                                e.currentTarget.src = 'https://via.placeholder.com/800x600/f8fafc/64748b?text=Product+Image';
                                            }}
                                        />

                                        {/* Badges */}
                                        <div className="absolute top-4 left-4 z-20 flex flex-col space-y-2">
                                            <div className="flex items-center space-x-1.5">
                                                <span className="px-2.5 py-1 rounded-full bg-emerald-500 text-white text-xs font-medium flex items-center space-x-1">
                                                    <Zap className="w-2.5 h-2.5" />
                                                    <span>Featured</span>
                                                </span>
                                            </div>
                                            <span className="px-2.5 py-1 rounded-full bg-white text-gray-800 text-xs font-medium border border-gray-200">
                                                {currentProduct.condition === 'new' ? '✨ New' : '💎 Pre-owned'}
                                            </span>
                                        </div>

                                        {/* Heart Icon */}
                                        <button className="absolute top-4 right-4 z-20 w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-50 transition-all">
                                            <Heart className="w-4 h-4 text-gray-600 hover:text-red-500 transition-colors" />
                                        </button>
                                    </div>

                                    {/* Product Details */}
                                    <div className="lg:w-1/2 h-1/2 lg:h-full p-4 md:p-6 flex flex-col justify-between bg-[url('/images/research.png')] bg-cover bg-center bg-no-repeat bg-blend-overlay bg-white/95 backdrop-blur-3xl">

                                        <div className="space-y-4">
                                            {/* Title */}
                                            <div>
                                                <h1 className="text-xl md:text-2xl font-semibold text-gray-800 leading-tight mb-2">
                                                    {currentProduct.name}
                                                </h1>
                                                <p className="text-gray-600 text-xs md:text-sm line-clamp-2">
                                                    {currentProduct.description}
                                                </p>
                                            </div>

                                            {/* Price Section */}
                                            <div className="space-y-2">
                                                <div className="flex items-center flex-wrap gap-2">
                                                    <span className="text-2xl md:text-3xl font-semibold text-emerald-600">
                                                        {formatPrice(currentProduct.price)}
                                                    </span>
                                                    {currentProduct.original_price && currentProduct.original_price !== currentProduct.price && (
                                                        <>
                                                            <span className="text-base text-gray-400 line-through">
                                                                {formatPrice(currentProduct.original_price)}
                                                            </span>
                                                            <span className="text-xs font-medium text-white bg-red-500 px-2 py-1 rounded-full">
                                                                -{Math.round((1 - Number(currentProduct.price) / Number(currentProduct.original_price)) * 100)}%
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Rating & Stock */}
                                            <div className="flex items-center flex-wrap gap-2">
                                                <div className="flex items-center space-x-1.5 bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
                                                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                                    <span className="text-xs font-medium text-amber-700">
                                                        {currentProduct.rating}
                                                    </span>
                                                    <span className="text-xs text-amber-600">
                                                        ({currentProduct.review_count})
                                                    </span>
                                                </div>
                                                <div className={`px-3 py-1 rounded-full text-xs font-medium border ${currentProduct.stock > 0
                                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                        : 'bg-red-50 text-red-600 border-red-200'
                                                    }`}>
                                                    <div className="flex items-center space-x-1.5">
                                                        <div className={`w-1.5 h-1.5 rounded-full ${currentProduct.stock > 0 ? 'bg-emerald-500' : 'bg-red-500'
                                                            }`}></div>
                                                        <span>
                                                            {currentProduct.stock > 0 ? `${currentProduct.stock} in stock` : 'Out of stock'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex flex-col sm:flex-row gap-2 mt-4">
                                            <button
                                                onClick={() => {
                                                    setSelectedProduct(currentProduct);
                                                    setIsModalOpen(true);
                                                }}
                                                className="flex-1 px-4 py-3 rounded-xl border bg-second  text-white hover:text-white text-sm font-medium flex items-center justify-center space-x-1.5 transition-all hover:bg-[#b85d1b]"
                                            >
                                                <Eye className="w-4 h-4" />
                                                <span>Quick View</span>
                                            </button>

                                            <button
                                                onClick={() => { setSelectedProduct(currentProduct); setIsModalOpen(true); }}
                                                className="flex-1 px-4 py-3 rounded-xl bg-primary text-white text-sm font-medium flex items-center justify-center space-x-1.5 transition-all"
                                            >
                                                <ShoppingCart className="w-4 h-4" />
                                                <span>Add to Cart</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Navigation */}
                                    {featuredProducts.length > 1 && (
                                        <>
                                            <button
                                                onClick={prevSlide}
                                                className="absolute left-2 top-1/2 transform -translate-y-1/2 z-30 w-8 h-8 bg-white rounded-full hover:bg-gray-50 transition-all flex items-center justify-center border border-gray-200"
                                            >
                                                <ChevronLeft className="w-4 h-4 text-gray-700" />
                                            </button>
                                            <button
                                                onClick={nextSlide}
                                                className="absolute right-2 top-1/2 transform -translate-y-1/2 z-30 w-8 h-8 bg-white rounded-full hover:bg-gray-50 transition-all flex items-center justify-center border border-gray-200"
                                            >
                                                <ChevronRight className="w-4 h-4 text-gray-700" />
                                            </button>
                                        </>
                                    )}

                                    {/* Slide Indicators */}
                                    {featuredProducts.length > 1 && (
                                        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1.5 z-20">
                                            {featuredProducts.map((_, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => setCurrentSlide(index)}
                                                    className={`h-1.5 rounded-full transition-all duration-300 ${index === currentSlide
                                                        ? 'bg-gray-800 w-6'
                                                        : 'bg-gray-300 w-1.5 hover:bg-gray-400'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="h-[400px] lg:h-[500px] overflow-y-auto flex items-center justify-center">
                                    <div className="text-center space-y-4">
                                        <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto">
                                            <ShoppingCart className="w-6 h-6 text-gray-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800 mb-1">No Featured Products</h3>
                                            <p className="text-xs text-gray-500">Exciting products coming soon!</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Promo Cards - Clean Cards */}
                        <div className="lg:w-72 xl:w-80 flex flex-col gap-3">
                            {/* First Purchase Card */}
                            <div className="bg-orange-500 rounded-xl p-4 text-white relative overflow-hidden">
                                <div className="relative z-10">
                                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-3">
                                        <Percent className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-base font-semibold mb-1">First Purchase?</h3>
                                    <p className="text-orange-100 text-xs mb-4">Get 10% off your first order with code WELCOME10</p>
                                    <button className="w-full py-2 bg-white/20 hover:bg-white/30 text-xs font-medium rounded-lg transition-all border border-white/20">
                                        Claim Offer
                                    </button>
                                </div>
                            </div>

                            {/* Help Card */}
                            <div className="bg-blue-500 rounded-xl p-4 text-white relative overflow-hidden">
                                <div className="relative z-10">
                                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-3">
                                        <Shield className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-base font-semibold mb-1">Expert Support</h3>
                                    <p className="text-blue-100 text-xs mb-4">Free consultation with our experts available 24/7</p>
                                    <button className="w-full py-2 bg-white/20 hover:bg-white/30 text-xs font-medium rounded-lg transition-all border border-white/20">
                                        Get Help
                                    </button>
                                </div>
                            </div>

                            {/* Limited Edition Card */}
                            <div className="bg-purple-500 rounded-xl p-4 text-white relative overflow-hidden">
                                <div className="relative z-10">
                                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-3">
                                        <Clock className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-base font-semibold mb-1">Limited Edition</h3>
                                    <p className="text-purple-100 text-xs mb-4">Exclusive pieces - limited time collection</p>
                                    <button className="w-full py-2 bg-white/20 hover:bg-white/30 text-xs font-medium rounded-lg transition-all border border-white/20">
                                        Explore Now
                                    </button>
                                </div>
                            </div>
                        </div>
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
        </div>
    );
};

export default MainContent;