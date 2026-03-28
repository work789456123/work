import { aboutHero } from "@/assets/content/about";

export default function AboutHeroSection() {
  return (
    <section
      id="about-hero"
      className="py-16 md:py-24 bg-gradient-to-r from-[#1FA7A6] via-[#38C2B4] to-[#78D65C]"
      data-testid="AboutUs-section"
    >
      <div className="max-w-4xl mx-auto px-6 text-center space-y-4 md:space-y-6">
        <h1 className="heading-font text-3xl md:text-4xl lg:text-5xl font-bold text-white">
          {aboutHero.title}
        </h1>
        <p className="heading-font text-lg md:text-xl lg:text-xl font-bold text-white">{aboutHero.subtitle}</p>
      </div>
    </section>
  );
}
