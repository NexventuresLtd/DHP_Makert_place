import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  ArrowRight,
  ChevronUp
} from 'lucide-react';
import { useState } from 'react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubscribe = () => {
    if (email.trim()) {
      // Simulate subscription
      setIsSubscribed(true);
      setTimeout(() => {
        setIsSubscribed(false);
        setEmail('');
      }, 3000);
    }
  };

  return (
    <footer className="bg-primary text-white relative">
      {/* Back to top button */}
      <button
        onClick={scrollToTop}
        className="absolute -top-4 right-4 sm:-top-6 sm:right-6 lg:right-8 bg-white text-slate-900 p-2 sm:p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-10"
        aria-label="Back to top"
      >
        <ChevronUp size={16} className="sm:w-5 sm:h-5" />
      </button>

      <div className="max-w-11/12 mx-auto px-4 sm:px-6 lg:px-2">
        {/* Main footer content */}
        <div className="py-12 sm:py-16">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 lg:gap-6">

            {/* Digital Repository */}
            <div className="sm:col-span-1">
              <h3 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6 relative">
                Digital Repository
                <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-white/30"></div>
              </h3>
              <ul className="space-y-2 sm:space-y-3">
                {['Galleries', 'Libraries', 'Museums', 'Archives', 'Digital Content'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-white/80 hover:text-white transition-colors duration-200 flex items-center group text-sm sm:text-base">
                      <ArrowRight size={12} className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 sm:w-3.5 sm:h-3.5" />
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Marketplace */}
            <div className="sm:col-span-1">
              <h3 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6 relative">
                Marketplace
                <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-white/30"></div>
              </h3>
              <ul className="space-y-2 sm:space-y-3">
                {['Artifacts', 'Clothes', 'Paintings', 'More'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-white/80 hover:text-white transition-colors duration-200 flex items-center group text-sm sm:text-base">
                      <ArrowRight size={12} className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 sm:w-3.5 sm:h-3.5" />
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* E-Learning & Resources - Stacked on mobile */}
            <div className="sm:col-span-2 lg:col-span-1 xl:col-span-1">
              <div className="space-y-8">
                {/* E-Learning */}
                <div>
                  <h3 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6 relative">
                    E-Learning
                    <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-white/30"></div>
                  </h3>
                  <ul className="space-y-2 sm:space-y-3">
                    {['Culture', 'Language', 'Reading', 'Others'].map((item) => (
                      <li key={item}>
                        <a href="#" className="text-white/80 hover:text-white transition-colors duration-200 flex items-center group text-sm sm:text-base">
                          <ArrowRight size={12} className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 sm:w-3.5 sm:h-3.5" />
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Resources */}
                <div>
                  <h3 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6 relative">
                    Resources
                    <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-white/30"></div>
                  </h3>
                  <ul className="space-y-2 sm:space-y-3">
                    {['Help Center', 'Blog', 'Tutorials', 'FAQs'].map((item) => (
                      <li key={item}>
                        <a href="#" className="text-white/80 hover:text-white transition-colors duration-200 flex items-center group text-sm sm:text-base">
                          <ArrowRight size={12} className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 sm:w-3.5 sm:h-3.5" />
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Support & Company - Stacked on mobile */}
            <div className="sm:col-span-2 lg:col-span-1 xl:col-span-1">
              <div className="space-y-8">
                {/* Support */}
                <div>
                  <h3 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6 relative">
                    Support
                    <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-white/30"></div>
                  </h3>
                  <ul className="space-y-2 sm:space-y-3">
                    {['Contact Us', 'Developers'].map((item) => (
                      <li key={item}>
                        <a href="#" className="text-white/80 hover:text-white transition-colors duration-200 flex items-center group text-sm sm:text-base">
                          <ArrowRight size={12} className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 sm:w-3.5 sm:h-3.5" />
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Company */}
                <div>
                  <h3 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6 relative">
                    Company
                    <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-white/30"></div>
                  </h3>
                  <ul className="space-y-2 sm:space-y-3">
                    {['About', 'Press', 'Events'].map((item) => (
                      <li key={item}>
                        <a href="#" className="text-white/80 hover:text-white transition-colors duration-200 flex items-center group text-sm sm:text-base">
                          <ArrowRight size={12} className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 sm:w-3.5 sm:h-3.5" />
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            {/* Newsletter & Contact - Full width on mobile */}
            <div className="sm:col-span-1 lg:col-span-3 xl:col-span-1">
              <h3 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6 relative">
                Stay Connected
                <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-white/30"></div>
              </h3>

              {/* Newsletter */}
              <div className="mb-6 sm:mb-8">
                <p className="text-white/80 mb-3 sm:mb-4 text-sm">Subscribe to our newsletter for updates</p>
                <div className="space-y-3 sm:space-y-0 sm:flex sm:gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full sm:flex-1 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent text-sm sm:text-base"
                  />
                  <button
                    onClick={handleSubscribe}
                    disabled={isSubscribed}
                    className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2.5 bg-white text-slate-900 rounded-lg hover:bg-white/90 transition-colors duration-200 font-medium text-sm sm:text-base disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubscribed ? 'Subscribed!' : 'Subscribe'}
                  </button>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                <div className="flex items-start text-white/80">
                  <MapPin size={14} className="mr-2 sm:mr-3 flex-shrink-0 mt-0.5 sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-sm">Rwanda, Kigali</span>
                </div>
                <div className="flex items-center text-white/80">
                  <Phone size={14} className="mr-2 sm:mr-3 flex-shrink-0 sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-sm">+250 788 282 962</span>
                </div>
                <div className="flex items-center text-white/80">
                  <Mail size={14} className="mr-2 sm:mr-3 flex-shrink-0 sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-sm">hello@irage.com</span>
                </div>
              </div>

              {/* Social Icons */}
              <div className="flex flex-wrap gap-3 sm:gap-4">
                {[
                  { Icon: Facebook, label: 'Facebook' },
                  { Icon: Twitter, label: 'Twitter' },
                  { Icon: Instagram, label: 'Instagram' },
                  { Icon: Linkedin, label: 'LinkedIn' },
                  { Icon: Youtube, label: 'YouTube' }
                ].map(({ Icon, label }) => (
                  <a
                    key={label}
                    href="#"
                    className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors duration-200"
                    aria-label={label}
                  >
                    <Icon size={16} className="sm:w-4 sm:h-4" />
                  </a>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-white/20 py-6 sm:py-8">
          <div className="flex flex-col space-y-4 lg:flex-row lg:justify-between lg:items-center lg:space-y-0">
            <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-6">
              <p className="text-white/80 text-xs sm:text-sm text-center sm:text-left">
                &copy; {new Date().getFullYear()} Irage. All rights reserved.
              </p>
              <div className="flex justify-center sm:justify-start space-x-4 sm:space-x-6">
                <a href="#" className="text-white/60 hover:text-white text-xs sm:text-sm transition-colors duration-200">
                  Terms of Service
                </a>
                <a href="#" className="text-white/60 hover:text-white text-xs sm:text-sm transition-colors duration-200">
                  Privacy Policy
                </a>
              </div>
            </div>

            {/* App Store badges */}
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <div className="bg-white/10 px-3 sm:px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-white/20 transition-colors duration-200 cursor-pointer">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-white/20 rounded flex items-center justify-center">
                  <span className="text-xs font-bold">A</span>
                </div>
                <div>
                  <div className="text-xs text-white/80">Download on the</div>
                  <div className="text-xs sm:text-sm font-semibold">App Store</div>
                </div>
              </div>
              <div className="bg-white/10 px-3 sm:px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-white/20 transition-colors duration-200 cursor-pointer">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-white/20 rounded flex items-center justify-center">
                  <span className="text-xs font-bold">G</span>
                </div>
                <div>
                  <div className="text-xs text-white/80">Get it on</div>
                  <div className="text-xs sm:text-sm font-semibold">Google Play</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-white/20 via-white/40 to-white/20"></div>
    </footer>
  );
};

export default Footer;