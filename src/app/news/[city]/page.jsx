"use client";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function CityNewsPage() {
  const { city } = useParams();
  const router = useRouter();

  const allNews = [
    {
      id: "arena-center",
      title: "Arena Center Grand Opening 🎉",
      city: "New Orleans",
      date: "Oct 25, 2025",
      image:
        "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=900&q=60",
      desc: "The brand new Arena Center is now open with a spectacular concert event. Thousands joined the grand opening celebration.",
    },
    {
      id: "biloxi-beach-hall",
      title: "Biloxi Beach Festival Announced 🌴",
      city: "Biloxi",
      date: "Oct 20, 2025",
      image:
        "https://images.unsplash.com/photo-1503428593586-e225b39bddfe?auto=format&fit=crop&w=900&q=60",
      desc: "The annual Biloxi Beach Festival is set to return with a week-long celebration of music, art, and food.",
    },
    {
      id: "mobile-event-hub",
      title: "Mobile Hub Hosts Live Concert 🎤",
      city: "Mobile",
      date: "Oct 18, 2025",
      image:
        "https://images.unsplash.com/photo-1541976076758-25a71c4200d1?auto=format&fit=crop&w=900&q=60",
      desc: "The Mobile Event Hub brings together top artists for a stunning night of performances and live entertainment.",
    },
    {
      id: "pensacola-arena",
      title: "Pensacola Arena Renovation Complete 🏗️",
      city: "Pensacola",
      date: "Oct 15, 2025",
      image:
        "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=900&q=60",
      desc: "After months of renovation, the Pensacola Arena is ready to host large-scale events with upgraded facilities.",
    },
  ];

  const filteredNews = allNews.filter(
    (n) => n.city.toLowerCase() === city.toLowerCase()
  );

  if (filteredNews.length === 0) {
    return (
      <div className="brandBg text-white min-h-screen flex flex-col justify-center items-center">
        <h1 className="text-3xl font-bold mb-3">
          No news found for {city} 😢
        </h1>
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
    <section className="brandBg min-h-screen py-14 mt-16 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold brandColor">
            {city} News
          </h1>
          <button
            onClick={() => router.push("/news")}
            className="px-4 py-2 bg-white text-gray-700 rounded-md border hover:bg-yellow-100 transition"
          >
            ← Back
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredNews.map((item) => (
            <div
              key={item.id}
              className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1 bg-white"
            >
              <div className="relative w-full h-56">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-5 text-left">
                <h2 className="text-lg font-bold brandColor mb-1">
                  {item.title}
                </h2>
                <p className="text-sm text-gray-600 mb-2">{item.city}</p>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700">
                    🗓 {item.date}
                  </span>
                  <Link
                    href={`/news/${item.city}/${item.id}`}
                    className="px-4 py-1 bg-yellow-400 text-sm font-semibold rounded-full hover:bg-yellow-500 transition"
                  >
                    View
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
