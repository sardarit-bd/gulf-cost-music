"use client";
import { useEffect, useState } from "react";

export default function MerchCard() {
  const [merchItems, setMerchItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const API_BASE = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    const fetchMerch = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/merch`);
        const data = await res.json();
        console.log(data);

        if (res.ok && data.success) {
          setMerchItems(Array.isArray(data.data) ? data.data : []);
        } else {
          console.error("Error loading merch:", data.message);
          setMerchItems([]);
        }
      } catch (error) {
        console.error("Error fetching merch:", error);
        setMerchItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMerch();
  }, [API_BASE]);

  if (loading) {
    return (
      <section className="py-16 px-6 md:px-16 bg-white">
        <div className="container mx-auto text-center text-gray-600">
          Loading merchandise...
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-6 md:px-16 bg-white relative">
      <div className="container mx-auto">
        <h2 className="text-2xl font-semibold text-gray-900 mb-8">Merch</h2>

        {merchItems.length === 0 ? (
          <p className="text-gray-500 text-center">No merchandise found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {merchItems.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden"
              >
                <div className="w-full h-64 flex items-center justify-center bg-white">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="object-contain h-full"
                  />
                </div>

                <div className="bg-[#F9FAFB] p-4">
                  <h3 className="text-base font-medium text-gray-900">
                    {item.name}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">{item.price}</p>
                  <button
                    onClick={() => setShowModal(true)}
                    className="bg-[var(--primary)] w-full text-gray-700 mt-5 px-4 py-2 rounded font-bold hover:bg-[var(--primary)]/90 transition text-lg"
                  >
                    See Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ===== Modal ===== */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          ></div>

          {/* Modal Content */}
          <div className="relative bg-white rounded-2xl shadow-2xl p-8 w-[90%] max-w-md text-center z-10 animate-fadeInScale">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              🚧 Under Construction
            </h2>
            <p className="text-gray-600 mb-6">
              This feature is currently being developed. Please check back soon
              to explore our exclusive Gulf Coast Music merchandise collection.
            </p>
            <button
              onClick={() => setShowModal(false)}
              className="px-6 py-2 bg-[var(--primary)] text-gray-700 rounded-md font-semibold hover:bg-[var(--primary)]/90 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Animation */}
      <style jsx>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeInScale {
          animation: fadeInScale 0.25s ease-out;
        }
      `}</style>
    </section>
  );
}
