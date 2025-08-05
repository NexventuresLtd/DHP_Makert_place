import { useState } from "react";
import {
  BookOpen,
  FileText,
  Scroll,
  Newspaper,
  Archive,
  Unlock,
} from "lucide-react";
import LibraryDocuments from "../LibraryComps/LibraryDocuments";

interface LibraryGalleryProps {
  libraryType?: string;
}

export default function LibraryGallery({
  libraryType = "Digital Books",
}: LibraryGalleryProps) {
  const [selectedType, setSelectedType] = useState(libraryType);

  const libraryTypes = [
    {
      name: "Digital Books",
      icon: BookOpen,
      color: "from-green-600 to-green-800",
    },
    {
      name: "Research Papers",
      icon: FileText,
      color: "from-green-500 to-green-700",
    },
    { name: "Manuscripts", icon: Scroll, color: "from-green-700 to-green-900" },
    { name: "Journals", icon: Newspaper, color: "from-green-400 to-green-600" },
    {
      name: "Special Collections",
      icon: Archive,
      color: "from-green-800 to-green-900",
    },
    { name: "Open Access", icon: Unlock, color: "from-green-300 to-green-500" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100">
      {/* Library Type Selector */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap gap-3">
            {libraryTypes.map((type) => (
              <button
                key={type.name}
                onClick={() => setSelectedType(type.name)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                  selectedType === type.name
                    ? `bg-primary text-white shadow-lg`
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <type.icon className="w-4 h-4" />
                {type.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            {(() => {
              const currentType = libraryTypes.find(
                (t) => t.name === selectedType
              );
              if (currentType) {
                const IconComponent = currentType.icon;
                return (
                  <div
                    className={`w-12 h-12 bg-primary rounded-xl flex items-center justify-center`}
                  >
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                );
              }
              return null;
            })()}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {selectedType}
              </h1>
              <p className="text-gray-600">
                Browse and access digital library resources
              </p>
            </div>
          </div>
        </div>

        {/* Library Documents Component */}
        <LibraryDocuments selectedType={selectedType} />
      </div>
    </div>
  );
}
