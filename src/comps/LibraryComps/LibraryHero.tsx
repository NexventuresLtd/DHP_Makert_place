import { Search, BookOpen, Users, Download } from "lucide-react";

export default function LibraryHero() {
  return (
    <div className="bg-gradient-to-r from-green-900 to-green-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <BookOpen className="h-16 w-16 mx-auto mb-6 text-green-200" />
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Digital Library
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-green-100 max-w-3xl mx-auto">
            Explore our extensive collection of documents, research papers,
            books, and academic resources
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search documents, authors, or subjects..."
                className="w-full pl-12 pr-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-300"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md transition-colors">
                Search
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <BookOpen className="h-8 w-8 mx-auto mb-2 text-green-200" />
              <div className="text-2xl font-bold">10,000+</div>
              <div className="text-green-100">Documents</div>
            </div>
            <div className="text-center">
              <Users className="h-8 w-8 mx-auto mb-2 text-green-200" />
              <div className="text-2xl font-bold">500+</div>
              <div className="text-green-100">Authors</div>
            </div>
            <div className="text-center">
              <Download className="h-8 w-8 mx-auto mb-2 text-green-200" />
              <div className="text-2xl font-bold">50,000+</div>
              <div className="text-green-100">Downloads</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
