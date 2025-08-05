import { Truck, CreditCard, MessageCircle, Shield, Phone, Smartphone, Banknote, Lock } from 'lucide-react';

export default function IrageServices() {
    const services = [
        {
            id: 1,
            icon: Truck,
            title: "Fast Shipping",
            subtitle: "Nationwide Delivery",
            description: "Quick and reliable delivery across Rwanda. Track your cultural artifacts and heritage items with real-time updates.",
            features: ["Same-day delivery in Kigali", "2-3 days nationwide", "Free shipping over 50,000 RWF", "Real-time tracking"],
            bgClass: "bg-blue-600",
            lightBgClass: "bg-blue-50",
            iconBgClass: "bg-blue-100",
            textColorClass: "text-blue-600"
        },
        {
            id: 2,
            icon: CreditCard,
            title: "Payment Methods",
            subtitle: "Multiple Options",
            description: "Pay securely using your preferred method. We support all major payment platforms for your convenience.",
            features: ["Credit & Debit Cards", "Mobile Money (MTN/Airtel)", "Bank Transfers", "Cash on Delivery"],
            bgClass: "bg-green-600",
            lightBgClass: "bg-green-50",
            iconBgClass: "bg-green-100",
            textColorClass: "text-green-600"
        },
        {
            id: 3,
            icon: MessageCircle,
            title: "WhatsApp Support",
            subtitle: "24/7 Customer Care",
            description: "Get instant help through WhatsApp. Our cultural heritage experts are ready to assist you anytime.",
            features: ["Instant messaging support", "Cultural consultation", "Order assistance", "Heritage guidance"],
            bgClass: "bg-purple-600",
            lightBgClass: "bg-purple-50",
            iconBgClass: "bg-purple-100",
            textColorClass: "text-purple-600"
        },
        {
            id: 4,
            icon: Shield,
            title: "Secure & Safe",
            subtitle: "Protected Transactions",
            description: "Your data and transactions are protected with bank-level security. Shop with confidence on our platform.",
            features: ["SSL Encryption", "Secure Payment Gateway", "Data Protection", "Fraud Prevention"],
            bgClass: "bg-orange-600",
            lightBgClass: "bg-orange-50",
            iconBgClass: "bg-orange-100",
            textColorClass: "text-orange-600"
        }
    ];

    const paymentIcons = [
        { icon: CreditCard, label: "Cards" , bg: "bg-blue-500"},
        { icon: Smartphone, label: "Mobile Money", bg: "bg-green-500"},
        { icon: Banknote, label: "Cash", bg: "bg-yellow-500"},
        { icon: Phone, label: "USSD", bg: "bg-red-500"}
    ];

    return (
        <div className="w-full bg-white py-16 lg:py-20">
            <div className="max-w-full md:max-w-11/12 mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-12 md:mb-16">
                    <h2 className="text-2xl md:text-4xl font-semibold text-gray-800 mb-3">
                        Discover the <span onClick={() => window.location.href = "/"} className="text-transparent cursor-pointer bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">irage.rw</span> Difference
                    </h2>
                    <p className="text-md text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Experience Rwanda's cultural heritage through our curated marketplace, designed for seamless exploration and connection.
                    </p>
                </div>

                {/* Services Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                    {services.map((service) => {
                        const IconComponent = service.icon;
                        return (
                            <div
                                key={service.id}
                                className="group bg-white rounded-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-transparent hover:-translate-y-2"
                            >
                                {/* Card Header */}
                                <div className={`${service.lightBgClass} p-6 text-center relative overflow-hidden`}>
                                    {/* Background Pattern */}
                                    <div className="absolute inset-0 opacity-10">
                                        <div className="absolute inset-0" style={{
                                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='20' cy='20' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                                        }}></div>
                                    </div>

                                    <div className={`${service.iconBgClass} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                        <IconComponent className={`w-8 h-8 ${service.textColorClass}`} />
                                    </div>

                                    <h3 className="text-xl font-bold text-gray-900 mb-1">{service.title}</h3>
                                    <p className={`text-sm font-medium ${service.textColorClass}`}>{service.subtitle}</p>
                                </div>

                                {/* Card Body */}
                                <div className="p-6">
                                    <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>

                                    <ul className="space-y-3">
                                        {service.features.map((feature, index) => (
                                            <li key={index} className="flex items-center space-x-3">
                                                <div className={`w-2 h-2 rounded-full ${service.bgClass}`}></div>
                                                <span className="text-sm text-gray-700">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Payment Methods Showcase */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-3xl p-8 lg:p-12">
                    <div className="text-center mb-8">
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">Accepted Payment Methods</h3>
                        <p className="text-gray-600">Choose from multiple secure payment options</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                        {paymentIcons.map((payment, index) => {
                            const IconComponent = payment.icon;
                            return (
                                <div key={index} className="bg-white rounded-xl p-6 text-center transition-shadow duration-300">
                                    <div className={`w-12 h-12 ${payment.bg} rounded-lg flex items-center justify-center mx-auto mb-3`}>
                                        <IconComponent className="w-6 h-6 text-white" />
                                    </div>
                                    <p className="text-sm font-medium text-gray-700">{payment.label}</p>
                                </div>
                            );
                        })}
                    </div>

                    {/* Contact Info */}
                    <div className="text-center">
                        <div className="block md:inline-flex items-center space-x-4 bg-white rounded-lg md:rounded-full px-6 py-3">
                            <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                    <MessageCircle className="w-4 h-4 text-white" />
                                </div>
                                <span className="max-sm:text-xs font-semibold text-gray-900">WhatsApp:</span>
                                <span className="max-sm:text-xs text-green-600 font-medium">+250 788 123 456</span>
                            </div>
                            <div className="w-px h-6 bg-gray-300"></div>
                            <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                    <Lock className="w-4 h-4 text-white" />
                                </div>
                                <span className="max-sm:text-xs text-blue-600 font-medium">SSL Secured</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Trust Indicators */}
                <div className="mt-12 text-center">
                    <div className="inline-flex items-center space-x-6 text-sm text-gray-500">
                        <div className="flex items-center space-x-2">
                            <Shield className="w-4 h-4 text-green-500" />
                            <span>256-bit SSL Encryption</span>
                        </div>
                        <div className="w-px h-4 bg-gray-300"></div>
                        <div className="flex items-center space-x-2">
                            <Lock className="w-4 h-4 text-blue-500" />
                            <span>PCI DSS Compliant</span>
                        </div>
                        <div className="w-px h-4 bg-gray-300"></div>
                        <div className="flex items-center space-x-2">
                            <Truck className="w-4 h-4 text-purple-500" />
                            <span>Nationwide Delivery</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}