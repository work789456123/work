import { Sparkles, Heart, Globe, Users, Shield, Zap } from "lucide-react";
import { whyPashuVaani } from "@/assets/content/home";

const iconMap = {
  sparkles: Sparkles,
  heart: Heart,
  globe: Globe,
  users: Users,
  shield: Shield,
  zap: Zap,
};

export default function HomeWhyPashuVaaniSection() {
  return (
    <section
      id="home-why-pashuvaani"
      className="py-24 bg-gradient-to-r from-[#1FA7A6] via-[#38C2B4] to-[#78D65C]"
      data-testid="why-section"
    >
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="heading-font text-4xl lg:text-5xl font-bold text-white text-center mb-16">
          {whyPashuVaani.title}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {whyPashuVaani.cards.map((item, idx) => {
            const Icon = iconMap[item.icon];
            return (
              <div
                key={idx}
                className="p-8 bg-teal-50/10 backdrop-blur-md rounded-2xl border border-white/20 space-y-4 hover:bg-teal-50/20 transition-colors"
              >
                <Icon className="w-8 h-8 text-white" />
                <h3 className="heading-font text-lg font-semibold text-white">{item.title}</h3>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
