import { aboutStory } from "@/assets/content/about";

export default function AboutStorySection() {
  return (
    <section id="about-story" className="py-20 bg-gradient-to-b from-[#1FA7A6] via-[#38C2B4] to-[#78D65C]/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-3xl mb-16">
          <div className="w-16 h-1 bg-gradient-to-r from-[#1F6559] to-[#4DB6AC] mb-6 rounded-full" />
          <h2 className="text-4xl md:text-5xl font-bold text-[#333] leading-tight">{aboutStory.accentTitle}</h2>
          <p className="text-lg text-[#FFFFFF] mt-6 leading-relaxed">{aboutStory.lead}</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          <div className="space-y-6">
            {aboutStory.leftColumn.map((t, i) => (
              <p key={i} className="text-lg text-[#FFFFFF] leading-relaxed">
                {t}
              </p>
            ))}
            <p className="text-xl font-semibold text-[#1F6559] pt-2">{aboutStory.tagline}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {aboutStory.highlightCards.map((card) => (
              <div
                key={card.title}
                className="p-6 bg-teal-50 border border-[#EAEAEA] rounded-2xl shadow-sm hover:shadow-lg transition duration-300"
              >
                <h3 className="text-lg font-semibold text-[#333] mb-2">{card.title}</h3>
                <p className="text-[#6F6F6F] text-sm leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
