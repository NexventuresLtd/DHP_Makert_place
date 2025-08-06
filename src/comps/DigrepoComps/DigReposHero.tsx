import { useState, useRef, useEffect } from "react";
import {
  ChevronDown,
  Menu,
  X,
  Download,
  Share2,
  Users,
  BookOpen,
  Archive,
  Database,
  Image,
  Building2,
  User2,
} from "lucide-react";
import PaintingsGallery from "./DigRepoPainting";
import MuseumsGallery from "./DigRepoMesuasem";
import LibraryGallery from "./DigRepoLibrary";
import ArtCollectionsGallery from "./DigRepoArtCollections";
import DigitalExhibitionsGallery from "./DigRepoDigitalExhibitions";
import VirtualToursGallery from "./DigRepoVirtualTours";
import FeaturedWorksGallery from "./DigRepoFeaturedWorks";
import RecentAdditionsGallery from "./DigRepoRecentAdditions";
import ArchiveGallery from "./DigRepoArchive";
import DigitalContentGallery from "./DigRepoDigitalContent";
import MyContentPage from "./MyContent";
import { getUserInfo, isLoggedIn } from "../../app/Localstorage";

// Coming Soon Component for unimplemented features
const ComingSoonGallery = ({ title }: { title: string }) => (
  <div className="min-h-screen bg-gradientto-br from-gray-50 via-white to-blue-50 flex items-center justify-center">
    <div className="text-center">
      <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
        <Archive className="w-12 h-12 text-white" />
      </div>
      <h1 className="text-4xl font-bold text-gray-900 mb-4">{title}</h1>
      <p className="text-xl text-gray-600 mb-8 max-w-md">
        This section is currently under development. Check back soon for amazing
        content!
      </p>
      <div className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg font-medium">
        <Database className="w-5 h-5" />
        Coming Soon
      </div>
    </div>
  </div>
);
interface DigitalRepositoryProps {
  showThings: boolean;
  viewDig: string;
  setShowThings: React.Dispatch<React.SetStateAction<boolean>>;
  setViewDig: React.Dispatch<React.SetStateAction<string>>;
}
const DigitalRepository = ({
  showThings,
  viewDig,
  setShowThings,
  setViewDig,
}: DigitalRepositoryProps) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showCreatorModal, setShowCreatorModal] = useState(true);
  const [showMyContent, setShowMyContent] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const navigationItems = [
    {
      name: "Galleries",
      icon: Image,
      items: [
        "Art Collections",
        "Paintings",
        "Digital Exhibitions",
        "Virtual Tours",
        "Featured Works",
        "Recent Additions",
      ],
    },
    {
      name: "Museums",
      icon: Building2,
      items: ["All Museums"],
      // items: ['National Museum', 'Cultural Heritage', 'History Museum', 'Science Museum', 'Art Museum', 'Local Museums']
    },
    {
      name: "Libraries",
      icon: BookOpen,
      items: [
        "Digital Books",
        "Research Papers",
        "Manuscripts",
        "Journals",
        "Special Collections",
        "Open Access",
      ],
    },
    {
      name: "Archives",
      icon: Archive,
      items: [
        "Historical Documents",
        "Government Records",
        "Personal Papers",
        "Institutional Archives",
        "Media Archives",
        "Digital Preservation",
      ],
    },
    {
      name: "Digital Content",
      icon: Database,
      items: [
        "Datasets",
        "Multimedia",
        "Interactive Content",
        "Educational Resources",
        "3D Models",
        "Audio Collections",
      ],
    },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  return (
    <div
      style={{
        backgroundImage: `${
          showThings &&
          `url('https://visitrwanda.com/wp-content/uploads/fly-images/2029/Visit-Rwanda_-Nyanza-Traditional-Intore-Dancers-1650x1100.jpg')`
        }`,
      }}
      className={`${
        showThings &&
        `min-h-screen bg-cover bg-gradient-to-br from-slate-50 via-white to-blue-50`
      }`}
    >
      {/* Creator Modal */}
      {showCreatorModal && showThings && !isLoggedIn && (
        <div className="absolute inset-0 bg-black/0 backdrop-blur-none z-46 flex items-center justify-center p-4 w-fit h-fit top-23 ml-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform animate-in fade-in-50 zoom-in-95">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-700 to-green-900 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Join as Creator
                </h3>
                <p className="text-sm text-gray-600">
                  Help build our digital repository
                </p>
              </div>
            </div>
            <p className="text-gray-700 mb-6">
              Do you want to join creators? Creators are involved in adding
              content to DHP repository.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCreatorModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                No
              </button>
              <button
                onClick={() => setShowCreatorModal(false)}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-400 text-white rounded-lg hover:from-amber-500 hover:to-orange-500 transition-all font-medium shadow-lg"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md  border-b border-gray-200/50 sticky top-0 z-40">
        <div className="max-w-full md:max-w-11/12 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Desktop Navigation */}
            <div
              className="hidden lg:flex items-center space-x-1"
              ref={dropdownRef}
            >
              {navigationItems.map((item) => (
                <div key={item.name} className="relative">
                  <button
                    onClick={() => toggleDropdown(item.name)}
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-green-900 hover:bg-blue-50/50 rounded-lg transition-all duration-200 font-bold"
                  >
                    <item.icon className="w-4 h-4" />
                    {item.name}
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        activeDropdown === item.name ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {activeDropdown === item.name && (
                    <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-in fade-in-0 zoom-in-95 z-50">
                      {item.items.map((subItem, index) => (
                        <a
                          key={index}
                          onClick={() => {
                            setViewDig(subItem);
                            setShowThings(false);
                          }}
                          className="block px-4 py-3 text-gray-700 hover:text-primary hover:bg-blue-50/50 transition-colors"
                        >
                          {subItem}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            {(getUserInfo.type === "creator" || getUserInfo.type === "admin") &&
              isLoggedIn && (
                <button
                  onClick={() => {
                    setShowMyContent(true);
                    setShowThings(false);
                    setViewDig("");
                  }}
                  className="bg-orange-400 gap-2 flex text-white py-2 px-3 rounded-md cursor-pointer hover:bg-orange-500"
                >
                  <User2 /> My Content
                </button>
              )}
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="lg:hidden border-t border-gray-200 py-4 animate-in slide-in-from-top-5">
              {navigationItems.map((item) => (
                <div key={item.name} className="mb-2">
                  <button
                    onClick={() => toggleDropdown(item.name)}
                    className="flex items-center justify-between w-full px-4 py-3 text-gray-700 hover:text-primary hover:bg-blue-50/50 rounded-lg transition-colors font-medium"
                  >
                    <div className="flex items-center gap-2">
                      <item.icon className="w-4 h-4" />
                      {item.name}
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        activeDropdown === item.name ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {activeDropdown === item.name && (
                    <div className="ml-6 mt-2 space-y-1 animate-in slide-in-from-top-2">
                      {item.items.map((subItem, index) => (
                        <a
                          key={index}
                          onClick={() => setViewDig(subItem)}
                          className="block px-4 py-2 text-gray-600 hover:text-primary hover:bg-blue-50/50 rounded-lg transition-colors"
                        >
                          {subItem}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </nav>
      {showThings && (
        <>
          {/* Hero Section */}
          <div className="relative min-h-[80vh] flex items-center">
            {/* Background Image with Overlay */}
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url('https://visitrwanda.com/wp-content/uploads/fly-images/2029/Visit-Rwanda_-Nyanza-Traditional-Intore-Dancers-1650x1100.jpg')`,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent" />

            {/* Content */}
            <div className="relative w-full md:max-w-11/12 mx-auto px-4 sm:px-6 lg:px-8 py-20">
              <div className="max-w-4xl">
                <div className="bg-black/40 backdrop-blur-md rounded-3xl p-8 lg:p-12 shadow-2xl">
                  <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                    Welcome to Digital
                    <span className="block  text-primary  bg-clip-text text-transparent">
                      Repository
                    </span>
                  </h1>

                  <p className="text-xl text-gray-100 mb-8 leading-relaxed max-w-2xl">
                    You can navigate through the content of digital repository
                    as it is from trusted creators. You can download and share
                    if you want.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4">
                    {!isLoggedIn && (
                      <>
                        <button
                          onClick={() => {
                            window.location.href = "/register";
                          }}
                          className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-400 to-orange-400 text-white font-semibold rounded-xl hover:from-amber-500 hover:to-orange-500 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
                        >
                          <Users className="w-5 h-5" />
                          Become A Creator
                        </button>

                        <button className="inline-flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                          <Download className="w-5 h-5" />
                          Explore Content
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Action Buttons */}
            <div className="absolute bottom-8 right-8 flex flex-col gap-3">
              <button className="w-14 h-14 bg-primary hover:bg-green-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group">
                <Share2 className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </button>
              <button className="w-14 h-14 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group">
                <Download className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>

          {/* Stats Section */}
          <div className="py-16 bg-white/90 backdrop-blur-sm">
            <div className="w-full md:max-w-11/12 mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-800 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Image className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    50K+
                  </div>
                  <div className="text-gray-600">Digital Assets</div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    1.2K+
                  </div>
                  <div className="text-gray-600">Active Creators</div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Building2 className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    200+
                  </div>
                  <div className="text-gray-600">Institutions</div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Archive className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    5M+
                  </div>
                  <div className="text-gray-600">Downloads</div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {/** Change the Viepages Here */}
      {viewDig == "Paintings" && <PaintingsGallery />}
      {viewDig == "All Museums" && <MuseumsGallery />}
      {viewDig == "Art Collections" && <ArtCollectionsGallery />}
      {viewDig == "Digital Exhibitions" && <DigitalExhibitionsGallery />}
      {viewDig == "Virtual Tours" && <VirtualToursGallery />}
      {viewDig == "Featured Works" && <FeaturedWorksGallery />}
      {viewDig == "Recent Additions" && <RecentAdditionsGallery />}
      {(viewDig == "Digital Books" ||
        viewDig == "Research Papers" ||
        viewDig == "Manuscripts" ||
        viewDig == "Journals" ||
        viewDig == "Special Collections" ||
        viewDig == "Open Access") && <LibraryGallery libraryType={viewDig} />}

      {/* Archives Section */}
      {(viewDig == "Historical Documents" ||
        viewDig == "Government Records" ||
        viewDig == "Personal Papers" ||
        viewDig == "Institutional Archives" ||
        viewDig == "Media Archives" ||
        viewDig == "Digital Preservation") && (
        <ArchiveGallery archiveType={viewDig} />
      )}

      {/* Digital Content Section */}
      {(viewDig == "Datasets" ||
        viewDig == "Multimedia" ||
        viewDig == "Interactive Content" ||
        viewDig == "Educational Resources" ||
        viewDig == "3D Models" ||
        viewDig == "Audio Collections") && (
        <DigitalContentGallery contentType={viewDig} />
      )}

      {/* My Content Page */}
      {showMyContent && <MyContentPage />}
      {}
    </div>
  );
};

export default DigitalRepository;
