import { philosophy } from "@/assets/home";

export default function HomePhilosophySection() {
  return (
    <section className="py-24 bg-teal-50">
      <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
        <h2 className="heading-font text-4xl lg:text-5xl font-bold text-[#333]">{philosophy.title}</h2>
        <p className="text-2xl text-[rgba(111,111,111,0.75)] leading-relaxed">{philosophy.lead}</p>
        <p className="text-lg text-[#6F6F6F] leading-relaxed">
          {philosophy.bodyPrefix}
          <span className="font-semibold text-[#1F6559]">{philosophy.highlight}</span>
          {philosophy.bodySuffix}
        </p>
      </div>
    </section>
  );
}
