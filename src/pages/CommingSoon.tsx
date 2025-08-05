import { useState, useEffect } from "react";
import { Clock, Mail, MapPin, CheckCircle } from "lucide-react";

const ComingSoon = () => {
    // Set launch date to 5 days from now
    const launchDate = new Date();
    launchDate.setDate(launchDate.getDate() + 5);

    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    // Live countdown timer
    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = launchDate.getTime() - now;

            if (distance > 0) {
                setTimeLeft({
                    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((distance % (1000 * 60)) / 1000)
                });
            }
        }, 1000);

        return () => clearInterval(timer);
    }, []);



    const features = [
        "MARKETPLACE: Buy and sell digital products",
        "DIGITAL REPOSITORY: Store and share digital heritage",
        "LIBRARY: Access a vast collection of digital documents",
        "MUSEUM: Explore digital exhibitions and artifacts",

    ];

    return (
        <div className="min-h-screen  p-4 bg-blend-overlay bg-white/90 backdrop-blur-3xl" style={{

        }}>
            {/* Animated background elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-20 h-20 bg-primary-100 rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute top-40 right-20 w-32 h-32 bg-secondary-100 rounded-full opacity-20 animate-pulse delay-1000"></div>
                <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-primary-100 rounded-full opacity-20 animate-pulse delay-2000"></div>
            </div>

            <div className="max-w-7xl mx-auto relative bg-transparent p-8 pt-0 -mt-5">
                {/* Header */}
                <div className="text-center mb-12 pt-8 max-w-7xl bg-white mx-auto">
                    <div className="flex flex-col items-center gap-2 text-primary-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
                        <div className="w-24 h-24 bg-primary rounded-lg flex items-center justify-center">
                            <img src="logos/logo-circle.png" alt="Digital Heritage" className="w-full h-full scale-150 rounded-full" />
                        </div>
                        Something amazing is coming
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary-600 via-secondary-600 to-primary-800 bg-clip-text text-transparent mb-6">
                        DHP Platform
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        The future of Digital Heritage Platform is almost here! Stay tuned for our launch in just a few days.
                    </p>
                </div>

                {/* Main content grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    {/* Left side - Countdown and features */}
                    <div className="space-y-8">
                        {/* Countdown timer */}
                        <div className="bg-white rounded-2xl p-8 ">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                                Launching in:
                            </h2>
                            <div className="grid grid-cols-4 gap-4">
                                {[
                                    { label: 'Days', value: timeLeft.days },
                                    { label: 'Hours', value: timeLeft.hours },
                                    { label: 'Minutes', value: timeLeft.minutes },
                                    { label: 'Seconds', value: timeLeft.seconds }
                                ].map((item) => (
                                    <div key={item.label} className="text-center">
                                        <div className="bg-primary to-secondary-600 text-white text-2xl md:text-3xl font-bold py-4 px-2 rounded-xl shadow-lg transform hover:scale-105 transition-transform">
                                            {String(item.value).padStart(2, '0')}
                                        </div>
                                        <span className="text-sm text-gray-500 mt-2 block font-medium">
                                            {item.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Features preview */}
                        <div className="bg-white rounded-2xl p-8 ">
                            <h3 className="text-xl font-bold text-gray-800 mb-6">What's Coming:</h3>
                            <div className="space-y-4">
                                {features.map((feature, index) => (
                                    <div key={index} className="flex items-center gap-3 group">
                                        <div className="w-8 h-8 bg-gradient-to-r from-secondary-400 to-primary-500 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                            <CheckCircle className="h-4 w-4 text-white" />
                                        </div>
                                        <span className="text-gray-700 group-hover:text-gray-900 transition-colors">
                                            {feature}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right side - Subscription and info */}
                    <div className="space-y-8">
                        {/* Hero visual */}
                        <div className="bg-gradient-to-br from-primary-500 via-secondary-600 to-primary-700 rounded-2xl h-64 flex items-center justify-center relative overflow-hidden shadow-2xl">
                            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                            <div className="relative z-10 text-center text-white">
                                <Clock className="h-20 w-20 mx-auto mb-4 animate-pulse" />
                                <p className="text-xl font-semibold">Revolution in Progress</p>
                            </div>
                            {/* Animated circles */}
                            <div className="absolute top-4 right-4 w-16 h-16 border-2 border-white border-opacity-30 rounded-full animate-ping"></div>
                            <div className="absolute bottom-6 left-6 w-12 h-12 border-2 border-white border-opacity-20 rounded-full animate-ping delay-1000"></div>
                        </div>

                        {/* Email subscription */}

                        {/* Contact info */}
                        <div className="bg-white rounded-2xl p-8 ">
                            <h3 className="text-lg font-bold text-gray-800 mb-6">Get in Touch</h3>
                            <div className="space-y-4">
                                <div className="flex items-start gap-4 group">
                                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary-200 transition-colors">
                                        <Mail className="h-5 w-5 text-primary-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-800">Email Us</h4>
                                        <p className="text-gray-600">thedhpplatform@gmail.com</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 group">
                                    <div className="w-10 h-10 bg-secondary-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-secondary-200 transition-colors">
                                        <MapPin className="h-5 w-5 text-secondary-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-800">Our Location</h4>
                                        <p className="text-gray-600">Kn 78 st, Kigali, Rwanda</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-16 py-8 ">
                    <p className="text-gray-500">
                        © {new Date().getFullYear()} DHP Platform. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ComingSoon;