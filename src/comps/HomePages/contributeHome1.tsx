import { Check } from 'lucide-react';

const ContributeSection = () => {
  return (
    <div className="bg-primary px-6 py-16 lg:px-16">
      <div className="max-w-full md:max-w-11/12 mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Content */}
          <div className="text-white space-y-8">
            <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
              You can contribute too!
            </h2>
            
            <p className="text-lg lg:text-xl text-white/90 leading-relaxed max-w-lg">
              Contribute to the The DHP platform by publishing an article, selling an artifact, sharing a testimonial or simply attending exhibitions
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg text-white/90">Are you Heritage enthusiast?</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg text-white/90">Are you cultural institution?</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg text-white/90">Are you researcher?</span>
              </div>
            </div>
            
            <button onClick={()=>window.location.href="/involved"} className="inline-flex items-center px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg border border-white/30 transition-all duration-300 hover:scale-105 backdrop-blur-sm">
              Start now
            </button>
          </div>
          
          {/* Right Images Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Top Row */}
            <div className="space-y-4 ">
              <div className="aspect-square bg-white/10 rounded-2xl overflow-hidden backdrop-blur-sm border border-white/20">
                <img 
                  src="logos/img1.png" 
                  alt="Abstract curved lines"
                  className="w-full h-full object-cover opacity-80"
                />
              </div>
              
              <div className="aspect-square bg-white/10 rounded-2xl overflow-hidden backdrop-blur-sm border border-white/20">
                <img 
                  src="logos/img2.png" 
                  alt="Minimal landscape"
                  className="w-full h-full object-cover opacity-80"
                />
              </div>
            </div>
            
            {/* Right Column */}
            <div className="space-y-4">
              <div className="aspect-square bg-white/10 rounded-2xl overflow-hidden backdrop-blur-sm border border-white/20">
                <img 
                  src="logos/img3.png" 
                  alt="Geometric patterns"
                  className="w-full h-full object-cover opacity-80"
                />
              </div>
              
              <div className="aspect-square bg-white/10 rounded-2xl overflow-hidden backdrop-blur-sm border border-white/20 flex items-center justify-center">
                <div className="w-8 h-8 bg-red-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContributeSection;