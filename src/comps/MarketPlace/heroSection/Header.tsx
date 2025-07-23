import { useState } from 'react';
import { Search, ShoppingCart, User, ChevronDown, Menu, X, LogOut } from 'lucide-react';
import { isLoggedIn } from '../../../app/Localstorage';
import { Logout_action } from '../../../app/SharedUtilities';

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
        <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
            <div className="max-w-full md:max-w-11/12 mx-auto px-4 sm:px-6 lg:px-8">
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
                <div className="lg:hidden bg-white border-t border-gray-100 fixed top-16 left-0 right-0 z-50">
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
    );
};

export default Header;