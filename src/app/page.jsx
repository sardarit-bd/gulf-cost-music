import FeaturedSection from "@/components/modules/Featured/Featured";
import HeroSection from "@/components/modules/home/HeroSection";
import Sponsorships from "@/components/modules/home/Sponsorships";
import CalendarBoard from "./calender/page";
import CastsSection from "./casts/page";
import ContactSection from "./contact/page";
import Footer from "./footer/page";
import ArtistGallery from "./gallery/page";
import MerchSection from "./merch/page";
import WavesSection from "./waves/page";

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
        <WavesSection />
        <Sponsorships />
        <ContactSection />
        <Footer />
      </div>
    </main>
  );
};

export default HomePage;
