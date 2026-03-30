import type { NavigateFunction } from "react-router-dom";

export type HomeHeroCarouselSectionProps = {
  currentSlide: number;
  slideDirection: number;
  setCurrentSlide: (update: number | ((prevSlide: number) => number)) => void;
  navigate: NavigateFunction;
  onPromo: () => void;
};
