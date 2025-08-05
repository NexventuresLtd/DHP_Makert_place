import { useState, useEffect } from 'react';
import {
    Mic,
    Users,
    BookOpen,
    HandHeart,
    GraduationCap,
    CalendarDays,
    X,
    ChevronRight,
    Loader2,
    MessageCircle,
    ArrowRight,
    Check,
    Sparkles
} from 'lucide-react';
import DigitalHeritagePlatform from '../comps/sharedComps/Navbar';
import Footer from '../comps/sharedComps/Footer';

// Online placeholder images (replace with your actual image URLs)
const cardImages = [
    'https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://images.ctfassets.net/wp1lcwdav1p1/3gcLNpuEYnRSnLYL5L7H8X/b142a45375cb39c19874de921383be6a/GettyImages-1986193967.jpg?w=1500&h=680&q=60&fit=fill&f=faces&fm=jpg&fl=progressive&auto=format%2Ccompress&dpr=1&w=1000', // Creator
    'https://hermosalifetourism.com/wp-content/uploads/2021/07/RWANDA-MUSEUMS-2-scaled.jpg', // Vendor
    'https://www.newtimes.co.rw/thenewtimes/uploads/images/2024/01/27/thumbs/1200x700/39597.jpg', // Teach
    'https://www.vsointernational.org/sites/default/files/styles/600x400/public/2024-03/Rwanda%20Health%20Make%20Way%20youth%20volunteers.jpg?h=40323ee2&itok=CP8uvx0s', // Volunteer
    'https://rwandadispatch.com/wp-content/uploads/2025/01/Kagame_in_Turkey.jpg', // Fellowships
    'https://www.akageranationalparkrwanda.org/wp-content/uploads/2025/02/Cultural-Festivals-in-Kigali-2025-2.jpeg' // Events
];

