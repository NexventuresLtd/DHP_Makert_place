import { ArrowRight, Image, Building2, BookOpen, Archive, Database } from 'lucide-react';

const WhereToStartSection = () => {
  const sections = [
    {
      id: 'galleries',
      title: 'Galleries',
      description: 'Explore curated collections of paintings, sculptures, and artworks from trusted contributors. High-quality images available for download and sharing.',
      link: 'Browse Galleries',
      icon: Image,
      color: 'blue'
    },
    {
      id: 'museums',
      title: 'Museums',
      description: 'Discover museums across Rwanda with their artifacts and collections, managed directly by the institutions themselves.',
      link: 'Visit Museums',
      icon: Building2,
      color: 'emerald'
    },
    {
      id: 'libraries',
      title: 'Libraries',
      description: 'Access books and digital content from libraries throughout Rwanda. Read, download, and share educational resources.',
      link: 'Explore Libraries',
      icon: BookOpen,
      color: 'amber'
    },
    {
      id: 'archives',
      title: 'Archives',
      description: 'Discover historical documents and records that preserve Rwanda\'s rich cultural heritage and traditions.',
      link: 'View Archives',
      icon: Archive,
      color: 'rose'
    },
    {
      id: 'digital-content',
      title: 'Digital Content',
      description: 'Stream cultural podcasts, documentaries, and multimedia content showcasing Rwanda\'s heritage.',
      link: 'Watch & Listen',
      icon: Database,
      color: 'purple'
    }
  ];
  type ColorName = 'blue' | 'emerald' | 'amber' | 'rose' | 'purple';
  const getColorClasses = (color: ColorName) => {
    const colors = {
      blue: {
        bg: 'bg-blue-50',
        icon: 'bg-blue-100 text-blue-600',
        accent: 'text-blue-600',
        hover: 'hover:bg-blue-100'
      },
      emerald: {
        bg: 'bg-emerald-50',
        icon: 'bg-emerald-100 text-emerald-600',
        accent: 'text-emerald-600',
        hover: 'hover:bg-emerald-100'
      },
      amber: {
        bg: 'bg-amber-50',
        icon: 'bg-amber-100 text-amber-600',
        accent: 'text-amber-600',
        hover: 'hover:bg-amber-100'
      },
      rose: {
        bg: 'bg-rose-50',
        icon: 'bg-rose-100 text-rose-600',
        accent: 'text-rose-600',
        hover: 'hover:bg-rose-100'
      },
      purple: {
        bg: 'bg-purple-50',
        icon: 'bg-purple-100 text-purple-600',
        accent: 'text-purple-600',
        hover: 'hover:bg-purple-100'
      }
    };
    return colors[color];
  };

  return (
    <section className="py-24 bg-white">
      <div className="w-full md:max-w-11/12 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
            Where would you like to start?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Explore Rwanda's digital heritage through our comprehensive collections of cultural artifacts, artworks, and historical documents.
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {sections.map((section) => {
            const colorClasses = getColorClasses(section.color as ColorName);
            return (
              <div
                onClick={() => { localStorage.setItem("showThing", "false"); localStorage.setItem("viewDig", section.title); window.location.href = "/resources"; }}
                key={section.id}
                className={`group relative ${colorClasses.bg} rounded-2xl p-8 transition-all duration-300 hover:shadow-lg cursor-pointer border border-gray-100`}
              >
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-14 h-14 ${colorClasses.icon} rounded-xl mb-6 group-hover:scale-105 transition-transform duration-200`}>
                  <section.icon className="w-7 h-7" />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-semibold text-gray-900 mb-4 group-hover:text-gray-700 transition-colors">
                  {section.title}
                </h3>

                <p className="text-gray-600 leading-relaxed mb-6 text-base">
                  {section.description}
                </p>

                {/* Link */}
                <div className={`inline-flex items-center gap-2 ${colorClasses.accent} font-medium group-hover:gap-3 transition-all duration-200`}>
                  <span>{section.link}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="bg-gray-50 rounded-3xl p-12 text-center border border-gray-100">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-3xl font-semibold text-gray-900 mb-4">
              Ready to explore?
            </h3>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Start your journey through Rwanda's rich cultural heritage and discover thousands of carefully curated items from our partner institutions.
            </p>
            <button className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-white font-medium rounded-xl hover:bg-gray-800 transition-all duration-200 shadow-sm hover:shadow-md">
              <Database className="w-5 h-5" />
              Browse All Collections
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhereToStartSection;