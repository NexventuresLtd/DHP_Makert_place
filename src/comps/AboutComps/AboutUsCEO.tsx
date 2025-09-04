import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface TeamMember {
  id: number;
  name: string;
  position: string;
  quote: string;
  image: string;
}

const CEOProfileSlider: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const teamMembers: TeamMember[] = [
    {
      id: 1,
      name: "Elisha Clever",
      position: "CEO",
      quote: "Let's Keep on fostering African Heritage entrepreneurial ecosystem through investing in Africa's Heritage and Digital solutions toward sustinable Heritage Preservation",
      image: "images/ceo.png"
    }
    // {
    //   id: 2,
    //   name: "Sarah Johnson",
    //   position: "CTO",
    //   quote: "Technology is the bridge between our rich cultural past and an innovative digital future",
    //   image: "https://live.staticflickr.com/65535/54571298920_798668e3c5_z.jpg"
    // },
    // {
    //   id: 3,
    //   name: "Michael Chen",
    //   position: "Head of Operations",
    //   quote: "Preserving heritage requires both passion and precision in our approach",
    //   image: "https://live.staticflickr.com/65535/54571298920_798668e3c5_z.jpg"
    // },
    // {
    //   id: 4,
    //   name: "Amara Okafor",
    //   position: "Cultural Director",
    //   quote: "Every artifact tells a story that deserves to be preserved for generations",
    //   image: "/api/placeholder/400/400"
    // }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % teamMembers.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + teamMembers.length) % teamMembers.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const currentMember = teamMembers[currentSlide];

  return (
    <div className="bg-gray-50 py-16 px-4">
      <div className="max-w-11/12 mx-auto">
        <div className="relative bg-white rounded-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px]">
            {/* Image Section */}
            <div className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100">
                {/* Placeholder for actual image */}
                <div className="w-full h-full flex items-center justify-center">
                    <img src={`${currentMember.image}`} alt="" />
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <div className="mb-6">
                <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                  {currentMember.position}
                </span>
                <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mt-2 mb-6">
                  {currentMember.name}
                </h2>
              </div>

              <blockquote className="text-lg lg:text-xl text-gray-700 leading-relaxed mb-8">
                <span className="text-4xl text-yellow-400 font-bold">"</span>
                {currentMember.quote.split('Rwabahizi I').map((part, index) => (
                  <span key={index}>
                    {part}
                    {index === 0 && currentMember.quote.includes('Rwabahizi I') && (
                      <span className="text-green-400 font-semibold">" Rwabahizi I</span>
                    )}
                  </span>
                ))}
                <span className="text-4xl text-yellow-400 font-bold">"</span>
              </blockquote>

              {/* Slide Indicators */}
              <div className="flex space-x-2">
                {teamMembers.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                      index === currentSlide ? 'bg-gray-600' : 'bg-gray-300'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full shadow-lg transition-all duration-200 group"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600 group-hover:text-gray-800" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full shadow-lg transition-all duration-200 group"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6 text-gray-600 group-hover:text-gray-800" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CEOProfileSlider;