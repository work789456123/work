import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";
import {
  ourStoryHero,
  foundersSectionTitle,
  founders,
  ourStoryQuestion,
  ourStoryJourney,
} from "@/assets/content/our_story";
import UserPageShell from "@/motion/UserPageShell";

const OurStory = () => {
  const [zoomedImage, setZoomedImage] = useState(null);
  const q = ourStoryQuestion;

  return (
    <UserPageShell id="page-our-story" className="min-h-screen bg-teal-50">
      <section id="our-story-hero" className="py-16 md:py-20 bg-gradient-to-b from-[#1FA7A6] via-[#38C2B4] to-[#78D65C]/10">
        <div className="max-w-2xl mx-auto px-4 text-center space-y-4">
          <h1 className="heading-font text-3xl md:text-4xl lg:text-5xl font-bold text-white">
            {ourStoryHero.title}
          </h1>
          <p className="heading-font text-xl lg:text-xl font-bold text-white">{ourStoryHero.subtitle}</p>
        </div>
      </section>

      <section id="our-story-founders" className="py-20 bg-[#FAFAFA]">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="heading-font text-3xl md:text-4xl font-bold text-[#333] text-center mb-10 md:mb-16">
            {foundersSectionTitle}
          </h2>
          <div className="space-y-24 md:space-y-40">
            {founders.map((founder, idx) => (
              <div key={founder.name} className="flex flex-col">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                  <div className={`${idx % 2 === 0 ? "lg:order-1" : "lg:order-2"}`}>
                    <div
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") setZoomedImage(founder.image);
                      }}
                      className="relative group cursor-zoom-in overflow-hidden rounded-[2.5rem] shadow-xl hover:shadow-2xl transition-all duration-300 aspect-[4/5] w-full mx-auto"
                      onClick={() => setZoomedImage(founder.image)}
                    >
                      <img
                        src={founder.image}
                        alt={founder.name}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </div>
                  <div className={`space-y-6 ${idx % 2 === 0 ? "lg:order-2" : "lg:order-1"}`}>
                    <div className="space-y-2 text-center lg:text-left">
                      <h3 className="heading-font text-2xl md:text-3xl font-bold text-[#333]">{founder.name}</h3>
                      <p className="text-base md:text-lg font-semibold text-[#1F6559]">{founder.role}</p>
                    </div>
                    <div className="space-y-4">
                      {founder.story.map((paragraph, pIdx) => (
                        <p key={pIdx} className="text-lg text-[#6F6F6F] leading-relaxed">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
                {idx === 0 && (
                  <div className="mt-16 md:mt-32 mb-8 md:mb-16 py-10 md:py-16 bg-gradient-to-b from-[#1FA7A6]/10 via-[#38C2B4]/10 to-[#78D65C]/10 rounded-[2rem]">
                    <div className="max-w-5xl mx-auto px-6 space-y-6 md:space-y-8">
                      <h2 className="heading-font text-2xl md:text-4xl font-bold text-[#333] text-center mb-6 md:mb-8">
                        {q.title}
                      </h2>
                      <div className="space-y-6 text-center">
                        <p className="text-lg text-[#6F6F6F] leading-relaxed">{q.lead}</p>
                        <p className="text-lg text-[#6F6F6F] leading-relaxed">
                          {q.villageStory.before}
                          <span className="font-semibold text-[#1F6559]">{q.villageStory.emphasis}</span>
                          {q.villageStory.after}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="our-story-journey" className="py-20 bg-gradient-to-b from-[#1FA7A6]/10 via-[#38C2B4]/10 to-[#78D65C]/10">
        <div className="max-w-5xl mx-auto px-6 space-y-8 text-center">
          <h2 className="heading-font text-4xl font-bold text-[#333]">{ourStoryJourney.title}</h2>
          <div className="space-y-6">
            {ourStoryJourney.paragraphs.map((t, i) => (
              <p key={i} className="text-lg text-[#6F6F6F] leading-relaxed">
                {t}
              </p>
            ))}
            <p className="text-xl text-[#1F6559] font-semibold leading-relaxed">{ourStoryJourney.closing}</p>
          </div>
        </div>
      </section>

      <Dialog open={!!zoomedImage} onOpenChange={() => setZoomedImage(null)}>
        <DialogContent
          id="our-story-image-dialog"
          className="max-w-[95vw] md:max-w-4xl p-0 bg-transparent border-0 outline-none shadow-none"
        >
          <div className="relative">
            <button
              type="button"
              onClick={() => setZoomedImage(null)}
              className="absolute -top-12 md:-top-10 right-0 bg-teal-50/90 hover:bg-teal-50 text-gray-900 rounded-full p-2 z-50"
            >
              <X className="w-6 h-6" />
            </button>
            <img src={zoomedImage} alt="Zoomed view" className="w-full h-auto rounded-lg shadow-2xl" />
          </div>
        </DialogContent>
      </Dialog>
    </UserPageShell>
  );
};

export default OurStory;
