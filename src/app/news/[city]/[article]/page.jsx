"use client";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

export default function NewsDetailsPage() {
    const { city, slug } = useParams();
    const router = useRouter();

    const newsList = [
        {
            id: "arena-center",
            title: "Arena Center Grand Opening 🎉",
            city: "New Orleans",
            date: "Oct 25, 2025",
            image:
                "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=900&q=60",
            content:
                "The Arena Center officially opened with a grand concert featuring several major artists. The event drew thousands of people celebrating the opening of this new venue. The facility includes state-of-the-art lighting, acoustics, and seating arrangements for up to 8,000 attendees.",
        },
        {
            id: "biloxi-beach-hall",
            title: "Biloxi Beach Festival Announced 🌴",
            city: "Biloxi",
            date: "Oct 20, 2025",
            image:
                "https://images.unsplash.com/photo-1503428593586-e225b39bddfe?auto=format&fit=crop&w=900&q=60",
            content:
                "Biloxi’s biggest annual event, the Beach Festival, returns this October with live bands, food stalls, and family-friendly activities. Expect an incredible lineup of performers and beautiful sunset beach vibes.",
        },
    ];

    const news = newsList.find(
        (n) =>
            n.id === slug &&
            n.city.toLowerCase() === city.toLowerCase()
    );

    if (!news) {
        return (
            <div className="brandBg text-white min-h-screen flex flex-col justify-center items-center">
                <h1 className="text-3xl font-bold mb-3">News Not Found 😢</h1>
                <button
                    onClick={() => router.back()}
                    className="px-6 py-2 bg-yellow-400 text-black rounded-md font-medium hover:bg-yellow-500 transition"
                >
                    ← Go Back
                </button>
            </div>
        );
    }

    return (
        <section className="brandBg min-h-screen py-16 px-6 mt-12">
            <div className="max-w-5xl mx-auto bg-white text-black rounded-2xl shadow-2xl overflow-hidden">
                {/* Banner */}
                <div className="relative w-full h-80 bg-gray-300">
                    <Image
                        src={news.image}
                        alt={news.title}
                        fill
                        className="object-cover"
                    />
                </div>

                {/* Content */}
                <div className="p-8 md:p-10 space-y-4">
                    <h1 className="text-3xl font-bold brandColor">{news.title}</h1>
                    <p className="text-gray-500 text-sm">
                        {news.city} • {news.date}
                    </p>

                    <p className="text-gray-800 leading-relaxed mt-4">{news.content}</p>

                    {/* Back Button */}
                    <div className="pt-8">
                        <button
                            onClick={() => router.back()}
                            className="px-6 py-2 bg-yellow-400 text-black rounded-md font-semibold hover:bg-yellow-500 transition"
                        >
                            ← Back to {city} News
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
