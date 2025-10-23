"use client";
import React from "react";

export default function MerchSection() {
  const merchItems = [
    {
      id: 1,
      name: "Podcast Logo T-Shirt",
      price: "$25",
      image: "/images/merch.webp",
    },
    {
      id: 2,
      name: "Podcast Mug",
      price: "$15",
      image: "/images/merch.webp",
    },
    {
      id: 3,
      name: "Podcast Cap",
      price: "$20",
      image: "/images/merch.webp",
    },
    {
      id: 4,
      name: "Podcast Hoodie",
      price: "$40",
      image: "/images/merch.webp",
    },
  ];

  return (
    <section className="py-16 px-6 md:px-16 bg-white">
      <div className="container mx-auto">
        <h2 className="text-2xl font-semibold text-gray-900 mb-8">Merch</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {merchItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden"
          >
            <div className="w-full h-64 flex items-center justify-center ">
              <img
                src={item.image}
                alt={item.name}
                className="object-contain h-full"
              />
            </div>

            <div className=" bg-[#F9FAFB] p-4 border-t">
              <h3 className="text-base font-medium text-gray-900">
                {item.name}
              </h3>
              <p className="text-gray-600 text-sm mt-1">{item.price}</p>
            </div>
          </div>
        ))}
      </div>
      </div>
    </section>
  );
}
