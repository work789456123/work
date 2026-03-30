"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { heroSlides } from "@/assets/content/home";
import HomeHeroCarouselSection from "./HomeHeroCarouselSection";

export default function HomeHeroCarouselClient() {
  const router = useRouter();
  const slides = heroSlides;
  const [currentSlide, setSlide] = useState(0);
  const [slideDirection, setSlideDirection] = useState(1);

  const setCurrentSlide = useCallback(
    (update: number | ((prev: number) => number)) => {
      setSlide((prev) => {
        const next = typeof update === "function" ? update(prev) : update;
        if (next === prev) return prev;
        const forward = next > prev || (prev === slides.length - 1 && next === 0);
        setSlideDirection(forward ? 1 : -1);
        return next;
      });
    },
    [slides.length],
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [slides.length, setCurrentSlide]);

  const onPromo = () => window.dispatchEvent(new CustomEvent("openPromoModal"));

  return (
    <HomeHeroCarouselSection
      currentSlide={currentSlide}
      slideDirection={slideDirection}
      setCurrentSlide={setCurrentSlide}
      navigate={router.push}
      onPromo={onPromo}
    />
  );
}
