"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Sponsorships() {
    const [sponsors, setSponsors] = useState([]);
    const [loopedSponsors, setLoopedSponsors] = useState([]);

    useEffect(() => {
        const fetchSponsors = async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/api/sponsors`
                );
                const data = await res.json();

                if (data.success && data.data.length) {
                    setSponsors(data.data);
                }
            } catch (err) {
                console.error("Failed to load sponsors:", err);
            }
        };

        fetchSponsors();
    }, []);

    // 🔁 Auto repeat until it fills screen
    useEffect(() => {
        if (!sponsors.length) return;

        const MIN_ITEMS = 12; // safe number for all screens
        let filled = [...sponsors];

        while (filled.length < MIN_ITEMS) {
            filled = [...filled, ...sponsors];
        }

        setLoopedSponsors(filled);
    }, [sponsors]);

    if (!loopedSponsors.length) return null;

    return (
        <section className="py-20 bg-white overflow-hidden">
            {/* Heading */}
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-4xl font-bold text-black mb-2">
                    Our Sponsors
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    We’re proud to partner with amazing local businesses and community supporters.
                </p>
            </div>

            {/* Carousel */}
            <div className="relative mt-12 overflow-hidden">
                <motion.div
                    className="flex items-center gap-20 w-max p-3"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{
                        repeat: Infinity,
                        duration: 50,
                        ease: "linear",
                    }}
                >
                    {[...loopedSponsors, ...loopedSponsors].map((sponsor, index) => (
                        <div
                            key={index}
                            className="flex-shrink-0 w-[180px] h-[120px]
                         flex items-center justify-center
                         bg-gray-50 rounded-2xl shadow-sm"
                        >
                            <Image
                                src={sponsor.logo}
                                alt={sponsor.name}
                                width={140}
                                height={100}
                                className="object-contain "
                            />
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
