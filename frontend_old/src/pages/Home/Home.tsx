import { useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
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
  const [currentSlide, setSlide] = useState(0);
  const [slideDirection, setSlideDirection] = useState(1);

  const setCurrentSlide = useCallback((update: number | ((prev: number) => number)) => {
    setSlide((prev: number) => {
      const next = typeof update === "function" ? update(prev) : update;
      if (next === prev) return prev;
      const forward = next > prev || (prev === slides.length - 1 && next === 0);
      setSlideDirection(forward ? 1 : -1);
      return next;
    });
  }, [slides.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [slides.length, setCurrentSlide]);

  const onPromo = () => window.dispatchEvent(new CustomEvent("openPromoModal"));

  return (
    <div id="page-home" className="min-h-screen [overflow-anchor:none]">
      <HomeHeroCarouselSection
        currentSlide={currentSlide}
        slideDirection={slideDirection}
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
