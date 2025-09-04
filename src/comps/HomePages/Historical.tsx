import { ShieldAlert, Sword, Landmark, ChevronRight } from 'lucide-react';

export default function HistoricalEventsGrid() {
    const events = [
        {
            title: "Ndungutse rebellion",
            description: "Fueled by years of oppression, erupted in response to the unjust seizure of ancestral lands. The conflict escalated into violent clashes, inspiring movements for justice and equality.",
            icon: <ShieldAlert className="w-6 h-6 text-white" />,
            category: "rebellion",
            image: "logos/ndug.png",
            offer: "Featured",
            offerColor: "bg-gradient-to-r from-red-500 to-orange-500"
        },
        {
            title: "Conquering of Rwanda",
            description: "During Ndahiro I Cyamatare's reign, Rwanda faced a threat from Nsibura the ruler of Bunyabungo. The throne Rwoga was taken from Rwanda marking its defeat.",
            icon: <Sword className="w-6 h-6 text-white" />,
            category: "conflict",
            image: "logos/conc.png",
            offer: "Popular",
            offerColor: "bg-gradient-to-r from-purple-500 to-indigo-500"
        },
        {
            title: "Rucunshu coup",
            description: "Rutailindwa was overthrown during the Rucunshu coup, organized by Queen Mother Kanjogera, from the Ega clan. Her son Yuhi Musinga, who was still a child, rose to power",
            icon: <Landmark className="w-6 h-6 text-white" />,
            category: "politics",
            image: "logos/last.png",
            offer: "New",
            offerColor: "bg-gradient-to-r from-emerald-500 to-teal-500"
        }
    ];

    return (
        <section className="py-16 bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(120,119,198,0.1),transparent_50%)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,119,198,0.08),transparent_50%)]"></div>

            <div className="w-11/12 mx-auto px-4 relative">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <div className="flex justify-between items-center gap-3 mb-6 p-2 rounded-2xl border border-white/20 w-full">

                        <h2 className="text-4xl max-md:text-xl font-bold bg-gradient-to-r bg-clip-text text-black">
                            Historical Events
                        </h2>
                        <button onClick={() => { localStorage.setItem("showThing", "false"); localStorage.setItem("viewDig", "Archives"); window.location.href = "/resources"; }}  className="inline-flex items-center px-4 py-2 rounded-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-0.5 ml-4">
                            Explore More
                            <ChevronRight className="ml-2 w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Events Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {events.map((event, index) => (
                        <div
                            key={index}
                            className="group bg-white/80 backdrop-blur-sm rounded-xs  overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-white/20"
                        >
                            {/* Image Container */}
                            <div className="relative overflow-hidden">
                                <img
                                    src={event.image}
                                    alt={event.title}
                                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                {/* Gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                                {/* Offer Banner */}
                                <div className={`absolute top-4 left-4 ${event.offerColor} text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg transform rotate-1 hover:rotate-0 transition-transform duration-300`}>
                                    {event.offer}
                                </div>

                                {/* Icon overlay */}
                                <div className="absolute bottom-4 left-4 p-3 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30">
                                    {event.icon}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xl font-bold text-gray-900 transition-colors duration-300">
                                        {event.title}
                                    </h3>
                                </div>
                                <p className="text-gray-600 leading-relaxed mb-4 line-clamp-3">
                                    {event.description}
                                </p>

                                {/* Category and Action */}
                                <div className="flex items-center justify-between">
                                    <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-primary border border-blue-200">
                                        {event.category}
                                    </span>
                                    <button className="flex items-center text-sm font-medium text-primary hover:text-primary transition-colors group">
                                        Learn more
                                        <ChevronRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}