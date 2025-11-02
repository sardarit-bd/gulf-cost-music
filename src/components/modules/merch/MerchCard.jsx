"use client";
import { useState, useEffect } from "react";

export default function MerchCard() {
  const [merchItems, setMerchItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_BASE = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    const fetchMerch = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/merch`);
        const data = await res.json();
        console.log(data)

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
    <section className="py-16 px-6 md:px-16 bg-white">
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
                <div className="w-full h-64 flex items-center justify-center bg-gray-50">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="object-contain h-full"
                  />
                </div>

                <div className="bg-[#F9FAFB] p-4 border-t">
                  <h3 className="text-base font-medium text-gray-900">
                    {item.name}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">{item.price}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
