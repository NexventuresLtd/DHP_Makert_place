import { useState, useEffect } from 'react';
import {
    Search,
    ShoppingCart,
    User,
    Settings,
    Home,
    ChevronDown,
    Menu,
    X,
    Settings2,
    ChevronLeft,
    ChevronRight,
    Star,
    Heart,
    Eye,
    Percent,
    Clock,
    LogOut,
    Loader2
} from 'lucide-react';
import mainAxios from '../Instance/mainAxios';
import { getUserInfo, isLoggedIn } from '../../app/Localstorage';
import { Logout_action } from '../../app/SharedUtilities';

interface Category {
    id: number;
    name: string;
    slug?: string;
    image?: string;
}

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
    category?: number | Category;
    created_at?: string;
    updated_at?: string;
}

interface UserInfo {
    username: string;
    email?: string;
    first_name?: string;
    last_name?: string;
    avatar?: string;
}

const ModernEcommerceLayout = () => {
    const [selectedCategory, setSelectedCategory] = useState<string>('All category');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
    const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState<boolean>(false);
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState<boolean>(false);
    const [selectedCountry, setSelectedCountry] = useState<string>('Rwanda, RWF');
    const [currentSlide, setCurrentSlide] = useState<number>(0);
    const [user, setUser] = useState<UserInfo | null>(null);

    const [categories, setCategories] = useState<string[]>([]);
    const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
    const [isLoadingCategories, setIsLoadingCategories] = useState<boolean>(true);
    const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(true);

    const fetchCategories = async (): Promise<void> => {
        try {
            setIsLoadingCategories(true);
            const response = await mainAxios.get<Category[]>('/market/categories/', {
                headers: {
                    'accept': 'application/json'
                }
            });

            setCategories(['All category', ...response.data.map(cat => cat.name)]);
        } catch (error) {
            console.error('Error fetching categories:', error);
            setCategories(['All category']);
        } finally {
            setIsLoadingCategories(false);
        }
    };

    const fetchFeaturedProducts = async (): Promise<void> => {
        try {
            setIsLoadingProducts(true);
            const response = await mainAxios.get<Product[]>('/market/products/', {
                params: {
                    is_featured: true,
                },
                headers: {
                    Accept: 'application/json',
                },
            });

            setFeaturedProducts(response.data || []);
            console.log('Featured products:', response.data);
        } catch (error) {
            console.error('Error fetching featured products:', error);
            setFeaturedProducts([]);
        } finally {
            setIsLoadingProducts(false);
        }
    };

    useEffect(() => {
        fetchCategories();
        fetchFeaturedProducts();

        if (isLoggedIn) {
            const userData = getUserInfo;
            if (userData) {
                setUser(userData as UserInfo);
            }
        }
    }, []);

    const handleSearch = (): void => {
        console.log('Searching for:', searchQuery, 'in category:', selectedCategory);
        // Implement actual search functionality here
    };

    const handleLogout = (): void => {
        if (window.confirm('Are you sure you want to log out?')) {
            Logout_action();
            window.location.href = '/login';
        }
    };

    const nextSlide = (): void => {
        if (featuredProducts.length > 0) {
            setCurrentSlide((prev) => (prev + 1) % featuredProducts.length);
        }
    };

    const prevSlide = (): void => {
        if (featuredProducts.length > 0) {
            setCurrentSlide((prev) => (prev - 1 + featuredProducts.length) % featuredProducts.length);
        }
    };

    useEffect(() => {
        if (featuredProducts.length > 0) {
            const timer = setInterval(nextSlide, 5000);
            return () => clearInterval(timer);
        }
    }, [featuredProducts]);

    const currentProduct: Product | undefined = featuredProducts[currentSlide];

    const formatPrice = (price: string | number | undefined): string => {
        if (!price) return 'RWF 0';
        const priceNumber = typeof price === 'string' ? parseFloat(price) : price;
        return `RWF ${priceNumber.toLocaleString()}`;
    };

    const getProductImage = (product: Product | undefined): string => {
        if (!product) return 'https://via.placeholder.com/400x300?text=No+Image';

        if (product?.images && product.images.length > 0) {
            const primaryImage = product.images.find(img => img.is_primary);
            return primaryImage ? primaryImage.image : product.images[0].image;
        }
        return 'https://via.placeholder.com/400x300?text=No+Image';
    };

    const sidebarCategories: string[] = categories.length > 0 ? categories : ['All category'];
    console.log(featuredProducts)
    return (
        <div className="bg-gray-50 font-sans">
            {/* Header */}
            <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
                <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo and Mobile Menu Button */}
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="lg:hidden p-2 text-gray-700 mr-2"
                            >
                                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                                <div className="w-6 h-6 bg-white rounded-md opacity-90"></div>
                            </div>
                            <div className="hidden sm:block">
                                <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                                    Digital Heritage
                                </h1>
                                <p className="text-xs text-gray-500">Preservationists Platform</p>
                            </div>
                        </div>

                        {/* Search Bar - Hidden on mobile */}
                        <div className="hidden md:flex flex-1 max-w-2xl mx-4 lg:mx-8">
                            <div className="flex w-full bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden">
                                <input
                                    type="text"
                                    placeholder="Search for heritage products..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="flex-1 px-4 lg:px-6 py-2 lg:py-3 bg-transparent focus:outline-none text-gray-700 placeholder-gray-400 text-sm lg:text-base"
                                />
                                <div className="relative border-l border-gray-200">
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        disabled={isLoadingCategories}
                                        className="appearance-none bg-transparent px-3 lg:px-4 py-2 lg:py-3 pr-8 focus:outline-none text-gray-700 cursor-pointer disabled:opacity-50 text-sm lg:text-base"
                                    >
                                        {isLoadingCategories ? (
                                            <option>Loading...</option>
                                        ) : (
                                            categories.map((category) => (
                                                <option key={category} value={category}>
                                                    {category}
                                                </option>
                                            ))
                                        )}
                                    </select>
                                    <ChevronDown className="absolute right-2 lg:right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                                </div>
                                <button
                                    onClick={handleSearch}
                                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 lg:px-6 py-2 lg:py-3 transition-colors duration-200"
                                >
                                    <Search className="w-4 h-4 lg:w-5 lg:h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Right Icons */}
                        <div className="flex items-center space-x-4 lg:space-x-6">
                            {isLoggedIn ? (
                                <>
                                    <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
                                        <div className="relative">
                                            <button
                                                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                                                className="flex items-center space-x-2 text-gray-700 hover:text-emerald-600 transition-colors duration-200"
                                            >
                                                <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center">
                                                    <User className="w-4 h-4 text-white" />
                                                </div>
                                                <span className="font-medium hidden lg:inline">{user?.username || 'Account'}</span>
                                                <ChevronDown className="w-4 h-4 hidden lg:inline" />
                                            </button>
                                            {isUserDropdownOpen && (
                                                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-lg z-50">
                                                    <button className="block w-full text-left px-6 py-3 text-gray-700 hover:bg-gray-50 transition-colors">
                                                        Profile
                                                    </button>
                                                    <button className="block w-full text-left px-6 py-3 text-gray-700 hover:bg-gray-50 transition-colors">
                                                        Orders
                                                    </button>
                                                    <button
                                                        onClick={handleLogout}
                                                        className="block w-full text-left px-6 py-3 text-red-600 hover:bg-red-50 transition-colors"
                                                    >
                                                        Logout
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        <button className="relative p-2 text-gray-700 hover:text-emerald-600 transition-colors">
                                            <ShoppingCart className="w-5 h-5 lg:w-6 lg:h-6" />
                                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 text-white text-xs rounded-full flex items-center justify-center">
                                                2
                                            </span>
                                        </button>
                                    </div>

                                    {/* Mobile search button */}
                                    <button
                                        onClick={handleSearch}
                                        className="md:hidden p-2 text-gray-700"
                                    >
                                        <Search className="w-5 h-5" />
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => window.location.href = '/login'}
                                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl transition-colors duration-200 font-medium text-sm lg:text-base"
                                >
                                    Login
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="lg:hidden bg-white border-t border-gray-100">
                        <div className="px-4 py-4 space-y-4">
                            {/* Mobile Search */}
                            <div className="flex bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="flex-1 px-4 py-3 bg-transparent focus:outline-none text-gray-700"
                                />
                                <button
                                    onClick={handleSearch}
                                    className="bg-emerald-500 text-white px-4 py-3"
                                >
                                    <Search className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Mobile Navigation */}
                            {isLoggedIn && (
                                <div className="flex flex-col space-y-3 pt-4 border-t border-gray-100">
                                    <button className="flex items-center space-x-3 text-gray-700 hover:text-emerald-600 py-2">
                                        <User className="w-5 h-5" />
                                        <span>Profile</span>
                                    </button>
                                    <button className="flex items-center space-x-3 text-gray-700 hover:text-emerald-600 py-2">
                                        <ShoppingCart className="w-5 h-5" />
                                        <span>Cart</span>
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center space-x-3 text-red-600 hover:text-red-700 py-2"
                                    >
                                        <LogOut className="w-5 h-5" />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </header>

            {/* Secondary Navigation */}
            <nav className="bg-white border-b border-gray-100 sticky top-16 z-40">
                <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-12 overflow-x-auto">
                        <div className="flex items-center space-x-4 lg:space-x-8 min-w-max">
                            <button className="flex items-center space-x-2 text-gray-600 hover:text-emerald-600 transition-colors whitespace-nowrap">
                                <Home className="w-4 h-4" />
                                <span className="font-medium text-sm lg:text-base">Home</span>
                            </button>
                            <button className="flex items-center space-x-2 text-gray-600 hover:text-emerald-600 transition-colors whitespace-nowrap">
                                <Settings2 className="w-4 h-4" />
                                <span className="font-medium text-sm lg:text-base">Help</span>
                            </button>
                        </div>

                        <div className="flex items-center space-x-4 lg:space-x-6 min-w-max">
                            <div className="relative">
                                <button
                                    onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                                    className="flex items-center space-x-2 text-gray-600 hover:text-emerald-600 transition-colors whitespace-nowrap"
                                >
                                    <span className="font-medium text-sm lg:text-base">{selectedCountry}</span>
                                    <ChevronDown className="w-4 h-4" />
                                </button>
                                {isCountryDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-100 rounded-xl overflow-hidden shadow-lg z-50">
                                        {['Rwanda, RWF', 'Kenya, KES', 'Uganda, UGX', 'Tanzania, TZS'].map((country) => (
                                            <button
                                                key={country}
                                                onClick={() => {
                                                    setSelectedCountry(country);
                                                    setIsCountryDropdownOpen(false);
                                                }}
                                                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors text-sm"
                                            >
                                                {country}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center space-x-2">
                                <span className="text-gray-600 font-medium text-sm lg:text-base whitespace-nowrap">Ship to</span>
                                <div className="w-6 h-4 rounded overflow-hidden">
                                    <img
                                        src="https://flagdom.com/flag-resources/flag-images/international/rwanda/rwanda-flag_3000x2000.png"
                                        alt="Rwanda flag"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8">
                <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
                    {/* Sidebar - Hidden on mobile unless menu is open */}
                    <aside className={`${isMobileMenuOpen ? 'block' : 'hidden'} lg:block lg:w-80 w-full`}>
                        <div className="bg-white rounded-2xl lg:rounded-3xl p-4 lg:p-6 border border-gray-100">
                            <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-4 lg:mb-6">Browse Gallery</h3>
                            <ul className="space-y-2 lg:space-y-4">
                                {sidebarCategories.map((category, index) => (
                                    <li key={index}>
                                        <button className="w-full text-left text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 px-3 lg:px-4 py-2 lg:py-3 rounded-lg lg:rounded-xl transition-all duration-200 font-medium text-sm lg:text-base">
                                            {category}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                            <button className="text-emerald-600 hover:text-emerald-700 mt-4 lg:mt-6 font-semibold flex items-center space-x-2 px-3 lg:px-4 text-sm lg:text-base">
                                <span>See all categories</span>
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </aside>

                    {/* Main Content Area */}
                    <main className="flex-1">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
                            {/* Hero Section with Product Slider */}
                            <div className="lg:col-span-2">
                                {isLoadingProducts ? (
                                    <div className="bg-white rounded-2xl lg:rounded-3xl p-6 lg:p-8 h-64 lg:h-96 flex items-center justify-center border border-gray-100">
                                        <div className="flex items-center space-x-3 text-gray-500">
                                            <Loader2 className="w-5 h-5 lg:w-6 lg:h-6 animate-spin" />
                                            <span className="font-medium text-sm lg:text-base">Loading featured products...</span>
                                        </div>
                                    </div>
                                ) : featuredProducts.length > 0 && currentProduct ? (
                                    <div className="bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50 rounded-2xl lg:rounded-3xl p-4 lg:p-8 min-h-64 lg:min-h-96 flex flex-col lg:flex-row items-center relative overflow-hidden border border-gray-100">
                                        {/* Navigation Arrows */}
                                        {featuredProducts.length > 1 && (
                                            <>
                                                <button
                                                    onClick={prevSlide}
                                                    className="absolute left-2 lg:left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/90 hover:bg-white p-2 lg:p-3 rounded-full border border-gray-200 transition-all duration-200"
                                                >
                                                    <ChevronLeft className="w-4 h-4 lg:w-5 lg:h-5 text-gray-700" />
                                                </button>
                                                <button
                                                    onClick={nextSlide}
                                                    className="absolute right-2 lg:right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/90 hover:bg-white p-2 lg:p-3 rounded-full border border-gray-200 transition-all duration-200"
                                                >
                                                    <ChevronRight className="w-4 h-4 lg:w-5 lg:h-5 text-gray-700" />
                                                </button>
                                            </>
                                        )}

                                        {/* Product Content */}
                                        <div className="flex-1 z-10 lg:pr-8 order-2 lg:order-1 mt-4 lg:mt-0">
                                            <div className="flex items-center space-x-2 mb-2 lg:mb-3">
                                                <div className="w-5 h-5 lg:w-6 lg:h-6 bg-emerald-500 rounded-md lg:rounded-lg flex items-center justify-center">
                                                    <Star className="w-3 h-3 lg:w-4 lg:h-4 text-white" />
                                                </div>
                                                <span className="text-emerald-700 font-semibold bg-emerald-100 px-2 lg:px-3 py-0.5 lg:py-1 rounded-full text-xs lg:text-sm">
                                                    Featured Product
                                                </span>
                                            </div>

                                            <div className="mb-2 lg:mb-3">
                                                <span className="text-xs lg:text-sm text-gray-500 font-medium">
                                                    {currentProduct.condition === 'new' ? 'Brand New' : 'Pre-owned'}
                                                </span>
                                            </div>

                                            <h1 className="text-xl lg:text-3xl xl:text-4xl font-bold text-gray-900 mb-2 lg:mb-3">
                                                {currentProduct.name}
                                            </h1>
                                            <p className="text-gray-600 mb-4 lg:mb-6 text-sm lg:text-lg leading-relaxed line-clamp-2 lg:line-clamp-3">
                                                {currentProduct.description}
                                            </p>

                                            {/* Price Display */}
                                            <div className="flex items-center space-x-2 lg:space-x-4 mb-4 lg:mb-8">
                                                <span className="text-lg lg:text-2xl font-bold text-gray-900">
                                                    {formatPrice(currentProduct.price)}
                                                </span>
                                                {currentProduct.original_price && currentProduct.original_price !== currentProduct.price && (
                                                    <>
                                                        <span className="text-sm lg:text-lg text-gray-400 line-through">
                                                            {formatPrice(currentProduct.original_price)}
                                                        </span>
                                                        <span className="bg-red-100 text-red-700 px-2 lg:px-3 py-0.5 lg:py-1 rounded-full text-xs lg:text-sm font-semibold">
                                                            Save {Math.round((1 - Number(currentProduct.price) / Number(currentProduct.original_price) * 100))}%
                                                        </span>
                                                    </>
                                                )}
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex flex-wrap gap-2 lg:gap-4">
                                                <button className="bg-white text-gray-700 px-4 lg:px-6 py-2 lg:py-3 rounded-lg lg:rounded-xl border border-gray-200 hover:bg-gray-50 transition-all duration-200 font-semibold flex items-center space-x-2 text-sm lg:text-base">
                                                    <Eye className="w-3 h-3 lg:w-4 lg:h-4" />
                                                    <span>View Details</span>
                                                </button>
                                                <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-lg lg:rounded-xl transition-all duration-200 font-semibold flex items-center space-x-2 text-sm lg:text-base">
                                                    <ShoppingCart className="w-3 h-3 lg:w-4 lg:h-4" />
                                                    <span>Add to Cart</span>
                                                </button>
                                                <button className="p-2 lg:p-3 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg lg:rounded-xl transition-all duration-200">
                                                    <Heart className="w-4 h-4 lg:w-5 lg:h-5" />
                                                </button>
                                            </div>

                                            {/* Product Info */}
                                            <div className="flex items-center space-x-4 lg:space-x-6 mt-4 lg:mt-6 text-xs lg:text-sm text-gray-500">
                                                <div className="flex items-center space-x-1">
                                                    <Star className="w-3 h-3 lg:w-4 lg:h-4 fill-current text-yellow-400" />
                                                    <span className="font-medium text-gray-700">
                                                        {currentProduct.rating} ({currentProduct.review_count} reviews)
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="font-medium">Stock: </span>
                                                    <span className={currentProduct.stock > 0 ? 'text-emerald-600' : 'text-red-500'}>
                                                        {currentProduct.stock > 0 ? `${currentProduct.stock} available` : 'Out of stock'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Product Image */}
                                        <div className="flex-1 flex items-center justify-center relative order-1 lg:order-2">
                                            <div className="w-40 h-40 lg:w-64 lg:h-64 rounded-xl lg:rounded-2xl overflow-hidden border border-gray-200 bg-white">
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
                                            <div className="absolute bottom-2 lg:bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-1 lg:space-x-2 z-10 order-3">
                                                {featuredProducts.map((_, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => setCurrentSlide(index)}
                                                        className={`h-1.5 lg:h-2 rounded-full transition-all duration-200 ${index === currentSlide
                                                            ? 'bg-emerald-500 w-6 lg:w-8'
                                                            : 'bg-gray-300 w-1.5 lg:w-2 hover:bg-gray-400'
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="bg-white rounded-2xl lg:rounded-3xl p-6 lg:p-8 h-64 lg:h-96 flex items-center justify-center border border-gray-100">
                                        <div className="text-center">
                                            <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gray-100 rounded-xl lg:rounded-2xl flex items-center justify-center mx-auto mb-3 lg:mb-4">
                                                <ShoppingCart className="w-6 h-6 lg:w-8 lg:h-8 text-gray-400" />
                                            </div>
                                            <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-1 lg:mb-2">No Featured Products</h3>
                                            <p className="text-gray-500 text-sm lg:text-base">Check back later for featured items</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Action Cards */}
                            <div className="space-y-3 lg:space-y-6">
                                <div className="bg-gradient-to-br from-orange-400 to-orange-500 text-white p-4 lg:p-6 rounded-2xl lg:rounded-3xl hover:from-orange-500 hover:to-orange-600 transition-all duration-200 cursor-pointer">
                                    <div className="flex items-center justify-between mb-2 lg:mb-3">
                                        <h3 className="text-base lg:text-lg font-bold">Get 10% Off</h3>
                                        <Percent className="w-5 h-5 lg:w-6 lg:h-6" />
                                    </div>
                                    <p className="text-orange-100 text-sm lg:text-base">on your first purchase</p>
                                </div>

                                <div className="bg-gradient-to-br from-teal-400 to-teal-500 text-white p-4 lg:p-6 rounded-2xl lg:rounded-3xl hover:from-teal-500 hover:to-teal-600 transition-all duration-200 cursor-pointer">
                                    <div className="flex items-center justify-between mb-2 lg:mb-3">
                                        <h3 className="text-base lg:text-lg font-bold">Free Consultation</h3>
                                        <Settings className="w-5 h-5 lg:w-6 lg:h-6" />
                                    </div>
                                    <p className="text-teal-100 text-sm lg:text-base">Heritage preservation advice</p>
                                </div>

                                <div className="bg-gradient-to-br from-purple-400 to-purple-500 text-white p-4 lg:p-6 rounded-2xl lg:rounded-3xl hover:from-purple-500 hover:to-purple-600 transition-all duration-200 cursor-pointer">
                                    <div className="flex items-center justify-between mb-2 lg:mb-3">
                                        <h3 className="text-base lg:text-lg font-bold">Limited Collection</h3>
                                        <Clock className="w-5 h-5 lg:w-6 lg:h-6" />
                                    </div>
                                    <p className="text-purple-100 text-sm lg:text-base">Exclusive heritage pieces</p>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default ModernEcommerceLayout;