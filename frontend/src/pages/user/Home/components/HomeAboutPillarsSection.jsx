import { Sparkles, Heart, Globe, Users, Shield, Zap } from "lucide-react";
import { aboutSection, aboutPillars } from "@/assets/content/home";

const iconMap = {
  sparkles: Sparkles,
  heart: Heart,
  globe: Globe,
  users: Users,
  shield: Shield,
  zap: Zap,
};

export default function HomeAboutPillarsSection() {
  return (
    <section
      id="home-about-pillars"
      className="py-24 bg-gradient-to-r from-[#1FA7A6] via-[#38C2B4] to-[#78D65C]"
      data-testid="about-section"
    >
      <div className="max-w-5xl mx-auto px-6 text-center space-y-6">
        <h2 className="heading-font text-4xl lg:text-5xl font-bold text-white">{aboutSection.title}</h2>
        <p className="text-lg text-white/90 leading-relaxed">{aboutSection.body}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pt-12">
          {aboutPillars.map((p) => {
            const Icon = iconMap[p.icon];
            return (
              <div key={p.title} className="space-y-3">
                <div className="w-12 h-12 bg-teal-50/20 rounded-xl flex items-center justify-center mx-auto backdrop-blur-sm">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="heading-font font-semibold text-white">{p.title}</h3>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
