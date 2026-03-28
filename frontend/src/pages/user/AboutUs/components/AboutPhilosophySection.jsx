import { aboutPhilosophy } from "@/assets/about";

export default function AboutPhilosophySection() {
  return (
    <section className="py-20">
      <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
        <h2 className="heading-font text-4xl font-bold text-[#333]">{aboutPhilosophy.title}</h2>
        <p className="text-2xl text-[#6F6F6F] leading-relaxed">{aboutPhilosophy.lead}</p>
        <p className="text-lg text-[#6F6F6F] leading-relaxed">{aboutPhilosophy.prefix}</p>
        <p className="text-2xl md:text-3xl font-bold text-[#1F6559]">{aboutPhilosophy.highlight}</p>
        <p className="text-lg text-[#6F6F6F] leading-relaxed">{aboutPhilosophy.suffix}</p>
      </div>
    </section>
  );
}
