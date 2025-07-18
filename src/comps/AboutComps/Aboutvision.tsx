import {  ArrowRight } from 'lucide-react';
import React from 'react';

const MissionVision: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="w-full md:max-w-11/12 mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Mission and Vision</h1>
          <p className="text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed">
            Our aspiration is to be the world's digital heritage epicenter, known for protecting cultural diversity, encouraging collaboration, and pioneering field's standards.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Image Grid */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-2 gap-4">
              {/* Top Left - Keys/Tools Image */}
              <div className="bg-gray-200 rounded-lg p-8 flex items-center justify-center h-40">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-800 rounded mx-auto mb-2 flex items-center justify-center">
                    <div className="text-white text-xs">🔧</div>
                  </div>
                  <div className="text-xs text-gray-600">TOOLS</div>
                </div>
              </div>

              {/* Top Right - Abstract Shape */}
              <div className="bg-gray-300 rounded-lg relative h-40 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-400 to-gray-600 transform rotate-12 scale-150"></div>
              </div>

              {/* Middle Left - Figure/Person */}
              <div className="bg-gray-100 rounded-lg p-8 flex items-center justify-center h-40">
                <div className="text-center">
                  <div className="w-12 h-16 bg-gray-400 rounded-t-full mx-auto mb-2"></div>
                  <div className="w-8 h-12 bg-gray-400 rounded mx-auto"></div>
                  <div className="w-6 h-8 bg-gray-400 rounded mx-auto mt-1"></div>
                </div>
              </div>

              {/* Middle Right - Document/Book */}
              <div className="bg-red-500 rounded-lg p-6 flex items-center justify-center h-40">
                <div className="bg-white rounded p-4 w-full max-w-20">
                  <div className="space-y-1">
                    <div className="h-2 bg-red-200 rounded"></div>
                    <div className="h-2 bg-red-200 rounded"></div>
                    <div className="h-2 bg-red-200 rounded w-3/4"></div>
                    <div className="h-2 bg-red-200 rounded"></div>
                    <div className="h-2 bg-red-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>

              {/* Bottom Left - Abstract Light */}
              <div className="bg-gray-200 rounded-lg relative h-40 overflow-hidden">
                <div className="absolute bottom-0 left-4 w-2 h-20 bg-gradient-to-t from-yellow-200 to-transparent transform -skew-x-12"></div>
                <div className="absolute bottom-0 left-6 w-4 h-24 bg-gradient-to-t from-yellow-300 to-transparent transform -skew-x-12"></div>
                <div className="absolute bottom-0 left-10 w-3 h-16 bg-gradient-to-t from-yellow-200 to-transparent transform -skew-x-12"></div>
              </div>

              {/* Bottom Right - Feather/Quill */}
              <div className="bg-gray-200 rounded-lg p-8 flex items-center justify-center h-40">
                <div className="text-center">
                  <div className="w-1 h-16 bg-gray-800 rounded mx-auto relative">
                    <div className="absolute -top-2 -left-2 w-5 h-12 bg-gray-600 rounded-full transform -rotate-12"></div>
                    <div className="absolute -top-1 -right-2 w-4 h-10 bg-gray-500 rounded-full transform rotate-12"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="space-y-8">
            {/* The Essence of DHP's purpose */}
            <div className="border-l-4 border-blue-500 pl-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                The Essence of DHP's purpose
              </h2>
              <p className="text-gray-700 leading-relaxed">
                The Digital Heritage Preservationists platform is dedicated to using digital methods to safeguard and promote global cultural heritage. Our mission is to ensure the preservation and protection of cultural artifacts, monuments, traditions, and knowledge for future generations, employing digital technologies and innovative preservation methods.
              </p>
            </div>

            {/* Preserving the past for the future */}
            <div className="border-l-4 border-green-500 pl-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Preserving the past for the future
              </h2>
            </div>

            {/* Elevating cultural treasures */}
            <div className="border-l-4 border-purple-500 pl-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Elevating cultural treasures into the digital realm
              </h2>
            </div>
          </div>
        </div>
        <button className='flex gap-2 p-3 mt-10 mx-auto bg-primary text-white rounded-lg font-medium px-6 cursor-pointer'>Get Started <ArrowRight/></button>
      </div>
    </div>
  );
};

export default MissionVision;