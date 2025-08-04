import { useState } from "react";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Users,
  Camera,
  BookOpen,
  Globe,
  Play,
} from "lucide-react";
import RelatedSuggestionsDemo from "./DigRepoYouMight";
import type { Museum } from "../../services/museumService";

interface MuseumDetailViewProps {
  museum: Museum;
  onBack: () => void;
}

// New interfaces for dynamic content
interface MuseumSection {
  id: string;
  title: string;
  content: string[];
  subsections?: MuseumSubsection[];
}

interface MuseumSubsection {
  title: string;
  content: string;
  type?: "text" | "highlight" | "cta";
  buttonText?: string;
  buttonAction?: () => void;
}

interface GalleryItem {
  id: number;
  imageUrl: string;
  title: string;
  description?: string;
}

interface Artifact {
  id: number;
  name: string;
  description: string;
  imageUrl?: string;
  category: string;
  historicalPeriod?: string;
}

interface MuseumInfo {
  hours: string;
  contact?: string;
  admission?: string;
  facilities?: string[];
}

interface VirtualExhibition {
  id: number;
  title: string;
  description: string;
  type: "tour" | "exhibition" | "experience";
  duration?: string;
  featured?: boolean;
}

const navigationItems = [
  { id: "overview", label: "Overview", icon: BookOpen },
  { id: "gallery", label: "Gallery", icon: Camera },
  { id: "artifacts", label: "Artifacts", icon: Users },
  { id: "cultural-heritage", label: "Cultural Heritage", icon: Globe },
  { id: "natural-history", label: "Natural History", icon: Clock },
  { id: "virtual-exhibitions", label: "Virtual Exhibitions", icon: Play },
];

