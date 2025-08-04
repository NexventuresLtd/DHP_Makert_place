import { useState } from "react";
import Navbar from "../comps/sharedComps/Navbar";
import Footer from "../comps/sharedComps/Footer";
import LibraryHero from "../comps/LibraryComps/LibraryHero";
import LibraryDocuments from "../comps/LibraryComps/LibraryDocuments";
import LibraryCollections from "../comps/LibraryComps/LibraryCollections";
import LibraryStats from "../comps/LibraryComps/LibraryStats";

export default function Library() {
  const [activeTab, setActiveTab] = useState<"documents" | "collections">(
    "documents"
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <LibraryHero />

      {/* Stats Section */}
      <LibraryStats />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("documents")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "documents"
                    ? "border-orange-500 text-orange-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Documents
              </button>
              <button
                onClick={() => setActiveTab("collections")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "collections"
                    ? "border-orange-500 text-orange-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Collections
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "documents" ? (
          <LibraryDocuments />
        ) : (
          <LibraryCollections />
        )}
      </div>

      <Footer />
    </div>
  );
}
