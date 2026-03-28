import { aboutWhy } from "@/assets/content/about";

export default function AboutWhySection() {
  return (
    <section id="about-why" className="py-20 bg-gradient-to-b from-[#1FA7A6]/80 via-[#38C2B4]/80 to-[#78D65C]/10">
      <div className="max-w-5xl mx-auto px-6 space-y-8">
        <h2 className="heading-font text-4xl font-bold text-[#333] text-center">{aboutWhy.title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {aboutWhy.bullets.map((item) => (
            <div
              key={item}
              className="flex items-center space-x-3 p-4 bg-teal-50 rounded-xl border border-[#EAEAEA]"
            >
              <div className="w-6 h-6 text-[#1F6559] font-bold text-xl flex-shrink-0">✓</div>
              <p className="text-lg text-[#6F6F6F]">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
