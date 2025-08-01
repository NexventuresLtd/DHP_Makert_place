import { useState } from 'react';
import { Search, ShoppingCart, User, ChevronDown, Menu, X, LogOut } from 'lucide-react';
import { isLoggedIn } from '../../../app/Localstorage';
import { Logout_action } from '../../../app/utlis/SharedUtilities';

interface UserInfo {
    username: string;
    email?: string;
    first_name?: string;
    last_name?: string;
    avatar?: string;
}

interface HeaderProps {
    user: UserInfo | null;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    selectedCategory: string;
    setSelectedCategory: (category: string) => void;
    categories: string[];
    isLoadingCategories: boolean;
    handleSearch: () => void;
    isMobileMenuOpen: boolean;
    setIsMobileMenuOpen: (open: boolean) => void;
}

const Header = ({
    user,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    categories,
    isLoadingCategories,
    handleSearch,
    isMobileMenuOpen,
    setIsMobileMenuOpen
}: HeaderProps) => {
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to log out?')) {
            Logout_action();
            window.location.href = '/login';
        }
    };

    return (
        <>

            <header className="bg-gray-50 sticky top-0 z-50">
                <div className="max-w-full md:max-w-11/12 mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo and Mobile Menu Button */}
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="lg:hidden p-2 text-primary hover:text-primary transition-colors"
                                aria-label="Toggle menu"
                            >
                                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                                    <img src="logos/logo-circle.png" alt="Digital Heritage" className="w-8 h-8 rounded-full" />
                                </div>
                                <div className="hidden lg:block">
                                    <h1 className="text-lg font-semibold text-gray-900">Digital Heritage</h1>
                                    <p className="text-xs text-gray-500">Preservationists Platform</p>
                                </div>
                            </div>
                        </div>

                        {/* Search Bar - Hidden on mobile */}
                        <div className="hidden md:flex flex-1 max-w-2xl mx-4 lg:mx-8">
                            <div className="flex w-full bg-white rounded-lg overflow-hidden">
                                <input
                                    type="text"
                                    placeholder="Search for heritage products..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="flex-1 px-4 lg:px-5 py-2 bg-transparent focus:outline-none text-gray-800 placeholder-gray-500 text-sm lg:text-base"
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                />
                                <div className="relative border-l border-gray-200">
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        disabled={isLoadingCategories}
                                        className="appearance-none bg-white px-3 lg:px-4 py-2 pr-8 focus:outline-none text-gray-700 cursor-pointer disabled:opacity-50 text-sm lg:text-base"
                                    >
                                        {isLoadingCategories ? (
                                            <option>Loading...</option>
                                        ) : (
                                            <>
                                                <option value="">All Categories</option>
                                                {categories.map((category) => (
                                                    <option key={category} value={category}>
                                                        {category}
                                                    </option>
                                                ))}
                                            </>
                                        )}
                                    </select>
                                    <ChevronDown className="absolute right-2 lg:right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                                </div>
                                <button
                                    onClick={handleSearch}
                                    className="bg-primary text-white px-4 lg:px-5 py-2 transition-colors duration-200"
                                    aria-label="Search"
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
                                                className="flex items-center space-x-2 text-primary hover:text-primary transition-colors duration-200"
                                                aria-label="User menu"
                                            >
                                                {user?.avatar ? (
                                                    <img
                                                        src={user.avatar}
                                                        alt={user.username}
                                                        className="w-8 h-8 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center border border-white/20">
                                                        <User className="w-4 h-4 text-primary" />
                                                    </div>
                                                )}
                                                <span className="font-medium hidden lg:inline">{user?.username || 'Account'}</span>
                                                <ChevronDown className={`w-4 h-4 hidden lg:inline transition-transform ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
                                            </button>
                                            {isUserDropdownOpen && (
                                                <div
                                                    className="absolute right-0 mt-2 w-56 bg-white rounded-lg overflow-hidden shadow-xl z-50 border border-gray-100"
                                                    onMouseLeave={() => setIsUserDropdownOpen(false)}
                                                >
                                                    <div className="px-4 py-3 border-b border-gray-100">
                                                        <p className="text-sm font-medium text-gray-900">{user?.username}</p>
                                                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                                                    </div>
                                                    <button className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                                        My Profile
                                                    </button>
                                                    <button className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                                        My Orders
                                                    </button>
                                                    <button
                                                        onClick={handleLogout}
                                                        className="block w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100"
                                                    >
                                                        Logout
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        <button
                                            onClick={() => window.location.href = '/market/cart'}
                                            className="relative p-2 text-primary hover:text-primary transition-colors"
                                            aria-label="Shopping cart"
                                        >
                                            <ShoppingCart className="w-5 h-5 lg:w-6 lg:h-6" />
                                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center font-medium border border-emerald-100">
                                                +
                                            </span>
                                        </button>
                                    </div>

                                    {/* Mobile search button */}
                                    <button
                                        onClick={handleSearch}
                                        className="md:hidden p-2 text-white hover:text-primary"
                                        aria-label="Search"
                                    >
                                        <Search className="w-5 h-5" />
                                    </button>
                                </>
                            ) : (
                                <div className="flex space-x-3">
                                    <button
                                        onClick={() => window.location.href = '/login'}
                                        className="bg-white text-second hover:bg-gray-50 px-4 py-2 rounded-lg transition-colors duration-200 font-medium text-sm lg:text-base"
                                    >
                                        Login
                                    </button>
                                    <button
                                        onClick={() => window.location.href = '/register'}
                                        className="bg-primary text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium text-sm lg:text-base"
                                    >
                                        Register
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="lg:hidden bg-white fixed top-16 left-0 right-0 z-50 shadow-lg">
                        <div className="px-4 py-4 space-y-4">
                            {/* Mobile Search */}
                            <div className="flex bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="flex-1 px-4 py-3 bg-transparent focus:outline-none text-gray-700"
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                />
                                <button
                                    onClick={handleSearch}
                                    className="bg-emerald-600 text-white px-4 py-3"
                                >
                                    <Search className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Mobile Navigation */}
                            {isLoggedIn ? (
                                <div className="flex flex-col space-y-3 pt-4 border-t border-gray-100">
                                    <button className="flex items-center space-x-3 text-gray-700 hover:text-emerald-800 py-2 px-2 rounded-lg hover:bg-gray-50">
                                        <User className="w-5 h-5" />
                                        <span>Profile</span>
                                    </button>
                                    <button className="flex items-center space-x-3 text-gray-700 hover:text-emerald-800 py-2 px-2 rounded-lg hover:bg-gray-50">
                                        <ShoppingCart className="w-5 h-5" />
                                        <span>Cart</span>
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center space-x-3 text-red-600 hover:text-red-700 py-2 px-2 rounded-lg hover:bg-red-50"
                                    >
                                        <LogOut className="w-5 h-5" />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col space-y-3 pt-4 border-t border-gray-100">
                                    <button
                                        onClick={() => window.location.href = '/login'}
                                        className="w-full text-center bg-emerald-800 hover:bg-emerald-900 text-white px-4 py-3 rounded-lg transition-colors duration-200 font-medium"
                                    >
                                        Login
                                    </button>
                                    <button
                                        onClick={() => window.location.href = '/register'}
                                        className="w-full text-center bg-white hover:bg-gray-50 text-emerald-800 px-4 py-3 rounded-lg transition-colors duration-200 font-medium border border-gray-200"
                                    >
                                        Register
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </header>
        </>
    );
};

export default Header;