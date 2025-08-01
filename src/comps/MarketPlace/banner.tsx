import { useState, useEffect } from 'react';
import { ArrowRight, Heart, Globe, Users, Camera } from 'lucide-react';
import type { Category } from '../../types/marketTypes';
import { fetchCategories } from '../../app/utlis/getCategoriesUtils';

export default function IrageBanner() {
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const loadCategories = async () => {
      try {
        const newData = await fetchCategories();
        setCategories(newData);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    if (categories.length > 0) {
      const interval = setInterval(() => {
        setCurrentCategoryIndex((prevIndex) =>
          (prevIndex + 1) % categories.length
        );
      }, 5000); // Change every 5 seconds

      return () => clearInterval(interval);
    }
  }, [categories]);


  return (
    <div className="relative w-full bg-white overflow-hidden bg-[url('/images/research.png')] bg-cover bg-center bg-repeat-space bg-blend-overlay bg-white/90 backdrop-blur-3xl">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm0 0c0 11.046 8.954 20 20 20s20-8.954 20-20-8.954-20-20-20-20 8.954-20 20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      {/* Gradient Overlays */}
      <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-blue-200/10 to-transparent"></div>
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-green-200/10 to-transparent"></div>

      <div className="relative w-full md:max-w-11/12 mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content Side - EXACTLY AS ORIGINAL */}
          <div className="space-y-8">
            {/* Logo/Brand */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br bg-second rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">irage.rw</h1>
                <p className="text-blue-600 font-medium">Cultural Heritage Platform</p>
              </div>
            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                Preserve & Share
                <span className="block text-transparent bg-clip-text text-second">
                  Rwanda's Heritage
                </span>
              </h2>

              <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                Discover, document, and celebrate the rich cultural tapestry of Rwanda.
                Connect with traditions, stories, and communities that shape our identity.
              </p>
            </div>

            {/* Feature Points */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Camera className="w-4 h-4 text-primary" />
                </div>
                <span className="text-gray-700 font-medium">Digital Archives</span>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-primary" />
                </div>
                <span className="text-gray-700 font-medium">Community Stories</span>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Globe className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-gray-700 font-medium">Cultural Mapping</span>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Heart className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-gray-700 font-medium">Heritage Tours</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={() => {window.location.href = '/resources'}} className="bg-second text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                <span>Explore Heritage</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button onClick={() => {window.location.href = '/register'}} className="border-2 text-white bg-primary px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2">
                <span>Join Community</span>
              </button>
            </div>
          </div>

          {/* Visual Side - ONLY CHANGING THE IMAGE DISPLAY */}
          <div className="relative">
            {/* Main Visual Container */}
            <div className="relative">
              {/* Background Cards */}
              <div className="absolute top-8 left-8 w-64 h-40 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl transform rotate-6 opacity-80"></div>
              <div className="absolute top-4 left-12 w-64 h-40 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-xl transform -rotate-3 opacity-90"></div>

              {/* Main Card - Now showing category image */}
              <div className="relative w-full h-96 md:h-80 lg:h-96 xl:h-[28rem]">
                {/* Stacked gallery container */}
                <div className="relative w-full h-full">
                  {categories.map((category, index) => {
                    const isCurrent = index === currentCategoryIndex;
                    const zIndex = categories.length - index;
                    const translateX = isCurrent ? 0 : (index < currentCategoryIndex ? -20 : 20);
                    const opacity = isCurrent ? 1 : 0.7;
                    const scale = isCurrent ? 1 : 0.9;
                    const rotation = isCurrent ? 0 : (index < currentCategoryIndex ? -2 : 2);

                    return (
                      <div
                        key={category.id}
                        className={`absolute inset-0 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] rounded-2xl shadow-xl overflow-hidden ${isCurrent ? 'cursor-default' : 'cursor-pointer'}`}
                        style={{
                          zIndex,
                          transform: `translateX(${translateX}px) rotate(${rotation}deg) scale(${scale})`,
                          opacity,
                        }}
                        onClick={() => !isCurrent && setCurrentCategoryIndex(index)}
                      >
                        {/* Image with hover zoom effect */}
                        <div className="relative w-full h-full group">
                          <img
                            src={category.image}
                            alt={category.name}
                            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                          />

                          {/* Overlay with info */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex flex-col justify-end p-6">
                            <h3 className={`text-white font-bold text-xl mb-1 transition-all duration-300 ${isCurrent ? 'translate-y-0' : 'translate-y-4'}`}>
                              {category.name}
                            </h3>
                            <p className={`text-white/90 text-sm transition-all duration-500 ${isCurrent ? 'translate-y-0 opacity-90' : 'translate-y-6 opacity-0'}`}>
                              {category.description}
                            </p>
                          </div>

                          {/* Indicator for current image */}
                          {isCurrent && (
                            <div className="absolute top-4 right-4 flex space-x-1">
                              {categories.map((_, i) => (
                                <span
                                  key={i}
                                  className={`block h-1 rounded-full transition-all duration-300 ${i === currentCategoryIndex ? 'w-4 bg-white' : 'w-2 bg-white/50'}`}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {/* Navigation arrows */}
                  {categories.length > 1 && (
                    <>
                      <button
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center bg-white/80 rounded-full shadow-lg hover:bg-white transition-all duration-300 hover:scale-110"
                        onClick={() => setCurrentCategoryIndex(prev => (prev - 1 + categories.length) % categories.length)}
                      >
                        <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center bg-white/80 rounded-full shadow-lg hover:bg-white transition-all duration-300 hover:scale-110"
                        onClick={() => setCurrentCategoryIndex(prev => (prev + 1) % categories.length)}
                      >
                        <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </>
                  )}
                </div>

                {/* Loading state */}
                {loading && (
                  <div className="absolute inset-0 bg-gray-100 rounded-2xl flex items-center justify-center">
                    <div className="animate-pulse flex flex-col space-y-4 w-full p-6">
                      <div className="flex justify-between">
                        <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                        <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                        <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                      </div>
                      <div className="space-y-3">
                        <div className="h-4 bg-gray-300 rounded-full w-3/4"></div>
                        <div className="h-4 bg-gray-300 rounded-full w-full"></div>
                        <div className="h-4 bg-gray-300 rounded-full w-1/2"></div>
                      </div>
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex space-x-2">
                          <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                          <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                        </div>
                        <div className="text-xs text-gray-400 font-medium">irage.rw</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Floating Elements - unchanged */}
              <div className="absolute -top-2 -right-2 w-12 h-12 bg-yellow-400 rounded-full shadow-lg flex items-center justify-center transform animate-bounce">
                <Camera className="w-6 h-6 text-white" />
              </div>

              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full shadow-lg opacity-80 transform animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-16 fill-current text-gray-50">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
        </svg>
      </div>
    </div>
  );
}