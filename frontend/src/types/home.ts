export type HomeHeroCarouselSectionProps = {
  currentSlide: number;
  slideDirection: number;
  setCurrentSlide: (update: number | ((prevSlide: number) => number)) => void;
  navigate: (href: string) => void;
  onPromo: () => void;
};