export default function GetInvolvedPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    const involvementOptions = [
        {
            title: "Become a Content Creator",
            icon: <Mic className="w-8 h-8 text-white" />,
            description: "Share your expertise and create impactful content with our community.",
            benefits: [
                "Access to creator resources",
                "Monetization opportunities",
                "Professional development",
                "Networking with creators"
            ],
            cta: "Join Creator Network",
            whatsappMessage: "Hello, I'm interested in becoming a Content Creator with irage.rw DHP."
        },
        {
            title: "Become a Vendor",
            icon: <Users className="w-8 h-8 text-white" />,
            description: "Showcase your products or services to our engaged community.",
            benefits: [
                "Increased visibility",
                "Access to analytics",
                "Marketing support",
                "Secure payments"
            ],
            cta: "Apply as Vendor",
            whatsappMessage: "Hello, I'd like to apply as a Vendor with irage.rw DHP."
        },
        {
            title: "Teach With Us",
            icon: <BookOpen className="w-8 h-8 text-white" />,
            description: "Join our network of educators and share your knowledge.",
            benefits: [
                "Curriculum support",
                "Flexible schedules",
                "Competitive compensation",
                "Growth opportunities"
            ],
            cta: "Teach With Us",
            whatsappMessage: "Hello, I'm interested in teaching opportunities with irage.rw DHP."
        },
        {
            title: "Volunteer",
            icon: <HandHeart className="w-8 h-8 text-white" />,
            description: "Make a difference by contributing your time and skills.",
            benefits: [
                "Skill development",
                "Community recognition",
                "Networking",
                "Certification"
            ],
            cta: "Volunteer Now",
            whatsappMessage: "Hello, I'd like to volunteer with irage.rw DHP."
        },
        {
            title: "Fellowships",
            icon: <GraduationCap className="w-8 h-8 text-white" />,
            description: "Apply for competitive programs in digital health and tech.",
            benefits: [
                "Stipend available",
                "Industry mentorship",
                "Project funding",
                "Career support"
            ],
            cta: "View Fellowships",
            whatsappMessage: "Hello, I'm interested in fellowship programs at irage.rw DHP."
        },
        {
            title: "Events",
            icon: <CalendarDays className="w-8 h-8 text-white" />,
            description: "Participate in or host events with our community.",
            benefits: [
                "Early registration",
                "Speaker opportunities",
                "Community building",
                "Skill workshops"
            ],
            cta: "Browse Events",
            whatsappMessage: "Hello, I'd like information about upcoming events at irage.rw DHP."
        }
    ];

    const openModal = (index: number) => {
        setSelectedOption(index);
        setShowModal(true);
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        setShowModal(false);
        document.body.style.overflow = 'auto';
    };

    const getWhatsAppLink = (message: string) => {
        const encodedMessage = encodeURIComponent(message);
        return `https://wa.me/0788282962?text=${encodedMessage}`;
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center">
                    <Loader2 className="h-12 w-12 text-primary animate-spin" />
                    <div className="mt-4 text-primary font-medium">Loading Opportunities...</div>
                </div>
            </div>
        );
    }

    return (<>
        <DigitalHeritagePlatform />
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6">
            <div className="max-w-full md:max-w-11/12 mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Get Involved with <span className="text-primary">irage.rw DHP</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Join our community of innovators shaping Rwanda's digital health future.
                    </p>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {involvementOptions.map((option, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl transition-all duration-300 hover:shadow-lg"
                        >
                            {/* Card Image */}
                            <div className="h-48 overflow-hidden">
                                <img
                                    src={cardImages[index]}
                                    alt={option.title}
                                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                />
                            </div>

                            {/* Card Content */}
                            <div className="p-6">
                                <div className="flex items-center mb-4">
                                    <div className="bg-primary p-2 rounded-lg mr-4">
                                        {option.icon}
                                    </div>
                                    <h2 className="text-xl font-semibold text-gray-900">{option.title}</h2>
                                </div>

                                <p className="text-gray-600 mb-4">{option.description}</p>

                                <div className="mb-6 space-y-2">
                                    {option.benefits.slice(0, 3).map((benefit, i) => (
                                        <div key={i} className="flex items-start">
                                            <Check className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                                            <span className="text-gray-600">{benefit}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex space-x-3">
                                    <button
                                        onClick={() => openModal(index)}
                                        className="flex-1 text-center px-4 py-2.5 text-sm font-medium rounded-lg text-primary hover:bg-primary/10 transition-colors"
                                    >
                                        Learn More
                                    </button>
                                    <a
                                        href={getWhatsAppLink(option.whatsappMessage)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 text-center px-4 py-2.5 text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary-dark transition-colors flex items-center justify-center"
                                    >
                                        <MessageCircle className="h-4 w-4 mr-2" />
                                        {option.cta}
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA Section */}
                <div className="mt-16 bg-primary rounded-xl overflow-hidden">
                    <div className="p-8 text-center">
                        <h2 className="text-2xl font-bold text-white mb-4">Need Guidance?</h2>
                        <p className="text-white/90 mb-6 max-w-2xl mx-auto">
                            Our team will help you find the perfect opportunity based on your skills and interests.
                        </p>
                        <a
                            href={getWhatsAppLink("Hello, I'd like more information about getting involved with irage.rw DHP.")}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-primary bg-white hover:bg-gray-50 transition-colors"
                        >
                            Contact via WhatsApp
                            <ArrowRight className="ml-2 -mr-1 w-5 h-5" />
                        </a>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showModal && selectedOption !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="bg-primary p-6 flex justify-between items-center sticky top-0 z-10">
                            <div className="flex items-center">
                                <div className="bg-white/10 p-2 rounded-lg mr-4 backdrop-blur-sm">
                                    {involvementOptions[selectedOption].icon}
                                </div>
                                <h3 className="text-xl font-bold text-white">
                                    {involvementOptions[selectedOption].title}
                                </h3>
                            </div>
                            <button
                                onClick={closeModal}
                                className="text-white hover:text-gray-200"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6">
                            <div className="mb-6">
                                <div className="min-h-72">
                                    <img
                                        src={cardImages[selectedOption]}
                                        alt={involvementOptions[selectedOption].title}
                                        className="w-full object-cover rounded-lg mb-6"
                                    />
                                </div>
                                <p className="text-gray-600 mb-6">
                                    {involvementOptions[selectedOption].description}
                                </p>

                                <h4 className="font-medium text-gray-900 mb-3">Benefits:</h4>
                                <ul className="mb-6 space-y-2">
                                    {involvementOptions[selectedOption].benefits.map((benefit, i) => (
                                        <li key={i} className="flex items-start">
                                            <Check className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                                            <span className="text-gray-600">{benefit}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <a
                                href={getWhatsAppLink(involvementOptions[selectedOption].whatsappMessage)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full block text-center px-4 py-3 text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary-dark transition-colors flex items-center justify-center"
                            >
                                <MessageCircle className="h-4 w-4 mr-2" />
                                {involvementOptions[selectedOption].cta}
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
        <Footer />
    </>
    );
}