"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";
import { FiUsers } from "react-icons/fi";

export default function Sponsorships() {
    const [sponsors, setSponsors] = useState([]);
    const [sectionText, setSectionText] = useState({
        sectionTitle: "Our Sponsors",
        sectionSubtitle: "We're proud to partner with amazing local businesses and community supporters."
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const API_BASE = process.env.NEXT_PUBLIC_BASE_URL;

                // Fetch sponsors and section text concurrently
                const [sponsorsRes, sectionTextRes] = await Promise.all([
                    fetch(`${API_BASE}/api/sponsors`),
                    fetch(`${API_BASE}/api/sponsors/section`) // Updated endpoint
                ]);

                const sponsorsData = await sponsorsRes.json();
                const sectionTextData = await sectionTextRes.json();

                if (sponsorsData.success) {
                    setSponsors(sponsorsData.data || []);
                }

                if (sectionTextData.success) {
                    setSectionText({
                        sectionTitle: sectionTextData.data.sectionTitle || "Our Sponsors",
                        sectionSubtitle: sectionTextData.data.sectionSubtitle || "We're proud to partner with amazing local businesses and community supporters."
                    });
                }
            } catch (err) {
                console.error("Failed to load sponsors data:", err);
                // Fallback if API fails
                setSectionText({
                    sectionTitle: "Our Sponsors",
                    sectionSubtitle: "We're proud to partner with amazing local businesses and community supporters."
                });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    if (loading) {
        return (
            <section className="py-20 bg-gradient-to-b from-white to-gray-50">
                <div className="container mx-auto px-6">
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-6 animate-pulse">
                            <FiUsers className="w-8 h-8 text-white" />
                        </div>
                        <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-64 mx-auto mb-12"></div>
                    </div>
                    <div className="flex justify-center">
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 w-full max-w-6xl">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="h-32 bg-gray-200 rounded-2xl animate-pulse"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (!sponsors.length) return null;

    return (
        <section className="relative py-20 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-blue-100 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-30 blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-100 rounded-full translate-x-1/3 translate-y-1/3 opacity-30 blur-3xl"></div>

            <div className="container relative mx-auto px-4 md:px-6">
                {/* Section Header */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={containerVariants}
                    className="text-center mb-16"
                >
                    <motion.div variants={itemVariants} className="inline-flex flex-col items-center mb-8">

                        <motion.h2
                            variants={itemVariants}
                            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[var(--primary)] to-[var(--accent)]"
                        >
                            {sectionText.sectionTitle}
                        </motion.h2>

                        <motion.p
                            variants={itemVariants}
                            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
                        >
                            {sectionText.sectionSubtitle}
                        </motion.p>
                    </motion.div>
                </motion.div>
            </div>

            {/* Carousel Container with react-fast-marquee */}
            <div className="relative py-8">
                {/* Gradient overlays for smooth edges */}
                <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white via-white to-transparent z-10 pointer-events-none"></div>
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white via-white to-transparent z-10 pointer-events-none"></div>

                {/* First Marquee */}
                <Marquee
                    speed={80}
                    pauseOnHover={true}
                    gradient={false}
                    className="py-8"
                >
                    {sponsors.map((sponsor, index) => (
                        <div key={sponsor._id || index} className="mx-6 group">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl group-hover:from-blue-100 group-hover:to-purple-100 transition-all duration-300 shadow-sm group-hover:shadow-xl"></div>
                                <div className="relative w-[200px] h-[140px] flex items-center justify-center p-8 rounded-3xl border border-gray-100">
                                    <Image
                                        src={sponsor.logo}
                                        alt={sponsor.name}
                                        width={160}
                                        height={120}
                                        className="object-contain max-w-full max-h-full transition-all duration-300 group-hover:scale-110 filter group-hover:brightness-110"
                                        onError={(e) => {
                                            e.currentTarget.src = "/placeholder.svg";
                                        }}
                                    />
                                </div>

                                {/* Sponsor Name Tooltip */}
                                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-20">
                                    <div className="bg-gray-900 text-white text-xs font-medium px-3 py-1.5 rounded-lg whitespace-nowrap shadow-lg">
                                        {sponsor.name}
                                        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-b-2 border-l-transparent border-r-transparent border-b-gray-900"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </Marquee>

                {/* Second Marquee (Reverse direction for more dynamic effect) - Optional */}
                {sponsors.length > 5 && (
                    <Marquee
                        speed={60}
                        direction="right"
                        pauseOnHover={true}
                        gradient={false}
                        className="py-8"
                    >
                        {[...sponsors].reverse().map((sponsor, index) => (
                            <div key={`reverse-${sponsor._id || index}`} className="mx-6 group">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-cyan-50 rounded-3xl group-hover:from-green-100 group-hover:to-cyan-100 transition-all duration-300 shadow-sm group-hover:shadow-xl"></div>
                                    <div className="relative w-[200px] h-[140px] flex items-center justify-center p-8 rounded-3xl border border-gray-100">
                                        <Image
                                            src={sponsor.logo}
                                            alt={sponsor.name}
                                            width={160}
                                            height={120}
                                            className="object-contain max-w-full max-h-full transition-all duration-300 group-hover:scale-110 filter group-hover:brightness-110"
                                            onError={(e) => {
                                                e.currentTarget.src = "/placeholder.svg";
                                            }}
                                        />
                                    </div>

                                    {/* Sponsor Name Tooltip */}
                                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-20">
                                        <div className="bg-gray-900 text-white text-xs font-medium px-3 py-1.5 rounded-lg whitespace-nowrap shadow-lg">
                                            {sponsor.name}
                                            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-b-2 border-l-transparent border-r-transparent border-b-gray-900"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Marquee>
                )}
            </div>
        </section>
    );
}