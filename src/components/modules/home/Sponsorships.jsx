"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Sponsorships() {
    const [sponsors, setSponsors] = useState([]);

    useEffect(() => {
        const fetchSponsors = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/sponsors`);
                const data = await res.json();

                if (data.success) {
                    setSponsors(data.data);
                }
            } catch (err) {
                console.error("Failed to load sponsors:", err);
            }
        };

        fetchSponsors();
    }, []);

    return (
        <section className="py-20 bg-white text-center">
            {/* Heading */}
            <div className="container mx-auto px-6">
                <h2 className="text-4xl font-bold text-black mb-2">Our Sponsors</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    We’re proud to partner with amazing local businesses and community supporters.
                </p>
            </div>

            {/* Carousel */}
            <div className="overflow-hidden mt-12">
                <motion.div
                    className="flex items-center gap-20"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{
                        repeat: Infinity,
                        duration: 25,
                        ease: "linear",
                    }}
                >
                    {[...sponsors, ...sponsors].map((sponsor, index) => (
                        <div
                            key={index}
                            className="flex-shrink-0 w-fit h-fit flex items-center justify-center bg-gray-50 rounded-2xl shadow-sm hover:shadow-md transition"
                        >
                            <Image
                                src={sponsor.logo}
                                alt={sponsor.name}
                                width={140}
                                height={100}
                                className="object-cover"
                            />
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
