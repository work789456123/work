import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { heroSlides } from "@/assets/content/home";
import HomeHeroCarouselSection from "./components/HomeHeroCarouselSection";
import HomeAboutPillarsSection from "./components/HomeAboutPillarsSection";
import HomeMeetGopuSection from "./components/HomeMeetGopuSection";
import HomeWhyPashuVaaniSection from "./components/HomeWhyPashuVaaniSection";
import HomePhilosophySection from "./components/HomePhilosophySection";
import HomeWhatsappFloatingButton from "./components/HomeWhatsappFloatingButton";

const Home = () => {
  const navigate = useNavigate();
  const slides = heroSlides;
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [slides.length]);

  const onPromo = () => window.dispatchEvent(new CustomEvent("openPromoModal"));

  return (
    <div id="page-home" className="min-h-screen">
      <HomeHeroCarouselSection
        currentSlide={currentSlide}
        setCurrentSlide={setCurrentSlide}
        navigate={navigate}
        onPromo={onPromo}
      />
      <HomeAboutPillarsSection />
      <HomeMeetGopuSection />
      <HomeWhyPashuVaaniSection />
      <HomePhilosophySection />
      <HomeWhatsappFloatingButton />
    </div>
  );
};

export default Home;
