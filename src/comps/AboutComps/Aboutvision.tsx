import { ArrowRight } from 'lucide-react';
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Image Grid */}
          <div className="">
            <div className="grid grid-cols-2 gap-4">
              {/* Top Left - Traditional Tools */}
              <div className="rounded-lg overflow-hidden h-40">
                <img 
                  src="https://visitrwanda.com/wp-content/uploads/fly-images/4464/Screen-Shot-2019-12-20-at-16.08.24-1650x925.png" 
                  alt="Traditional cultural tools" 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Top Right - Cultural Artifact */}
              <div className="rounded-lg overflow-hidden h-40">
                <img 
                  src="https://primatesafaris.info/wp-content/uploads/2018/07/rwandan-culture-510x340.jpg" 
                  alt="Ancient cultural artifact" 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Middle Left - Cultural Figure */}
              <div className="rounded-lg overflow-hidden h-40">
                <img 
                  src="https://visitrwanda.com/wp-content/uploads/fly-images/4516/Amasunzu-Collage-web-v2-1650x1004.jpg" 
                  alt="Cultural heritage figure" 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Middle Right - Ancient Manuscript */}
              <div className="rounded-lg overflow-hidden h-40">
                <img 
                  src="https://www.newtimes.co.rw/uploads/imported_images/files/main/articles/2017/02/11/paidincowsthoughnowadaysmostpeoplehavereplacedcowswithmoney.T.jpg" 
                  alt="Ancient manuscript" 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Bottom Left - Cultural Architecture */}
              <div className="rounded-lg overflow-hidden h-40">
                <img 
                  src="https://eastafricavoyages.com/wp-content/uploads/2025/01/intore-dancers-performance-visit-rwanda-copy.jpg" 
                  alt="Cultural architecture" 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Bottom Right - Cultural Art Form */}
              <div className="rounded-lg overflow-hidden h-40">
                <img 
                  src="https://visitrwanda.com/wp-content/uploads/fly-images/1238/Visit-Rwanda-Kings-Palace-Nyanza-Front-1-700x467.jpg" 
                  alt="Traditional art form" 
                  className="w-full h-full object-cover"
                />
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
              <p className="text-gray-700 leading-relaxed">
                We leverage cutting-edge technologies like 3D scanning, digital archiving, and virtual reality to document and preserve cultural heritage that might otherwise be lost to time, conflict, or environmental factors.
              </p>
            </div>

            {/* Elevating cultural treasures */}
            <div className="border-l-4 border-purple-500 pl-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Elevating cultural treasures into the digital realm
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Through our digital platform, we make cultural heritage accessible to people worldwide, fostering cross-cultural understanding and appreciation while ensuring these treasures endure for generations to come.
              </p>
            </div>
          </div>
        </div>
        <button className='flex gap-2 p-3 mt-10 mx-auto bg-primary text-white rounded-lg font-medium px-6 cursor-pointer'>Get Started <ArrowRight/></button>
      </div>
    </div>
  );
};

export default MissionVision;