interface RelatedItem {
  id: number;
  name: string;
  dates: string;
  description: string;
  imageUrl: string;
  category?: string;
}

interface RelatedSuggestionsProps {
  title?: string;
  items: RelatedItem[];
  onItemClick?: (item: RelatedItem) => void;
}

const RelatedSuggestions = ({ 
  title = "You may also like these", 
  items,
  onItemClick 
}: RelatedSuggestionsProps) => {
  const handleReadMore = (item: RelatedItem) => {
    if (onItemClick) {
      onItemClick(item);
    }
  };

  return (
    <div className="w-full py-12 bg-gray-50">
      <div className="w-full md:max-w-11/12 mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">{title}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div 
              key={item.id}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
            >
              {/* Image Container */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Content Overlay */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold leading-tight">
                      {item.name}
                    </h3>
                    
                    <p className="text-sm text-gray-200 font-medium">
                      {item.dates}
                    </p>
                    
                    <p className="text-sm text-gray-100 leading-relaxed line-clamp-4">
                      {item.description}
                    </p>
                    
                    <button
                      onClick={() => handleReadMore(item)}
                      className="inline-flex items-center text-orange-400 hover:text-orange-300 text-sm font-semibold transition-colors duration-200 mt-2"
                    >
                      Read more
                      <svg 
                        className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path 
                          fillRule="evenodd" 
                          d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" 
                          clipRule="evenodd" 
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Example usage with sample data
export default function RelatedSuggestionsDemo() {
  const sampleItems: RelatedItem[] = [
    {
      id: 1,
      name: "Mutara III Rudahigwa",
      dates: "(March 1911 – 25 July 1959)",
      description: "was King (umwami) of Rwanda between 1931 and 1959. He was the first Rwandan king to be baptised, bringing Catholicism to the country. His Christian name was Charles Léon Pierre and he is sometimes referred to as Charles Mutara III Rudahigwa.",
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&crop=face",
      category: "Historical Figure"
    },
    {
      id: 2,
      name: "Alexis Kagame",
      dates: "(15 May 1912 – 2 December 1981)",
      description: "was a Rwandan philosopher, linguist, historian, poet and Catholic priest. His main contributions were in the fields of ethnohistory and \"ethnophilosophy\" (the study of indigenous philosophical systems).",
      imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=300&fit=crop&crop=face",
      category: "Philosopher"
    },
    {
      id: 3,
      name: "Alexis Kagame",
      dates: "(15 May 1912 – 2 December 1981)",
      description: "was a Rwandan philosopher, linguist, historian, poet and Catholic priest. His main contributions were in the fields of ethnohistory and \"ethnophilosophy\" (the study of indigenous philosophical systems).",
      imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=300&fit=crop&crop=face",
      category: "Scholar"
    }
  ];

  const handleItemClick = (item: RelatedItem) => {
    console.log('Clicked item:', item.name);
    // Handle navigation or modal opening here
  };

  return (
    <div className=" bg-white">
      <RelatedSuggestions 
        items={sampleItems}
        onItemClick={handleItemClick}
      />
    </div>
  );
}