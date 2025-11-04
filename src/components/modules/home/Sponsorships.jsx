"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import aw from "../../../../public/images/aw.png";
import pizza_corner from "../../../../public/images/pizza_corner.png";
import techzone from "../../../../public/images/techzone.jpg";
import urban_cage from "../../../../public/images/urban_cage.jpg";

const sponsors = [
    { id: 1, name: "Pizza Corner", logo: pizza_corner },
    { id: 2, name: "Urban Cafe", logo: urban_cage },
    { id: 3, name: "FreshMart", logo: aw },
    { id: 4, name: "TechZone", logo: techzone },
    { id: 5, name: "Pizza Corner", logo: pizza_corner },
    { id: 6, name: "Urban Cafe", logo: urban_cage },
    { id: 7, name: "FreshMart", logo: aw },
    { id: 8, name: "TechZone", logo: techzone },
    { id: 9, name: "Pizza Corner", logo: pizza_corner },
    { id: 10, name: "Urban Cafe", logo: urban_cage },
    { id: 11, name: "FreshMart", logo: aw },
    { id: 12, name: "TechZone", logo: techzone },
];

export default function Sponsorships() {
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
