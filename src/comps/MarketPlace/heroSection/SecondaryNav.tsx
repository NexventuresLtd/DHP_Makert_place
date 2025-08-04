import { useState } from 'react';
import { Home, ShoppingCart } from 'lucide-react';

interface SecondaryNavProps {
    selectedCountry: string;
    setSelectedCountry: (country: string) => void;
}

const SecondaryNav = ({ selectedCountry, setSelectedCountry }: SecondaryNavProps) => {
    const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);

    return (
        <nav className="bg-white border-b border-gray-100 sticky top-16 z-40">
            <div className="max-w-full md:max-w-11/12 mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-12 overflow-x-auto">
                    <div className="flex items-center space-x-4 lg:space-x-8 min-w-max">
                        <button onClick={() => {window.location.href = '/'}} className="flex items-center space-x-2 text-gray-600 hover:text-emerald-600 transition-colors whitespace-nowrap">
                            <Home className="w-4 h-4" />
                            <span className="font-medium text-sm lg:text-base">Home</span>
                        </button>
                        <button className="flex items-center space-x-2 text-gray-600 hover:text-emerald-600 transition-colors whitespace-nowrap">
                            <ShoppingCart className="w-4 h-4" />
                            <span className="font-medium text-sm lg:text-base">Cart</span>
                        </button>
                    </div>

                    <div className="flex items-center space-x-4 lg:space-x-6 min-w-max">
                        <div className="relative">
                            <button
                                onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                                className="flex items-center space-x-2 text-gray-600 hover:text-emerald-600 transition-colors whitespace-nowrap"
                            >
                                <span className="font-medium text-sm lg:text-base">{selectedCountry}</span>
                                {/* <ChevronDown className="w-4 h-4" /> */}
                            </button>
                            {isCountryDropdownOpen && (
                                <div className="fixed top-26 right-50 z-50 mt-2 w-40 bg-white border border-gray-100 rounded-xl overflow-hidden shadow-lg">
                                    {['Rwanda, RWF'].map((country) => (
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
    );
};

export default SecondaryNav;