import React from 'react';
import { ArrowRight, User2 } from 'lucide-react';

const DHPHeroSection: React.FC = () => {
  return (
    <section className="relative h-[650px] max-md:pt-54 bg-primary overflow-hidden">

      {/* Background Pattern Overlay */}
      <div className="absolute inset-0 opacity-60">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("logos/aboutHero.png")`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover"
        }} />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Basket 1 */}
        <div className="absolute top-20 left-10 animate-float">
          <div className="w-24 h-24 bg-white/10 rounded-full backdrop-blur-sm border border-white/20 flex items-center justify-center">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-800 rounded-full opacity-60"></div>
          </div>
        </div>

        {/* Floating Basket 2 */}
        <div className="absolute top-32 right-20 animate-float-delayed">
          <div className="w-16 h-20 bg-white/10 rounded-full backdrop-blur-sm border border-white/20"></div>
        </div>

        {/* Floating Basket 3 */}
        <div className="absolute bottom-32 left-20 animate-float-slow">
          <div className="w-20 h-20 bg-white/10 rounded-full backdrop-blur-sm border border-white/20"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center h-full px-4 sm:px-6 lg:px-8 bg-black/30">
        <div className="max-w-full md:max-w-11/12 mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-12 items-center">

            {/* Left Content */}
            <div className="text-center space-y-8 text-white w-full">
              <div className="space-y-6">
                <h1 className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                  Know more about{' '}
                  <span className="bg-clip-text">
                    DHP platform
                  </span>
                </h1>

                <p className="text-lg sm:text-xl text-primary-muted max-w-2xl m-auto leading-relaxed">
                  A one-stop platform dedicated to digitizing African cultural assets and fostering social cohesion
                  among communities towards sustainable heritage preservation.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex  sm:flex-row gap-4 justify-center lg:justify-center w-full">
                <button onClick={()=>window.location.href = "/register"} className="btn-primary group inline-flex items-center gap-3 px-8 py-4 rounded-full text-white font-semibold text-lg transition-all duration-300 hover:shadow-xl">
                  <span>Get Started</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                </button>

                <button onClick={()=>window.location.href = "/login"} className="group inline-flex items-center gap-3 px-8 py-4 rounded-full text-white font-semibold text-lg border-2 border-white/30 hover:bg-white/10 transition-all duration-300">
                  <User2 className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                  <span>Invite </span>
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 pt-8 border-t border-white/20">
                <div className="text-center lg:text-left">
                  <div className="text-2xl sm:text-3xl font-bold text-white">50K+</div>
                  <div className="text-sm text-primary-muted">Cultural Assets</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-2xl sm:text-3xl font-bold text-white">200+</div>
                  <div className="text-sm text-primary-muted">Communities</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-2xl sm:text-3xl font-bold text-white">15</div>
                  <div className="text-sm text-primary-muted">Countries</div>
                </div>
              </div>
            </div>

            {/* Right Visual Element - African Baskets */}


          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>

      {/* Custom Animations */}
      <style >{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-3deg); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(2deg); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite 2s;
        }
        .animate-float-slow {
          animation: float-slow 10s ease-in-out infinite 4s;
        }
      `}</style>
    </section>
  );
};

export default DHPHeroSection;