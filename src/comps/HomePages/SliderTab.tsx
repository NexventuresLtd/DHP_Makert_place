import { useState, useEffect, type SetStateAction } from 'react';

export default function ShareholdersRow() {
  const shareholders = [
    {
      image: "https://www.nexventures.net/assets/Icon-ueBx2e_P.png",
      name: "Nexventures Ltd",
      type: "Innovation • Growth • Excellence"
    },
    {
      image: "https://framerusercontent.com/images/fSoESBqOrj2XDZv0nyqa0BMjIc.png?scale-down-to=1024", // Add your actual image paths
      name: "Duktep Ltd",
      type: "Digital Solutions"
    },
    {
      image: "https://media.licdn.com/dms/image/v2/D4D0BAQEmTaxOMXDdbA/company-logo_200_200/company-logo_200_200/0/1722533094551?e=1759968000&v=beta&t=A8uP_Mztsxi5TCZlPTOBYrwdp1xOLSvfjmbYUtTfe2w",
      name: "L&D Community",
      type: "Learn, Evolve, Thrive"
    },
    {
      image: "/placeholder-image.jpg",
      name: "Digital Heritage Corp",
      type: " Digital Organization"
    },
    {
      image: "/placeholder-image.jpg",
      name: "Legacy Partners",
      type: " Cultural Organization"
    },
    {
      image: "/placeholder-image.jpg",
      name: "Cultural Innovation Hub",
      type: " Cultural Organization"
    },
    {
      image: "/placeholder-image.jpg",
      name: "Rwanda Cultural Fund",
      type: " Cultural Organization"
    },
    {
      image: "/placeholder-image.jpg",
      name: "Digital Legacy Inc",
      type: " Digital Organization"
    },

  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);
  const totalSlides = Math.ceil(shareholders.length / itemsPerView);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(1);
      } else if (window.innerWidth < 768) {
        setItemsPerView(2);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(3);
      } else {
        setItemsPerView(4);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setCurrentIndex(0);
  }, [itemsPerView]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, 6000);
    return () => clearInterval(interval);
  }, [totalSlides]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index: SetStateAction<number>) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative w-full py-8 bg-gradient-to-b from-slate-50/50 to-gray-300/10 bg-gray-300/10">
      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
      >
        <svg className="w-5 h-5 text-slate-600 group-hover:text-slate-900 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
      >
        <svg className="w-5 h-5 text-slate-600 group-hover:text-slate-900 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Slider Container */}
      <div className="overflow-hidden mx-4 sm:mx-8 md:mx-12 lg:mx-16">
        <div
          className="flex transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {Array.from({ length: totalSlides }).map((_, slideIndex) => (
            <div key={slideIndex} className="w-full flex-shrink-0">
              <div className="flex gap-3 sm:gap-4 md:gap-5 lg:gap-6 px-2 sm:px-3 md:px-4">
                {shareholders
                  .slice(slideIndex * itemsPerView, (slideIndex + 1) * itemsPerView)
                  .map((shareholder, index) => (
                    <div
                      key={slideIndex * itemsPerView + index}
                      className="group relative flex-1 bg-white/70 rounded-2xl p-4 sm:p-5 md:p-6 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2"
                    >
                      {/* Gradient Overlay */}
                      <div className="absolute via-transparent to-indigo-50/30 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      {/* Logo */}
                      <div className="relative mb-4 sm:mb-5 md:mb-6">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gradient-to-br from-primary/10 via-indigo-500/10 to-purple-500/10 rounded-2xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                          <img
                            src={shareholder.image}
                            alt={shareholder.name}
                            className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 object-contain rounded-xl"
                          />
                        </div>
                      </div>

                      {/* Content */}
                      <h3 className="relative text-xs sm:text-sm font-semibold text-slate-800 group-hover:text-primary transition-colors duration-300 leading-snug mb-1 sm:mb-2">
                        {shareholder.name}
                      </h3>

                      <p className="relative text-xs text-slate-500 opacity-60 group-hover:opacity-100 group-hover:text-slate-600 transition-all duration-300">
                        {shareholder.type}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center mt-6 sm:mt-7 md:mt-8 gap-1 sm:gap-2">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentIndex
                ? 'bg-primary w-4 sm:w-6 md:w-8'
                : 'bg-slate-300 hover:bg-slate-400'
              }`}
          />
        ))}
      </div>
    </div>
  );
}