"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { hero, heroSlides, slideOverlayActions } from "@/assets/content/home";
import {
  homeEase,
  staggerContainer,
  fadeUp,
  slideInRight,
  useScrollMotion,
  transitionMedium,
} from "@/motion/scrollMotion";
import type { HomeHeroCarouselSectionProps } from "@/types/home";

const heroSlideTransition = { duration: 0.72, ease: homeEase };

export default function HomeHeroCarouselSection({
  currentSlide,
  slideDirection,
  setCurrentSlide,
  navigate,
  onPromo,
}: HomeHeroCarouselSectionProps) {
  const slides = heroSlides;
  const go = (i: number) => setCurrentSlide(i);
  const { t, stagger, delayChildren } = useScrollMotion();
  const tr = t(transitionMedium);

  const containerVariants = staggerContainer(stagger, delayChildren);
  const itemFade = fadeUp(tr);
  const mediaVariants = slideInRight(tr);
  const slideTr = t(heroSlideTransition);

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? "-100%" : "100%",
      opacity: 0,
    }),
  };

  return (
    <section id="home-hero" className="relative  py-12 md:py-24 bg-teal-50 flex min-h-[calc(100vh-5.5rem)] items-center" data-testid="hero-section">
      <div className="pointer-events-none absolute inset-0 z-0">
        <Image
          src="/images/contact_bg.png"
          alt=""
          fill
          className="object-cover opacity-30"
          sizes="100vw"
          priority
        />
      </div>
      {/* <div id="home-hero-overlay" className=" absolute inset-0 bg-gradient-to-tr from-white/40 to-[#1F6559]/60 z-10 backdrop-blur-[3px]"></div> */}
      <div id="home-hero-inner" className="max-w-[110rem] mx-auto px-4 md:px-6">
        <div id="home-hero-grid" className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center">
          <motion.div
            id="home-hero-content"
            className="space-y-6 lg:col-span-5 text-center lg:text-left relative z-30"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1
              id="home-hero-title"
              className="heading-font text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-[#333] leading-tight mb-0"
              data-testid="main-heading"
              variants={itemFade}
            >
              {hero.title}
            </motion.h1>
            <motion.p
              id="home-hero-tagline"
              className="text-xl md:text-2xl font-semibold text-[#1F6559]"
              style={{ marginTop: "10px", marginBottom: "18px" }}
              variants={itemFade}
            >
              {hero.tagline}
            </motion.p>
            <motion.p
              id="home-hero-description"
              className="text-base md:text-xl text-[#6F6F6F] leading-relaxed"
              variants={itemFade}
            >
              {hero.descriptionLines.map((line, i) => (
                <span key={i}>
                  {line}
                  {i < hero.descriptionLines.length - 1 && <br />}
                </span>
              ))}
            </motion.p>
            <motion.div variants={itemFade}>
              <Button
                onClick={onPromo}
                data-testid="get-started-btn"
                id="home-hero-cta"
                className="rounded-full bg-[#1F6559] text-white hover:bg-[#184F46] px-6 py-4 md:px-8 md:py-6 text-base md:text-lg mt-6"
              >
                {hero.primaryCta}
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            id="home-hero-media-column"
            className="relative lg:col-span-7 lg:ml-4 flex justify-center lg:justify-end mt-8 lg:mt-0 z-30"
            variants={mediaVariants}
            initial="hidden"
            animate="visible"
          >
            <div
              id="home-hero-carousel-frame"
              className="relative w-full overflow-hidden rounded-[2rem] bg-black/20 shadow-xl group"
            >
              <div
                id="home-hero-image"
                className="relative w-full overflow-hidden rounded-[1.75rem] aspect-video min-h-[200px] sm:min-h-[280px]"
              >
                <AnimatePresence mode="wait" initial={false} custom={slideDirection}>
                  <motion.div
                    id="home-hero-image-img"
                    key={currentSlide}
                    custom={slideDirection}
                    className="absolute inset-0"
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={slideTr}
                  >
                    <Image
                      src={slides[currentSlide].image}
                      alt=""
                      fill
                      className="rounded-[1.75rem] bg-teal-50 object-cover object-center"
                      sizes="(max-width: 1024px) 100vw, 58vw"
                      priority={currentSlide === 0}
                    />
                  </motion.div>
                </AnimatePresence>
                <div
                  id="home-hero-image-prev-button"
                  className="absolute inset-y-0 left-0 flex items-center pl-4 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none group-hover:pointer-events-auto"
                >
                  <button
                    type="button"
                    onClick={() => go(currentSlide === 0 ? slides.length - 1 : currentSlide - 1)}
                    id="home-hero-image-prev-button-icon"
                    className="p-2 rounded-full bg-teal-50/90 hover:bg-teal-50 text-[#1F6559] shadow-lg transition-transform hover:scale-110 pointer-events-auto"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                </div>
                <div
                  id="home-hero-image-next-button"
                  className="absolute inset-y-0 right-0 flex items-center pr-4 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none group-hover:pointer-events-auto"
                >
                  <button
                    type="button"
                    onClick={() => go((currentSlide + 1) % slides.length)}
                    id="home-hero-image-next-button-icon"
                    className="p-2 rounded-full bg-teal-50/90 hover:bg-teal-50 text-[#1F6559] shadow-lg transition-transform hover:scale-110 pointer-events-auto"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
                <AnimatePresence>
                  {currentSlide === 0 && (
                    <motion.div
                      key="overlay-0"
                      id="home-hero-image-overlay-buttons"
                      className="absolute bottom-4 sm:bottom-8 left-0 right-0 px-4 sm:px-8 flex flex-col sm:flex-row justify-center sm:justify-start gap-2 sm:gap-4 z-20"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={t({ duration: 0.35, ease: homeEase })}
                    >
                      <Button
                        onClick={onPromo}
                        id="home-hero-image-overlay-buttons-primary-button"
                        className="rounded-full bg-[#1F6559] text-white hover:bg-[#184F46] px-4 py-2 sm:px-6 sm:py-3 shadow-lg text-sm sm:text-base w-full sm:w-auto"
                      >
                        {slideOverlayActions.slide0.primary}
                      </Button>
                      <Button
                        onClick={() => navigate(slideOverlayActions.slide0.secondaryPath)}
                        id="home-hero-image-overlay-buttons-secondary-button"
                        className="rounded-full bg-teal-50 text-[#1F6559] hover:bg-gray-50 px-4 py-2 sm:px-6 sm:py-3 shadow-lg text-sm sm:text-base w-full sm:w-auto"
                      >
                        {slideOverlayActions.slide0.secondary}
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
                <AnimatePresence>
                  {currentSlide === 2 && (
                    <motion.div
                      key="overlay-2"
                      id="home-hero-overlay-slide2"
                      className="absolute bottom-8 left-0 right-0 px-8 flex justify-center sm:justify-start z-20"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={t({ duration: 0.35, ease: homeEase })}
                    >
                      <Button
                        onClick={onPromo}
                        id="home-hero-overlay-slide2-cta"
                        className="rounded-full bg-[#1F6559] text-white hover:bg-[#184F46] px-6 py-3 shadow-lg"
                      >
                        {slideOverlayActions.slide2.primary}
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
                <AnimatePresence>
                  {currentSlide === 3 && (
                    <motion.div
                      key="overlay-3"
                      id="home-hero-overlay-slide3"
                      className="absolute bottom-8 left-0 right-0 px-8 flex justify-center sm:justify-start z-20"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={t({ duration: 0.35, ease: homeEase })}
                    >
                      <Button
                        onClick={onPromo}
                        id="home-hero-overlay-slide3-cta"
                        className="rounded-full bg-[#1F6559] text-white hover:bg-[#184F46] px-6 py-3 shadow-lg"
                      >
                        {slideOverlayActions.slide3.primary}
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
