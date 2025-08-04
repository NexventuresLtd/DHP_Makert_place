import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, BookOpen, ShoppingCart, GraduationCap, LogIn, UserPlus, Menu, X, User, UserCog2, LogOut } from 'lucide-react';
import { isLoggedIn, getUserInfo } from '../../app/Localstorage';
import type { UserInfo } from '../../types/marketTypes';


interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
}

export default function DigitalHeritagePlatform() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [user, setUser] = useState<UserInfo | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      setUser(getUserInfo);
    }
  }, []);

  const handleNavigation = (path: string) => {
    localStorage.setItem("ViewPage", path);
    setIsMenuOpen(false);
    setIsUserDropdownOpen(false);
    window.location.href = `/${path}`;
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("redirectPath");
      localStorage.removeItem("userInfo");
      navigate("/login");
    }
    setIsUserDropdownOpen(false);
    setIsMenuOpen(false);
  };

  const navItems: NavItem[] = [
    { name: "Home", path: "home", icon: <Home className="h-4 w-4" /> },
    { name: "About Us", path: "about", icon: <BookOpen className="h-4 w-4" /> },
    {
      name: "Resources",
      path: "resources",
      icon: <GraduationCap className="h-4 w-4" />,
    },
    // { name: "Library", path: "library", icon: <Library className="h-4 w-4" /> },
    {
      name: "Marketplace",
      path: "market",
      icon: <ShoppingCart className="h-4 w-4" />,
    },
    {
      name: "E-Learning",
      path: "elearning",
      icon: <GraduationCap className="h-4 w-4" />,
    },
    {
      name: "Get involved",
      path: "involved",
      icon: <User className="h-4 w-4" />,
    },
  ];

  const getNavClasses = (path: string) => {
    const baseClasses =
      "flex items-center space-x-1 transition-colors duration-200";
    const activeClasses = "text-green-900 bg-green-50 px-3 py-2 rounded-lg";
    const inactiveClasses = "text-gray-700 hover:text-green-900";

    return window.location.pathname === `/${path}`
      ? `${baseClasses} ${activeClasses}`
      : `${baseClasses} ${inactiveClasses}`;
  };

  const getMobileNavClasses = (path: string) => {
    const baseClasses =
      "flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-200";
    const activeClasses = "text-green-900 bg-green-50";
    const inactiveClasses =
      "text-gray-700 hover:text-green-900 hover:bg-gray-50";

    return window.location.pathname === `/${path}`
      ? `${baseClasses} ${activeClasses}`
      : `${baseClasses} ${inactiveClasses}`;
  };

  return (
    <nav className="bg-white/70 backdrop-blur-md sticky top-0 z-50">
      <div className="w-full md:max-w-11/12 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section - Left */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <img
                src="logos/logo-circle.png"
                alt="Digital Heritage"
                className="w-8 h-8 rounded-full"
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold text-gray-900">
                Digital Heritage
              </h1>
              <p className="text-xs text-gray-500">Preservationists Platform</p>
            </div>
          </div>

          {/* Navigation Links - Center (Desktop) */}
          <div className="hidden xl:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={getNavClasses(item.path)}
                aria-label={`Navigate to ${item.name}`}
              >
                {item.icon}
                <span className="font-bold">{item.name}</span>
              </button>
            ))}
          </div>

          {/* Auth/User Section - Right (Desktop) */}
          <div className="hidden xl:flex items-center space-x-3">
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-green-900 transition-colors duration-200"
                  aria-label="User menu"
                  aria-expanded={isUserDropdownOpen}
                >
                  <UserCog2 className="h-4 w-4" />
                  <span className="font-bold">
                    {user?.username || "Account"}
                  </span>
                </button>
                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                    <button
                      onClick={() => handleNavigation("profile")}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      aria-label="View profile"
                    >
                      Profile
                    </button>
                    <button
                      onClick={() => handleNavigation("orders")}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      aria-label="View orders"
                    >
                      Orders
                    </button>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                      aria-label="Logout"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <a
                  href="/login"
                  className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-green-900 transition-colors duration-200"
                  aria-label="Log In"
                >
                  <LogIn className="h-4 w-4" />
                  <span className="font-bold">Log In</span>
                </a>
                <a
                  href="/register"
                  className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  aria-label="Sign Up"
                >
                  <UserPlus className="h-4 w-4" />
                  <span className="font-bold">Sign Up</span>
                </a>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="xl:hidden p-2 rounded-lg text-gray-700 hover:text-green-900 hover:bg-gray-50 transition-colors duration-200"
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="xl:hidden border-t border-gray-100 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Mobile Navigation Links */}
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={getMobileNavClasses(item.path)}
                  aria-label={`Navigate to ${item.name}`}
                >
                  {item.icon}
                  <span className="font-bold">{item.name}</span>
                </button>
              ))}

              {/* Mobile Auth/User Section */}
              <div className="pt-4 space-y-2 border-t">
                {isLoggedIn ? (
                  <>
                    <button
                      onClick={() => handleNavigation("profile")}
                      className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-700 hover:text-green-900 hover:bg-gray-50 transition-colors duration-200"
                      aria-label="View profile"
                    >
                      <UserCog2 className="h-4 w-4" />
                      <span className="font-bold">
                        Profile ({user?.username || "Account"})
                      </span>
                    </button>
                    <button
                      onClick={() => handleNavigation("orders")}
                      className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-700 hover:text-green-900 hover:bg-gray-50 transition-colors duration-200"
                      aria-label="View orders"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      <span className="font-bold">Orders</span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 px-3 py-2 rounded-lg text-red-600 hover:text-red-700 hover:bg-gray-50 transition-colors duration-200"
                      aria-label="Logout"
                    >
                      <LogOut className="h-4 w-4" />
                      <span className="font-bold">Logout</span>
                    </button>
                  </>
                ) : (
                  <>
                    <a
                      href="/login"
                      className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-700 hover:text-green-900 hover:bg-gray-50 transition-colors duration-200"
                      aria-label="Log In"
                    >
                      <LogIn className="h-4 w-4" />
                      <span className="font-bold">Log In</span>
                    </a>
                    <a
                      href="/register"
                      className="flex items-center space-x-2 px-3 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                      aria-label="Sign Up"
                    >
                      <UserPlus className="h-4 w-4" />
                      <span className="font-bold">Sign Up</span>
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
