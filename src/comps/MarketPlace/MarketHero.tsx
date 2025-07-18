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
    Gift,
    Zap,
    Percent,
    Clock,
    LogOutIcon,
    UserCog2Icon
} from 'lucide-react';
import { isLoggedIn, getUserInfo } from '../../app/Localstorage';
import { Logout_action } from '../../app/SharedUtilities';
import type { UserInfo } from '../../types/sharedtypes';

const RwandanEcommerceLayout = () => {
    const [selectedCategory, setSelectedCategory] = useState('All category');
    const [searchQuery, setSearchQuery] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState('Rwanda, RWF');
    const [currentSlide, setCurrentSlide] = useState(0);

    const [user, setUser] = useState<UserInfo | null>(null);

    const categories = [
        'All category',
        'Traditional Paintings',
        'Wood Sculptures',
        'Imigongo Art',
        'Cultural Instruments',
        'Musical Instruments',
        'Traditional Utensils',
        'Handcrafted Tools'
    ];

    const sidebarCategories = [
        'Paintings',
        'Sculptures',
        'Drawings',
        'Cultural tools, equipments',
        'Music tools',
        'Utensils',
        'Traditional tools'
    ];

    const countries = [
        'Rwanda, RWF',
        'Kenya, KES',
        'Uganda, UGX',
        'Tanzania, TZS'
    ];

    const deals = [
        {
            id: 1,
            title: "Traditional Imigongo Art",
            subtitle: "Handcrafted Heritage",
            price: "RWF 25,000",
            originalPrice: "RWF 35,000",
            discount: "30% OFF",
            icon: <Star className="w-6 h-6" />,
            bgColor: "from-purple-200 via-blue-200 to-purple-300",
            buttonColor: "bg-purple-600 hover:bg-purple-700",
            decorativeElements: (
                <>
                    <div className="absolute top-4 right-4 w-16 h-12">
                        <div className="w-4 h-4 bg-red-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-white rounded-full mt-1 ml-2"></div>
                        <div className="w-2 h-2 bg-yellow-300 rounded-full mt-1 ml-4"></div>
                    </div>
                    <div className="absolute bottom-8 right-8 w-8 h-8 bg-purple-400 rounded-full opacity-60"></div>
                </>
            )
        },
        {
            id: 2,
            title: "Wood Sculpture Collection",
            subtitle: "Master Craftsman Series",
            price: "RWF 45,000",
            originalPrice: "RWF 60,000",
            discount: "25% OFF",
            icon: <Gift className="w-6 h-6" />,
            bgColor: "from-green-200 via-teal-200 to-green-300",
            buttonColor: "bg-green-600 hover:bg-green-700",
            decorativeElements: (
                <>
                    <div className="absolute top-6 right-6 w-12 h-12">
                        <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                        <div className="w-4 h-4 bg-green-500 rounded-full mt-2 ml-1"></div>
                        <div className="w-2 h-2 bg-white rounded-full mt-1 ml-3"></div>
                    </div>
                    <div className="absolute bottom-6 right-10 w-6 h-6 bg-green-500 rounded-full opacity-70"></div>
                </>
            )
        },
        {
            id: 3,
            title: "Cultural Instruments",
            subtitle: "Traditional Music Heritage",
            price: "RWF 18,000",
            originalPrice: "RWF 24,000",
            discount: "Flash Sale",
            icon: <Zap className="w-6 h-6" />,
            bgColor: "from-orange-200 via-yellow-200 to-orange-300",
            buttonColor: "bg-orange-600 hover:bg-orange-700",
            decorativeElements: (
                <>
                    <div className="absolute top-5 right-5 w-14 h-10">
                        <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                        <div className="w-4 h-4 bg-yellow-400 rounded-full mt-1 ml-2"></div>
                        <div className="w-2 h-2 bg-red-400 rounded-full mt-1 ml-4"></div>
                    </div>
                    <div className="absolute bottom-7 right-7 w-7 h-7 bg-yellow-400 rounded-full opacity-75"></div>
                </>
            )
        },
        {
            id: 4,
            title: "Handwoven Baskets",
            subtitle: "Authentic Rwandan Craft",
            price: "RWF 12,000",
            originalPrice: "RWF 16,000",
            discount: "Limited Time",
            icon: <Heart className="w-6 h-6" />,
            bgColor: "from-pink-200 via-rose-200 to-pink-300",
            buttonColor: "bg-pink-600 hover:bg-pink-700",
            decorativeElements: (
                <>
                    <div className="absolute top-4 right-4 w-15 h-11">
                        <div className="w-4 h-4 bg-pink-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-rose-300 rounded-full mt-1 ml-1"></div>
                        <div className="w-2 h-2 bg-white rounded-full mt-1 ml-3"></div>
                    </div>
                    <div className="absolute bottom-6 right-9 w-8 h-8 bg-rose-400 rounded-full opacity-65"></div>
                </>
            )
        }
    ];

    useEffect(() => {
        if (isLoggedIn) {
            setUser(getUserInfo);
        }
    }, []);

    const handleSearch = () => {
        console.log('Searching for:', searchQuery, 'in category:', selectedCategory);
    };

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to log out?')) {
            Logout_action();
            window.location.href = '/login';
        }
    };

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % deals.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + deals.length) % deals.length);
    };

    useEffect(() => {
        const timer = setInterval(nextSlide, 5000);
        return () => clearInterval(timer);
    }, []);

    const currentDeal = deals[currentSlide];

    return (
        <div className="bg-gray-50 font-sans">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="w-full md:max-w-11/12 mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                                <img src="logos/logo-circle.png" alt="Digital Heritage" className="w-8 h-8 rounded-full" />
                            </div>
                            <div className="hidden lg:block">
                                <h1 className="text-lg font-semibold text-gray-900">Digital Heritage</h1>
                                <p className="text-xs text-gray-500">Preservationists Platform</p>
                            </div>
                        </div>

                        {/* Search Bar */}
                        <div className="hidden lg:flex flex-1 max-w-xl mx-4">
                            <div className="flex w-full">
                                <input
                                    type="text"
                                    placeholder="Search for products..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                                    aria-label="Search products"
                                />
                                <div className="relative">
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        className="appearance-none bg-white border-t border-b border-gray-300 px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm text-gray-700"
                                        aria-label="Select category"
                                    >
                                        {categories.map((category) => (
                                            <option key={category} value={category}>{category}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                                </div>
                                <button
                                    onClick={handleSearch}
                                    className="bg-primary text-white px-6 py-2 rounded-r-md transition-colors duration-200"
                                    aria-label="Search"
                                >
                                    <Search className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Right Icons */}
                        <div className="flex items-center space-x-4">
                            {isLoggedIn ? (
                                <div className="flex items-center space-x-4">
                                    <div className="hidden lg:flex items-center space-x-4">
                                        <div className="relative">
                                            <button
                                                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                                                className="flex items-center space-x-2 text-gray-700 hover:text-green-600 transition-colors duration-200"
                                                aria-label="User menu"
                                            >
                                                <UserCog2Icon className="w-5 h-5" />
                                                <span className="text-sm">{user?.username || 'Account'}</span>
                                            </button>
                                            {isUserDropdownOpen && (
                                                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md z-10">
                                                    <button
                                                        onClick={() => window.location.href = '/profile'}
                                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                    >
                                                        Profile
                                                    </button>
                                                    <button
                                                        onClick={() => window.location.href = '/orders'}
                                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                    >
                                                        Orders
                                                    </button>
                                                    <button
                                                        onClick={handleLogout}
                                                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                                    >
                                                        Logout
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => window.location.href = '/cart'}
                                            className="text-center cursor-pointer hover:text-green-600 transition-colors duration-200"
                                            aria-label="Cart"
                                        >
                                            <ShoppingCart className="w-5 h-5 mx-auto text-gray-500" />
                                            <span className="text-xs text-gray-500">My cart</span>
                                        </button>
                                    </div>

                                    {/* Mobile menu button */}
                                    <button
                                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                        className="lg:hidden p-2"
                                        aria-label="Toggle mobile menu"
                                    >
                                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => window.location.href = '/login'}
                                    className="flex items-center space-x-2 text-gray-700 hover:text-green-600 transition-colors duration-200"
                                    aria-label="Login"
                                >
                                    <User className="w-5 h-5" />
                                    <span className="text-sm">Login</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg z-50">
                        <div className="px-4 py-4 space-y-4">
                            {/* Mobile Search */}
                            <div className="flex">
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="appearance-none bg-gray-100 border border-r-0 border-gray-300 rounded-l-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                    aria-label="Select category"
                                >
                                    {categories.map((category) => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>
                                <input
                                    type="text"
                                    placeholder="Search for products..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="flex-1 px-3 py-2 border border-l-0 border-r-0 border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                    aria-label="Search products"
                                />
                                <button
                                    onClick={handleSearch}
                                    className="bg-green-600 text-white px-4 py-2 rounded-r-md"
                                    aria-label="Search"
                                >
                                    <Search className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Mobile Navigation */}
                            {isLoggedIn ? (
                                <div className="flex flex-col space-y-4 pt-4 border-t">
                                    <button
                                        onClick={() => window.location.href = '/profile'}
                                        className="flex items-center space-x-2 text-gray-700 hover:text-green-600"
                                    >
                                        <UserCog2Icon className="w-5 h-5" />
                                        <span className="text-sm">Profile</span>
                                    </button>
                                    <button
                                        onClick={() => window.location.href = '/orders'}
                                        className="flex items-center space-x-2 text-gray-700 hover:text-green-600"
                                    >
                                        <ShoppingCart className="w-5 h-5" />
                                        <span className="text-sm">Orders</span>
                                    </button>
                                    <button
                                        onClick={() => window.location.href = '/cart'}
                                        className="flex items-center space-x-2 text-gray-700 hover:text-green-600"
                                    >
                                        <ShoppingCart className="w-5 h-5" />
                                        <span className="text-sm">My cart</span>
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center space-x-2 text-red-600 hover:text-red-700"
                                    >
                                        <LogOutIcon className="w-5 h-5" />
                                        <span className="text-sm">Logout</span>
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => window.location.href = '/login'}
                                    className="flex items-center space-x-2 text-gray-700 hover:text-green-600"
                                >
                                    <User className="w-5 h-5" />
                                    <span className="text-sm">Login</span>
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </header>

            {/* Secondary Navigation */}
            <nav className="bg-white border-b border-gray-200">
                <div className="w-full md:max-w-11/12 mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-12">
                        <div className="flex items-center space-x-6">
                            <button
                                onClick={() => window.location.href = '/'}
                                className="flex items-center space-x-2 text-gray-800 hover:text-green-600 transition-colors duration-200"
                                aria-label="Home"
                            >
                                <Home className="w-4 h-4" />
                                <span>Home</span>
                            </button>
                            <button
                                onClick={() => window.location.href = '/help'}
                                className="flex items-center space-x-2 text-gray-800 hover:text-green-600 transition-colors duration-200"
                                aria-label="Help"
                            >
                                <Settings2 className="w-4 h-4" />
                                <span>Help</span>
                            </button>
                        </div>

                        <div className="flex items-center space-x-6">
                            <div className="relative">
                                <button
                                    onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                                    className="flex items-center space-x-2 text-gray-800 hover:text-green-600 transition-colors duration-200"
                                    aria-label="Select country"
                                >
                                    <span>{selectedCountry}</span>
                                    <ChevronDown className="w-4 h-4" />
                                </button>
                                {isCountryDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                                        {countries.map((country) => (
                                            <button
                                                key={country}
                                                onClick={() => {
                                                    setSelectedCountry(country);
                                                    setIsCountryDropdownOpen(false);
                                                }}
                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                {country}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center space-x-2">
                                <span className="text-gray-800">Ship to</span>
                                <div className="w-6 h-4 bg-blue-500 rounded-sm flex items-center justify-center overflow-hidden">
                                    <img src="https://flagdom.com/flag-resources/flag-images/international/rwanda/rwanda-flag_3000x2000.png" alt="Rwanda flag" className="w-full h-full" />
                                </div>
                                <ChevronDown className="w-4 h-4 text-gray-600" />
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="w-full md:max-w-11/12 mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Sidebar */}
                    <aside className="lg:w-80 w-full">
                        <div className="bg-white rounded-lg p-6 ">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Gallery</h3>
                            <ul className="space-y-3">
                                {sidebarCategories.map((category, index) => (
                                    <li key={index}>
                                        <button
                                            className="text-gray-700 hover:text-green-600 transition-colors duration-200 text-left text-sm"
                                            aria-label={`Filter by ${category}`}
                                        >
                                            {category}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                            <button
                                className="text-blue-600 hover:text-blue-800 mt-4 font-medium text-sm"
                                aria-label="See all categories"
                            >
                                See all
                            </button>
                        </div>
                    </aside>

                    {/* Main Content Area - Deal Slider */}
                    <main className="flex-1">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Hero Section with Deal Slider */}
                            <div className="lg:col-span-2">
                                <div
                                    className={`bg-gradient-to-r ${currentDeal.bgColor} rounded-lg p-6 sm:p-8 h-80 sm:h-96 flex items-center relative overflow-hidden transition-all duration-500 touch-pan-x`}
                                    role="region"
                                    aria-label="Deal slider"
                                >
                                    {/* Navigation Arrows */}
                                    <button
                                        onClick={prevSlide}
                                        className="absolute left-2 top-1/2 transform -translate-y-1/2 z-20 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all duration-200"
                                        aria-label="Previous deal"
                                    >
                                        <ChevronLeft className="w-5 h-5 text-gray-700" />
                                    </button>
                                    <button
                                        onClick={nextSlide}
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 z-20 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all duration-200"
                                        aria-label="Next deal"
                                    >
                                        <ChevronRight className="w-5 h-5 text-gray-700" />
                                    </button>

                                    {/* Deal Content */}
                                    <div className="flex-1 z-10 pr-4">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <div className="text-gray-700">
                                                {currentDeal.icon}
                                            </div>
                                            <span className="text-sm text-gray-700 font-medium">{currentDeal.discount}</span>
                                        </div>
                                        <h2 className="text-sm text-gray-700 mb-2">Latest trending</h2>
                                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
                                            {currentDeal.title}
                                        </h1>
                                        <p className="text-base text-gray-700 mb-4">{currentDeal.subtitle}</p>

                                        {/* Price Display */}
                                        <div className="flex items-center space-x-3 mb-6">
                                            <span className="text-xl font-bold text-gray-800">{currentDeal.price}</span>
                                            <span className="text-base text-gray-500 line-through">{currentDeal.originalPrice}</span>
                                        </div>

                                        <div className="flex flex-wrap gap-4">
                                            <button
                                                className="bg-white text-gray-800 px-6 py-2 rounded-md hover:bg-gray-100 transition-colors duration-200 shadow-sm flex items-center space-x-2"
                                                aria-label="View details"
                                            >
                                                <Eye className="w-4 h-4" />
                                                <span>View Details</span>
                                            </button>
                                            <button
                                                className={`${currentDeal.buttonColor} text-white px-6 py-2 rounded-md transition-colors duration-200 shadow-sm flex items-center space-x-2`}
                                                aria-label="Add to cart"
                                            >
                                                <ShoppingCart className="w-4 h-4" />
                                                <span>Add to Cart</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Traditional Rwandan Item Illustration */}
                                    <div className="flex-1 flex items-center justify-center relative">
                                        {currentDeal.decorativeElements}

                                        {/* Main Item Display */}
                                        <div className="relative">
                                            <div className="w-36 sm:w-48 h-20 sm:h-24 bg-white rounded-full border-4 border-gray-200 shadow-lg relative">
                                                <div className="absolute top-0 right-6 sm:right-8 w-12 sm:w-16 h-3 sm:h-4 bg-gray-800 rounded-full opacity-20"></div>
                                                <div className="absolute top-1 right-7 sm:right-9 w-10 sm:w-14 h-1 sm:h-2 bg-gray-600 rounded-full opacity-30"></div>
                                                <div className="absolute inset-2 bg-gray-100 rounded-full"></div>
                                            </div>

                                            <div className="absolute -bottom-2 left-8 sm:left-12 transform rotate-12">
                                                <div className="w-16 sm:w-20 h-2 sm:h-3 bg-green-600 rounded-full"></div>
                                                <div className="w-6 sm:w-8 h-4 sm:h-6 bg-green-700 rounded-full -mt-1 ml-12 sm:ml-16 transform -rotate-12"></div>
                                                <div className="w-1 h-1 bg-red-500 rounded-full absolute top-1 right-3 sm:right-4"></div>
                                            </div>
                                        </div>

                                        <div className="absolute top-8 sm:top-12 left-3 sm:left-4 w-4 sm:w-6 h-4 sm:h-6 bg-white rounded-full opacity-80"></div>
                                    </div>

                                    {/* Slide Indicators */}
                                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                                        {deals.map((_, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setCurrentSlide(index)}
                                                className={`w-2 h-2 rounded-full transition-all duration-200 ${index === currentSlide ? 'bg-white w-6' : 'bg-white/50'}`}
                                                aria-label={`Go to slide ${index + 1}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Action Cards */}
                            <div className="space-y-4">
                                <button
                                    className="bg-orange-400 text-white p-6 rounded-lg hover:bg-orange-500 transition-colors duration-200 w-full text-left"
                                    aria-label="Get US $10 off"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="font-semibold">Get US $10 off</h3>
                                        <Percent className="w-5 h-5" />
                                    </div>
                                    <p className="text-sm opacity-90">with a new supplier</p>
                                </button>

                                <button
                                    className="bg-teal-400 text-white p-6 rounded-lg hover:bg-teal-500 transition-colors duration-200 w-full text-left"
                                    aria-label="Send quotes"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="font-semibold">Send quotes with</h3>
                                        <Settings className="w-5 h-5" />
                                    </div>
                                    <p className="text-sm opacity-90">supplier preferences</p>
                                </button>

                                <button
                                    className="bg-red-400 text-white p-6 rounded-lg hover:bg-red-500 transition-colors duration-200 w-full text-left"
                                    aria-label="Limited time offer"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="font-semibold">Limited Time Offer</h3>
                                        <Clock className="w-5 h-5" />
                                    </div>
                                    <p className="text-sm opacity-90">Free shipping available</p>
                                </button>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default RwandanEcommerceLayout;