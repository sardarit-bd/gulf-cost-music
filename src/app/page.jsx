import FeaturedSection from "@/components/modules/Featured/Featured";
import HeroSection from "@/components/modules/home/HeroSection";
import React from "react";
import CalendarBoard from "./calender/page";
import MerchSection from "./merch/page";
import CastsSection from "./Casts/page";
import ArtistGallery from "./gallery/page";
import WavesSection from "./waves/page";
import ContactSection from "./contact/page";
import Footer from "./footer/page";

const HomePage = () => {
  return (
    <main>
   
      <HeroSection />
      <div className="bg-[#F9FAFB]">
        <FeaturedSection />
        <CalendarBoard />
        <MerchSection />
        <CastsSection />
        <ArtistGallery />
        <WavesSection/>
        <ContactSection/>
        <Footer/>
      </div>
    </main>
  );
};

export default HomePage;
