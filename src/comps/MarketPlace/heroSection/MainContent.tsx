import { ChevronLeft, ChevronRight, Star, Heart, Eye, Percent, Clock, Settings, Loader2, ShoppingCart } from 'lucide-react';

interface ProductImage {
    id: number;
    image: string;
    is_primary: boolean;
    product?: number;
}

interface Product {
    id: number;
    name: string;
    description: string;
    price: string | number;
    original_price?: string | number;
    condition: 'new' | 'used' | 'refurbished';
    rating: number;
    review_count: number;
    stock: number;
    images: ProductImage[];
    is_featured?: boolean;
    category?: any;
    created_at?: string;
    updated_at?: string;
}

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

    return (
        <div className="w-full bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen">
            <div className="container mx-auto px-4 lg:px-6 xl:px-8 py-6 xl:py-12 max-w-full">
                <div className="flex flex-col xl:flex-row gap-6 xl:gap-8">
                    {/* Sidebar - Glass Design */}
                    <aside className={`
                        ${isMobileMenuOpen ? 'block' : 'hidden'} 
                        xl:block xl:w-80 w-full
                        ${isMobileMenuOpen ? 'fixed inset-0 z-50 bg-black/20 xl:relative xl:bg-transparent' : ''}
                    `}>
                        <div className={`
                            bg-white/70 backdrop-blur-xl border border-white/30
                            rounded-3xl p-6 xl:p-8 
                            ${isMobileMenuOpen ? 'absolute right-4 top-4 bottom-4 w-80 max-w-[calc(100vw-2rem)] overflow-y-auto' : ''}
                        `}>
                            <div className="flex items-center justify-between mb-6 xl:mb-8">
                                <h3 className="text-xl xl:text-2xl font-semibold text-gray-900">Browse Gallery</h3>
                                {isMobileMenuOpen && (
                                    <button
                                        className="xl:hidden p-2 text-gray-500 hover:text-gray-700 rounded-xl hover:bg-white/50"
                                        onClick={() => { }} // Add close functionality
                                    >
                                        ×
                                    </button>
                                )}
                            </div>

                            <ul className="space-y-2 xl:space-y-3">
                                {sidebarCategories.map((category, index) => (
                                    <li key={index}>
                                        <button className="
                                            w-full text-left text-gray-700 hover:text-indigo-600 hover:bg-indigo-50/70
                                            px-4 xl:px-6 py-3 xl:py-4 rounded-2xl
                                            transition-all duration-300 font-medium text-sm xl:text-base
                                            border border-transparent hover:border-indigo-200/50
                                            backdrop-blur-sm
                                        ">
                                            {category}
                                        </button>
                                    </li>
                                ))}
                            </ul>

                            <button className="
                                text-indigo-600 hover:text-indigo-700 mt-6 xl:mt-8 font-semibold 
                                flex items-center space-x-3 px-4 xl:px-6 text-sm xl:text-base
                                py-3 rounded-2xl hover:bg-indigo-50/70 transition-all duration-300
                                border border-indigo-200/50 hover:border-indigo-300/70 w-full justify-center
                                backdrop-blur-sm
                            ">
                                <span>See all categories</span>
                                <ChevronRight className="w-4 h-4 xl:w-5 xl:h-5 transition-transform group-hover:translate-x-1" />
                            </button>
                        </div>
                    </aside>

                    {/* Main Content Area */}
                    <main className="flex-1 min-w-0">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
                            {/* Hero Section with Product Slider */}
                            <div className="lg:col-span-8">
                                {isLoadingProducts ? (
                                    <div className="
                                        bg-white/70 backdrop-blur-xl border border-white/30
                                        rounded-3xl p-8 xl:p-12 
                                        h-80 lg:h-96 xl:h-[32rem] flex items-center justify-center
                                    ">
                                        <div className="flex items-center space-x-4 text-gray-500">
                                            <Loader2 className="w-6 h-6 xl:w-8 xl:h-8 animate-spin text-indigo-600" />
                                            <span className="font-medium text-base xl:text-lg">Loading featured products...</span>
                                        </div>
                                    </div>
                                ) : featuredProducts.length > 0 && currentProduct ? (
                                    <div className="
                                        bg-white/70 backdrop-blur-xl border border-white/30
                                        rounded-3xl p-6 xl:p-12 
                                        min-h-80 lg:min-h-96 xl:min-h-[32rem] 
                                        flex flex-col lg:flex-row items-center 
                                        relative overflow-hidden
                                    ">
                                        {/* Navigation Arrows */}
                                        {featuredProducts.length > 1 && (
                                            <>
                                                <button
                                                    onClick={prevSlide}
                                                    className="
                                                        absolute left-4 xl:left-6 top-1/2 transform -translate-y-1/2 z-30 
                                                        bg-white/80 backdrop-blur-sm hover:bg-white/90 p-3 xl:p-4 rounded-2xl 
                                                        border border-white/40
                                                        transition-all duration-300 hover:scale-110
                                                    "
                                                >
                                                    <ChevronLeft className="w-5 h-5 xl:w-6 xl:h-6 text-gray-700" />
                                                </button>
                                                <button
                                                    onClick={nextSlide}
                                                    className="
                                                        absolute right-4 xl:right-6 top-1/2 transform -translate-y-1/2 z-30 
                                                        bg-white/80 backdrop-blur-sm hover:bg-white/90 p-3 xl:p-4 rounded-2xl 
                                                        border border-white/40
                                                        transition-all duration-300 hover:scale-110
                                                    "
                                                >
                                                    <ChevronRight className="w-5 h-5 xl:w-6 xl:h-6 text-gray-700" />
                                                </button>
                                            </>
                                        )}

                                        {/* Product Content */}
                                        <div className="flex-1 z-20 lg:pr-8 xl:pr-12 order-2 lg:order-1 mt-6 lg:mt-0">
                                            <div className="flex items-center space-x-3 mb-4">
                                                <div className="w-6 h-6 xl:w-8 xl:h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                                                    <Star className="w-3 h-3 xl:w-4 xl:h-4 text-white" />
                                                </div>
                                                <span className="
                                                    text-indigo-600 font-semibold bg-indigo-50/70 backdrop-blur-sm
                                                    px-3 xl:px-4 py-1 xl:py-2 rounded-full text-xs 
                                                    border border-indigo-200/50
                                                ">
                                                    Featured Product
                                                </span>
                                            </div>

                                            <div className="mb-3 xl:mb-4">
                                                <span className="
                                                    text-xs xl:text-base text-gray-600 font-medium 
                                                    bg-gray-100/70 backdrop-blur-sm px-3 py-1 rounded-full
                                                    border border-gray-200/50
                                                ">
                                                    {currentProduct.condition === 'new' ? 'Brand New' : 'Pre-owned'}
                                                </span>
                                            </div>

                                            <h1 className="
                                                text-xl sm:text-3xl lg:text-2xl xl:text-5xl 
                                                font-bold text-gray-900 mb-3 xl:mb-4 
                                                leading-tight
                                            ">
                                                {currentProduct.name}
                                            </h1>

                                            <p className="
                                                text-gray-600 mb-6 xl:mb-8 
                                                text-base lg:text-lg xl:text-xl 
                                                leading-relaxed line-clamp-3 lg:line-clamp-4
                                            ">
                                                {currentProduct.description}
                                            </p>

                                            {/* Price Display */}
                                            <div className="flex items-center flex-wrap gap-3 xl:gap-4 mb-6 xl:mb-10">
                                                <span className="text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900">
                                                    {formatPrice(currentProduct.price)}
                                                </span>
                                                {currentProduct.original_price && currentProduct.original_price !== currentProduct.price && (
                                                    <>
                                                        <span className="text-lg xl:text-xl text-gray-400 line-through">
                                                            {formatPrice(currentProduct.original_price)}
                                                        </span>
                                                        <span className="
                                                            bg-red-50/70 backdrop-blur-sm text-red-600 px-3 xl:px-4 py-1 xl:py-2 
                                                            rounded-full text-sm xl:text-base font-semibold
                                                            border border-red-200/50
                                                        ">
                                                            Save {Math.round((1 - Number(currentProduct.price) / Number(currentProduct.original_price)) * 100)}%
                                                        </span>
                                                    </>
                                                )}
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex flex-wrap gap-3 xl:gap-4 mb-6 xl:mb-8">
                                                <button className="
                                                    bg-white/80 backdrop-blur-sm text-gray-700 border border-gray-200/50
                                                    hover:border-indigo-300/70 hover:text-indigo-600 hover:bg-indigo-50/70
                                                    px-6 xl:px-8 py-3 xl:py-4 rounded-2xl 
                                                    transition-all duration-300 font-semibold 
                                                    flex items-center space-x-3 text-sm xl:text-base
                                                ">
                                                    <Eye className="w-4 h-4 xl:w-5 xl:h-5" />
                                                    <span>View Details</span>
                                                </button>

                                                <button className="
                                                    bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white 
                                                    px-6 xl:px-8 py-3 xl:py-4 rounded-2xl 
                                                    transition-all duration-300 font-semibold 
                                                    flex items-center space-x-3 text-sm xl:text-base
                                                    hover:scale-105
                                                ">
                                                    <ShoppingCart className="w-4 h-4 xl:w-5 xl:h-5" />
                                                    <span>Add to Cart</span>
                                                </button>

                                                <button className="
                                                    p-3 xl:p-4 text-gray-500 hover:text-red-500 
                                                    hover:bg-red-50/70 backdrop-blur-sm rounded-2xl 
                                                    transition-all duration-300 border border-gray-200/50 
                                                    hover:border-red-200/50
                                                ">
                                                    <Heart className="w-5 h-5 xl:w-6 xl:h-6" />
                                                </button>
                                            </div>

                                            {/* Product Info */}
                                            <div className="flex items-center flex-wrap gap-4 xl:gap-6 text-sm xl:text-base text-gray-500">
                                                <div className="flex items-center space-x-2 bg-amber-50/70 backdrop-blur-sm px-3 py-2 rounded-xl border border-amber-200/50">
                                                    <Star className="w-4 h-4 xl:w-5 xl:h-5 fill-current text-amber-400" />
                                                    <span className="font-medium text-gray-700">
                                                        {currentProduct.rating} ({currentProduct.review_count} reviews)
                                                    </span>
                                                </div>
                                                <div className={`px-3 py-2 rounded-xl border backdrop-blur-sm ${currentProduct.stock > 0
                                                        ? 'bg-emerald-50/70 border-emerald-200/50 text-emerald-700'
                                                        : 'bg-red-50/70 border-red-200/50 text-red-600'
                                                    }`}>
                                                    <span className="font-medium">Stock: </span>
                                                    <span className="font-semibold">
                                                        {currentProduct.stock > 0 ? `${currentProduct.stock} available` : 'Out of stock'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Product Image */}
                                        <div className="flex-1 flex items-center justify-center relative order-1 lg:order-2 mb-6 lg:mb-0">
                                            <div className="
                                                w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 xl:w-80 xl:h-80 
                                                rounded-3xl overflow-hidden 
                                                border border-white/40 bg-white/80 backdrop-blur-sm
                                                transform hover:scale-105 transition-transform duration-500
                                            ">
                                                <img
                                                    src={getProductImage(currentProduct)}
                                                    alt={currentProduct.name}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.currentTarget.src = 'https://via.placeholder.com/400x300?text=No+Image';
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        {/* Slide Indicators */}
                                        {featuredProducts.length > 1 && (
                                            <div className="absolute bottom-4 xl:bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 xl:space-x-3 z-20 order-3">
                                                {featuredProducts.map((_, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => setCurrentSlide(index)}
                                                        className={`h-2 xl:h-3 rounded-full transition-all duration-300 ${index === currentSlide
                                                                ? 'bg-indigo-600 w-8 xl:w-12'
                                                                : 'bg-gray-300/70 backdrop-blur-sm w-2 xl:w-3 hover:bg-gray-400/70'
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="
                                        bg-white/70 backdrop-blur-xl border border-white/30
                                        rounded-3xl p-8 xl:p-12 
                                        h-80 lg:h-96 xl:h-[32rem] flex items-center justify-center
                                    ">
                                        <div className="text-center">
                                            <div className="w-16 h-16 xl:w-24 xl:h-24 bg-gray-100/70 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-4 xl:mb-6 border border-gray-200/50">
                                                <ShoppingCart className="w-8 h-8 xl:w-12 xl:h-12 text-gray-400" />
                                            </div>
                                            <h3 className="text-xl xl:text-2xl font-semibold text-gray-900 mb-2 xl:mb-3">No Featured Products</h3>
                                            <p className="text-gray-500 text-base xl:text-lg">Check back later for featured items</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Action Cards */}
                            <div className="lg:col-span-4 space-y-4 lg:space-y-6 xl:space-y-8">
                                <div className="
                                    bg-gradient-to-br from-orange-400 to-orange-600 
                                    text-white p-6 xl:p-8 rounded-3xl 
                                    hover:from-orange-500 hover:to-orange-700 
                                    transition-all duration-300 cursor-pointer 
                                    transform hover:scale-105
                                    border border-orange-300/30 backdrop-blur-sm
                                ">
                                    <div className="flex items-center justify-between mb-3 xl:mb-4">
                                        <h3 className="text-lg xl:text-xl font-bold">Get 10% Off</h3>
                                        <div className="w-12 h-12 xl:w-14 xl:h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
                                            <Percent className="w-6 h-6 xl:w-7 xl:h-7" />
                                        </div>
                                    </div>
                                    <p className="text-orange-100 text-base xl:text-lg font-medium">on your first purchase</p>
                                </div>

                                <div className="
                                    bg-gradient-to-br from-teal-400 to-teal-600 
                                    text-white p-6 xl:p-8 rounded-3xl 
                                    hover:from-teal-500 hover:to-teal-700 
                                    transition-all duration-300 cursor-pointer 
                                    transform hover:scale-105
                                    border border-teal-300/30 backdrop-blur-sm
                                ">
                                    <div className="flex items-center justify-between mb-3 xl:mb-4">
                                        <h3 className="text-lg xl:text-xl font-bold">Free Consultation</h3>
                                        <div className="w-12 h-12 xl:w-14 xl:h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
                                            <Settings className="w-6 h-6 xl:w-7 xl:h-7" />
                                        </div>
                                    </div>
                                    <p className="text-teal-100 text-base xl:text-lg font-medium">Heritage preservation advice</p>
                                </div>

                                <div className="
                                    bg-gradient-to-br from-purple-400 to-purple-600 
                                    text-white p-6 xl:p-8 rounded-3xl 
                                    hover:from-purple-500 hover:to-purple-700 
                                    transition-all duration-300 cursor-pointer 
                                    transform hover:scale-105
                                    border border-purple-300/30 backdrop-blur-sm
                                ">
                                    <div className="flex items-center justify-between mb-3 xl:mb-4">
                                        <h3 className="text-lg xl:text-xl font-bold">Limited Collection</h3>
                                        <div className="w-12 h-12 xl:w-14 xl:h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
                                            <Clock className="w-6 h-6 xl:w-7 xl:h-7" />
                                        </div>
                                    </div>
                                    <p className="text-purple-100 text-base xl:text-lg font-medium">Exclusive heritage pieces</p>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default MainContent;