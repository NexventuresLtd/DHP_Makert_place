
import {
  Search,
  Info,
  MapPin,
  Video,
  Users,
  Gift,
  ArrowRight
} from 'lucide-react';

const ExploreMuseums = () => {
  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Background curved shapes */}
      <div className="absolute inset-0">
        {/* Gray curve */}

        <img src="logos/Waves.png" className="absolute top-0 right-0 w-full h-full" alt="" />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left Content */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Explore museums
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed">
                Get to know about various museums, art palaces and Galleries located everywhere in Rwanda.
                Partnership with the individual museums grant DHP platform a chance to virtually tour the museums,
                connecting them to intellectuals from individual museums. You can also win a free ticket to visit
                one of the museums through our Give-aways!
              </p>
            </div>

            {/* Navigation Menu */}
            <div onClick={() => { localStorage.setItem("showThing", "false"); localStorage.setItem("viewDig", "Museums"); window.location.href = "/resources"; }} className="space-y-2">
              <div className="flex items-center justify-between p-4 bg-white rounded-xl hover:shadow-md transition-shadow duration-200 cursor-pointer group">
                <div className="flex items-center space-x-3">
                  <Search size={20} className="text-gray-500" />
                  <span className="text-gray-700 font-medium">More</span>
                </div>
                <ArrowRight size={18} className="text-gray-400 group-hover:text-gray-600 transition-colors duration-200" />
              </div>

              <div onClick={() => { localStorage.setItem("showThing", "false"); localStorage.setItem("viewDig", "Museums"); window.location.href = "/resources"; }} className="flex items-center justify-between p-4 bg-white rounded-xl hover:shadow-md transition-shadow duration-200 cursor-pointer group">
                <div className="flex items-center space-x-3">
                  <Info size={20} className="text-gray-500" />
                  <span className="text-gray-700 font-medium">About</span>
                </div>
                <ArrowRight size={18} className="text-gray-400 group-hover:text-gray-600 transition-colors duration-200" />
              </div>

              <div onClick={() => { localStorage.setItem("showThing", "false"); localStorage.setItem("viewDig", "Museums"); window.location.href = "/resources"; }} className="flex items-center justify-between p-4 bg-white rounded-xl hover:shadow-md transition-shadow duration-200 cursor-pointer group">
                <div className="flex items-center space-x-3">
                  <MapPin size={20} className="text-gray-500" />
                  <span className="text-gray-700 font-medium">Location</span>
                </div>
                <ArrowRight size={18} className="text-gray-400 group-hover:text-gray-600 transition-colors duration-200" />
              </div>

              <div onClick={() => { localStorage.setItem("showThing", "false"); localStorage.setItem("viewDig", "Museums"); window.location.href = "/resources"; }} className="flex items-center justify-between p-4 bg-white rounded-xl hover:shadow-md transition-shadow duration-200 cursor-pointer group">
                <div className="flex items-center space-x-3">
                  <Video size={20} className="text-gray-500" />
                  <span className="text-gray-700 font-medium">Virtual tour</span>
                </div>
                <ArrowRight size={18} className="text-gray-400 group-hover:text-gray-600 transition-colors duration-200" />
              </div>

              <div onClick={() => { localStorage.setItem("showThing", "false"); localStorage.setItem("viewDig", "Museums"); window.location.href = "/resources"; }} className="flex items-center justify-between p-4 bg-white rounded-xl hover:shadow-md transition-shadow duration-200 cursor-pointer group">
                <div className="flex items-center space-x-3">
                  <Users size={20} className="text-gray-500" />
                  <span className="text-gray-700 font-medium">Social platform</span>
                </div>
                <ArrowRight size={18} className="text-gray-400 group-hover:text-gray-600 transition-colors duration-200" />
              </div>

              <div onClick={() => { localStorage.setItem("showThing", "false"); localStorage.setItem("viewDig", "Museums"); window.location.href = "/resources"; }} className="flex hidden items-center justify-between p-4 bg-white rounded-xl hover:shadow-md transition-shadow duration-200 cursor-pointer group">
                <div className="flex items-center space-x-3">
                  <Gift size={20} className="text-gray-500" />
                  <span className="text-gray-700 font-medium">Give away</span>
                </div>
                <ArrowRight size={18} className="text-gray-400 group-hover:text-gray-600 transition-colors duration-200" />
              </div>
            </div>
          </div>

          {/* Right Content - Stacked Images */}
          <div className="relative">
            {/* Main large image */}
            <div className="relative z-30 transform rotate-1 hover:rotate-0 transition-transform duration-300">
              <div className="bg-white p-3 rounded-2xl shadow-xl">
                {/* Browser header */}
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
                <div className="aspect-video bg-gradient-to-br from-blue-100 to-green-100 rounded-xl overflow-hidden">
                  <img
                    src="https://irage.rw/media/museums/main/Visit-Rwanda-Kings-Palace-Nyanza-Front-1-1280x853.jpg"
                    alt="Museum exterior with traditional architecture"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Top background image */}
            <div className="absolute -top-34 -right-4 z-20 transform -rotate-2">
              <div className="bg-white p-3 rounded-2xl shadow-lg">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
                <div className="w-80 h-48 bg-gradient-to-br from-orange-100 to-red-100 rounded-xl overflow-hidden">
                  <img
                    src="https://www.rwandawildlifesafari.com/wp-content/uploads/2024/10/Visit-Rwanda-Ethnographic-Museum-1650x1097-1-1170x450.jpg"
                    alt="Museum interior with paintings"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Bottom right image */}
            <div className="absolute -bottom-34 -right-2 z-10 transform rotate-3">
              <div className="bg-white p-3 rounded-2xl shadow-lg">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
                <div className="w-64 h-40 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl overflow-hidden">
                  <img
                    src="https://www.rwandawildlifesafari.com/wp-content/uploads/2022/10/Kings-Palace-Nyanza.jpg"
                    alt="Museum artifacts and displays"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-1/6 left-1/4 w-4 h-4 bg-yellow-400 rounded-full opacity-60 animate-pulse"></div>
            <div className="absolute bottom-1/3 left-1/6 w-3 h-3 bg-blue-400 rounded-full opacity-40"></div>
            <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-green-400 rounded-full opacity-50"></div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ExploreMuseums;