export default function MuseumDetailView({
  museum,
  onBack,
}: MuseumDetailViewProps) {
  const [activeSection, setActiveSection] = useState("overview");

  // Dynamic museum data
  const museumData = {
    sections: {
      overview: {
        id: "overview",
        title: `The Royal Echoes of ${museum.location}: ${museum.name}`,
        content: [
          `Immerse yourself in the regal echoes of Rwanda at the ${museum.name} in ${museum.location}. This reconstructed royal dwelling is a masterful homage to the past, shaped like a beehive under an intricate thatched canopy that whispers tales of a bygone era.`,
          `${museum.location}, once the pulsating heart of Rwanda, was a stage where power was seized and battles were waged, according to the lore passed down through generations. The monarchy, originally nomadic in nature, drifted from one court to another until it found a permanent abode.`,
          `The capital of the kingdom once buzzed with as many as 2,000 inhabitants, their homes constructed using the same meticulous methods displayed in the museum today. Nestled behind the museum, one can find a herd of the majestic, long-horned Inyambo cattle, the descendants of the king's own herd.`,
          `Belonging to the broader Ankole breed, these stately bovines played a significant role in royal ceremonies. Adorned with resplendent jewelry, they were trained to heed their handler's songs and move in a ceremonial march, adding to the grandeur of the royal court.`,
          `Even though the monarchy dissolved with Rwanda's independence from colonial rule in 1962, the tradition of breeding and grooming Inyambo continues under the aegis of the Rwanda Agriculture Board.`,
        ],
        subsections: [
          {
            title: `Visit ${museum.name} Virtually?`,
            content: `A reconstruction of the traditional royal residence, the ${museum.name} is a beautifully-crafted thatched dwelling shaped like a beehive.`,
            type: "cta",
            buttonText: "Take tour",
          },
        ],
      } as MuseumSection,
      "cultural-heritage": {
        id: "cultural-heritage",
        title: "Cultural Heritage",
        content: [
          "Discover the rich cultural traditions that shaped Rwanda's royal heritage. From traditional dances to ceremonial practices, explore the living culture that continues to influence modern Rwanda.",
          "The royal court was renowned for its sophisticated cultural practices, including poetry, music, and dance that celebrated the kingdom's history and values.",
          "Traditional craftsmanship flourished under royal patronage, producing exquisite works in metal, wood, and textiles that represented the pinnacle of artistic achievement.",
        ],
      } as MuseumSection,
      "natural-history": {
        id: "natural-history",
        title: "Natural History",
        content: [
          "Learn about the natural environment that surrounded the royal palace and how it influenced the daily life of the kingdom's inhabitants.",
          "The region's unique ecosystem provided both resources and challenges that shaped the development of royal architecture and agricultural practices.",
          "Understanding the relationship between the monarchy and the natural world reveals important insights into sustainable practices that were centuries ahead of their time.",
        ],
      } as MuseumSection,
    },
    gallery: [
      {
        id: 1,
        imageUrl:
          "https://ugandarwandagorillatours.com/wp-content/uploads/2024/03/image.jpg",
        title: "Royal Palace Exterior",
        description: "Traditional beehive architecture",
      },
      {
        id: 2,
        imageUrl:
          "https://www.newtimes.co.rw/thenewtimes/uploads/images/2024/05/24/48595.jpg",
        title: "Interior Details",
        description: "Intricate thatched ceiling work",
      },
      {
        id: 3,
        imageUrl:
          "https://thumbs.dreamstime.com/z/kandt-house-museum-natural-history-20274855.jpg",
        title: "Inyambo Cattle",
        description: "Sacred long-horned cattle",
      },
      {
        id: 4,
        imageUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Rwanda%27s_Histrory_Inside_Kandt_House_Museum_Walls_%2819%29%22.jpg/2560px-Rwanda%27s_Histrory_Inside_Kandt_House_Museum_Walls_%2819%29%22.jpg",
        title: "Ceremonial Grounds",
        description: "Traditional gathering spaces",
      },
      {
        id: 5,
        imageUrl:
          "https://upload.wikimedia.org/wikipedia/commons/2/2f/Front_side_in_Richard_Kandt_museum_view.jpg",
        title: "Cultural Artifacts",
        description: "Royal ceremonial items",
      },
      {
        id: 6,
        imageUrl:
          "https://c8.alamy.com/comp/W7YG10/african-elephant-skull-loxodonta-africana-natural-history-museum-of-kigali-also-known-as-kandt-house-kigali-rwanda-april-2014-W7YG10.jpg",
        title: "Historical Context",
        description: "Archaeological discoveries",
      },
    ] as GalleryItem[],
    artifacts: [
      {
        id: 1,
        name: "Royal Crown",
        description:
          "Ceremonial headpiece worn during important state functions and religious ceremonies.",
        category: "Royal Regalia",
        historicalPeriod: "18th Century",
      },
      {
        id: 2,
        name: "Traditional Spears",
        description:
          "Ornate weapons used in ceremonial guards and royal processions.",
        category: "Ceremonial Weapons",
        historicalPeriod: "17th-19th Century",
      },
      {
        id: 3,
        name: "Ceremonial Drums",
        description:
          "Sacred drums used in royal ceremonies and communication across the kingdom.",
        category: "Musical Instruments",
        historicalPeriod: "16th-19th Century",
      },
      {
        id: 4,
        name: "Ancient Pottery",
        description:
          "Utilitarian and decorative vessels showcasing traditional craftsmanship techniques.",
        category: "Domestic Items",
        historicalPeriod: "15th-18th Century",
      },
    ] as Artifact[],
    info: {
      hours: "9:00 AM - 5:00 PM",
      contact: "+250 XXX XXX XXX",
      admission: "Adults: 3,000 RWF | Students: 1,500 RWF",
      facilities: [
        "Guided Tours",
        "Gift Shop",
        "Parking",
        "Accessibility Access",
      ],
    } as MuseumInfo,
    virtualExhibitions: [
      {
        id: 1,
        title: "Interactive Virtual Tours",
        description: "Experience the museum from anywhere in the world",
        type: "tour",
        duration: "45 minutes",
        featured: true,
      },
      {
        id: 2,
        title: "360° Royal Palace Experience",
        description: "Immersive walkthrough of the reconstructed palace",
        type: "experience",
        duration: "30 minutes",
      },
      {
        id: 3,
        title: "Digital Artifact Collection",
        description: "Detailed examination of royal artifacts",
        type: "exhibition",
        duration: "20 minutes",
      },
    ] as VirtualExhibition[],
  };

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        const overviewSection = museumData.sections.overview;
        return (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="relative">
              <div className="relative h-64 md:h-80 lg:h-96 rounded-2xl overflow-hidden">
                <img
                  src={museum.main_image}
                  alt={museum.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <div className="bg-green-600 bg-opacity-90 backdrop-blur-sm rounded-lg p-6">
                    <h2 className="text-2xl font-bold mb-2">{museum.name}</h2>
                    <p className="text-green-100 mb-4">{museum.description}</p>
                    <p className="text-green-50 text-sm">
                      {museum.long_description}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="prose prose-lg max-w-none">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {overviewSection.title}
              </h3>

              {overviewSection.content.map((paragraph, index) => (
                <p key={index} className="text-gray-700 leading-relaxed mb-6">
                  {paragraph}
                </p>
              ))}

              {/* Dynamic Subsections */}
              {overviewSection.subsections?.map((subsection, index) => (
                <div
                  key={index}
                  className={`rounded-2xl p-8 my-8 ${
                    subsection.type === "cta"
                      ? "bg-gray-900 text-white"
                      : "bg-gray-50"
                  }`}
                >
                  <h4 className="text-xl font-bold mb-4">{subsection.title}</h4>
                  <p
                    className={`mb-6 ${
                      subsection.type === "cta"
                        ? "text-gray-300"
                        : "text-gray-700"
                    }`}
                  >
                    {subsection.content}
                  </p>
                  {subsection.buttonText && (
                    <button
                      className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                        subsection.type === "cta"
                          ? "bg-white text-gray-900 hover:bg-gray-100"
                          : "bg-primary text-white "
                      }`}
                    >
                      {subsection.buttonText}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case "gallery":
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900">Gallery</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {museumData.gallery.map((item) => (
                <div key={item.id} className="group">
                  <div className="aspect-square rounded-lg overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="mt-3">
                    <h4 className="font-medium text-gray-900">{item.title}</h4>
                    {item.description && (
                      <p className="text-sm text-gray-600 mt-1">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "artifacts":
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900">Artifacts</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {museumData.artifacts.map((artifact) => (
                <div
                  key={artifact.id}
                  className="bg-white border border-gray-200 rounded-lg p-6"
                >
                  <div className="w-full h-48 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                    {artifact.imageUrl ? (
                      <img
                        src={artifact.imageUrl}
                        alt={artifact.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <Camera className="w-12 h-12 text-gray-400" />
                    )}
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900">
                      {artifact.name}
                    </h4>
                    <p className="text-sm text-blue-600 font-medium">
                      {artifact.category}
                    </p>
                    {artifact.historicalPeriod && (
                      <p className="text-xs text-gray-500">
                        {artifact.historicalPeriod}
                      </p>
                    )}
                    <p className="text-gray-600 text-sm mt-2">
                      {artifact.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "cultural-heritage":
        const culturalSection = museumData.sections["cultural-heritage"];
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900">
              {culturalSection.title}
            </h3>
            <div className="prose prose-lg max-w-none">
              {culturalSection.content.map((paragraph, index) => (
                <p key={index} className="text-gray-700 leading-relaxed mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        );

      case "natural-history":
        const naturalSection = museumData.sections["natural-history"];
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900">
              {naturalSection.title}
            </h3>
            <div className="prose prose-lg max-w-none">
              {naturalSection.content.map((paragraph, index) => (
                <p key={index} className="text-gray-700 leading-relaxed mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        );

      case "virtual-exhibitions":
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900">
              Virtual Exhibitions
            </h3>
            <div className="space-y-4">
              {museumData.virtualExhibitions.map((exhibition) => (
                <div
                  key={exhibition.id}
                  className={`rounded-lg p-6 ${
                    exhibition.featured
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <Play
                          className={`w-5 h-5 mr-2 ${
                            exhibition.featured ? "text-white" : "text-gray-400"
                          }`}
                        />
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            exhibition.featured
                              ? "bg-white/20 text-white"
                              : "bg-blue-100 text-primary"
                          }`}
                        >
                          {exhibition.type.toUpperCase()}
                        </span>
                        {exhibition.duration && (
                          <span
                            className={`text-xs ml-2 ${
                              exhibition.featured
                                ? "text-gray-300"
                                : "text-gray-500"
                            }`}
                          >
                            {exhibition.duration}
                          </span>
                        )}
                      </div>
                      <h4
                        className={`text-lg font-semibold mb-2 ${
                          exhibition.featured ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {exhibition.title}
                      </h4>
                      <p
                        className={`mb-4 ${
                          exhibition.featured
                            ? "text-gray-300"
                            : "text-gray-600"
                        }`}
                      >
                        {exhibition.description}
                      </p>
                    </div>
                    <button
                      className={`ml-4 px-4 py-2 rounded-lg font-semibold transition-colors ${
                        exhibition.featured
                          ? "bg-white text-gray-900 hover:bg-gray-100"
                          : "bg-primary text-white"
                      }`}
                    >
                      {exhibition.type === "tour"
                        ? "Start Tour"
                        : "View Exhibition"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-full md:max-w-10/12 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-6">
            <button
              onClick={onBack}
              className="flex items-center text-gray-600 hover:text-gray-900 mr-6"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Museums
            </button>
            <h1 className="text-2xl font-bold text-gray-900">{museum.name}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-full md:max-w-10/12 mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <nav className="space-y-1">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full flex items-center px-4 py-3 text-left text-sm font-medium transition-colors ${
                        activeSection === item.id
                          ? "bg-orange-100 text-orange-700 border-r-2 border-orange-500"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      <Icon className="w-4 h-4 mr-3" />
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Museum Info Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Location
                    </p>
                    <p className="text-sm text-gray-600">{museum.location}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Clock className="w-5 h-5 text-gray-400 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Hours</p>
                    <p className="text-sm text-gray-600">
                      {museumData.info.hours}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Users className="w-5 h-5 text-gray-400 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Category
                    </p>
                    <p className="text-sm text-gray-600">
                      {museum.category_name}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 lg:p-8">
              {renderContent()}
            </div>
            <RelatedSuggestionsDemo />
          </div>
        </div>
      </div>
    </div>
  );
}
