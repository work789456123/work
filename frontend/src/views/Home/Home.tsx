import HomeHeroCarouselClient from "./components/HomeHeroCarouselClient";
import HomeAboutPillarsSection from "./components/HomeAboutPillarsSection";
import HomeMeetGopuSection from "./components/HomeMeetGopuSection";
import HomeWhyPashuVaaniSection from "./components/HomeWhyPashuVaaniSection";
import HomePhilosophySection from "./components/HomePhilosophySection";
import HomeWhatsappFloatingButton from "./components/HomeWhatsappFloatingButton";
import AboutMissionSection from "../AboutUs/components/AboutMissionSection";

const Home = () => (
  <div id="page-home" className="min-h-screen [overflow-anchor:none]">
    <HomeHeroCarouselClient />
    <HomeAboutPillarsSection />
    <HomeMeetGopuSection />
    <HomeWhyPashuVaaniSection />
    <HomePhilosophySection />
    <AboutMissionSection />
    <HomeWhatsappFloatingButton />
  </div>
);

export default Home;
