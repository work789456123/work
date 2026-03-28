import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { hero, heroSlides, slideOverlayActions } from "@/assets/content/home";

export default function HomeHeroCarouselSection({
  currentSlide,
  setCurrentSlide,
  navigate,
  onPromo,
}) {
  const slides = heroSlides;
  const go = (i) => setCurrentSlide(i);

  return (
    <section id="home-hero" className="relative bg-teal-50 py-12 md:py-24" data-testid="hero-section">
      <div className="max-w-[110rem] mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center">
          <div className="space-y-0 lg:col-span-5 text-center lg:text-left">
            <h1
              className="heading-font text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-[#333] leading-tight mb-0"
              data-testid="main-heading"
            >
              {hero.title}
            </h1>
            <p
              className="text-xl md:text-2xl font-semibold text-[#1F6559]"
              style={{ marginTop: "10px", marginBottom: "18px" }}
            >
              {hero.tagline}
            </p>
            <p className="text-base md:text-xl text-[#6F6F6F] leading-relaxed">
              {hero.descriptionLines.map((line, i) => (
                <span key={i}>
                  {line}
                  {i < hero.descriptionLines.length - 1 && <br />}
                </span>
              ))}
            </p>
            <Button
              onClick={onPromo}
              data-testid="get-started-btn"
              className="rounded-full bg-[#1F6559] text-white hover:bg-[#184F46] px-6 py-4 md:px-8 md:py-6 text-base md:text-lg mt-6"
            >
              {hero.primaryCta}
            </Button>
          </div>
          <div className="relative lg:col-span-7 lg:ml-4 flex justify-center lg:justify-end mt-8 lg:mt-0">
            <div className="bg-gradient-to-br from-[#1F6559]/10 to-transparent rounded-[2rem] flex items-center justify-center p-2 sm:p-4 group w-full">
              <div className="relative w-full overflow-hidden rounded-[1.5rem] shadow-xl">
                <img
                  src={slides[currentSlide].image}
                  alt=""
                  className="w-full h-auto max-h-[400px] sm:max-h-[500px] lg:max-h-[700px] object-contain transition-all duration-700 bg-teal-50"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <button
                    type="button"
                    onClick={() => go(currentSlide === 0 ? slides.length - 1 : currentSlide - 1)}
                    className="p-2 rounded-full bg-teal-50/90 hover:bg-teal-50 text-[#1F6559] shadow-lg transition-transform hover:scale-110"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <button
                    type="button"
                    onClick={() => go((currentSlide + 1) % slides.length)}
                    className="p-2 rounded-full bg-teal-50/90 hover:bg-teal-50 text-[#1F6559] shadow-lg transition-transform hover:scale-110"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
                {currentSlide === 0 && (
                  <div className="absolute bottom-4 sm:bottom-8 left-0 right-0 px-4 sm:px-8 flex flex-col sm:flex-row justify-center sm:justify-start gap-2 sm:gap-4 z-20">
                    <Button
                      onClick={onPromo}
                      className="rounded-full bg-[#1F6559] text-white hover:bg-[#184F46] px-4 py-2 sm:px-6 sm:py-3 shadow-lg text-sm sm:text-base w-full sm:w-auto"
                    >
                      {slideOverlayActions.slide0.primary}
                    </Button>
                    <Button
                      onClick={() => navigate(slideOverlayActions.slide0.secondaryPath)}
                      className="rounded-full bg-teal-50 text-[#1F6559] hover:bg-gray-50 px-4 py-2 sm:px-6 sm:py-3 shadow-lg text-sm sm:text-base w-full sm:w-auto"
                    >
                      {slideOverlayActions.slide0.secondary}
                    </Button>
                  </div>
                )}
                {currentSlide === 2 && (
                  <div className="absolute bottom-8 left-0 right-0 px-8 flex justify-center sm:justify-start z-20">
                    <Button
                      onClick={onPromo}
                      className="rounded-full bg-[#1F6559] text-white hover:bg-[#184F46] px-6 py-3 shadow-lg"
                    >
                      {slideOverlayActions.slide2.primary}
                    </Button>
                  </div>
                )}
                {currentSlide === 3 && (
                  <div className="absolute bottom-8 left-0 right-0 px-8 flex justify-center sm:justify-start z-20">
                    <Button
                      onClick={onPromo}
                      className="rounded-full bg-[#1F6559] text-white hover:bg-[#184F46] px-6 py-3 shadow-lg"
                    >
                      {slideOverlayActions.slide3.primary}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
