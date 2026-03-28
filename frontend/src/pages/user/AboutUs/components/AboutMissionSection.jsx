import { Globe, Award, Target, Shield, Zap } from "lucide-react";
import { aboutMission } from "@/assets/content/about";

const missionIcons = { globe: Globe, award: Award, target: Target, shield: Shield, zap: Zap };

export default function AboutMissionSection() {
  return (
    <section id="about-mission" className="py-20">
      <div className="max-w-5xl mx-auto px-6 space-y-8">
        <h2 className="heading-font text-4xl font-bold text-[#333] text-center">{aboutMission.title}</h2>
        <p className="text-lg text-[#6F6F6F] leading-relaxed">
          {aboutMission.leadPrefix}
          <span className="font-semibold text-[#1F6559]">{aboutMission.leadHighlight}</span>
          {aboutMission.leadSuffix}
        </p>
        <p className="text-lg text-[#6F6F6F] leading-relaxed text-center">{aboutMission.body}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {aboutMission.pillars.map((item) => {
            const Icon = missionIcons[item.icon];
            return (
              <div
                key={item.text}
                className="p-6 rounded-2xl bg-[#1F6559]/5 border border-[#1F6559]/20 space-y-3 text-center"
              >
                <Icon className="w-10 h-10 text-[#1F6559] mx-auto" />
                <p className="heading-font font-semibold text-[#333]">{item.text}</p>
              </div>
            );
          })}
        </div>
        <p className="text-xl text-[#1F6559] font-semibold text-center pt-6">{aboutMission.vision}</p>
      </div>
    </section>
  );
}
