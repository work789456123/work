import { Target, Zap, Shield, Users, Heart } from "lucide-react";
import { aboutPoweredBy } from "@/assets/about";

const capIcons = { target: Target, zap: Zap, shield: Shield, users: Users, heart: Heart };

export default function AboutPoweredBySection() {
  return (
    <section className="py-20">
      <div className="max-w-5xl mx-auto px-6 space-y-8">
        <h2 className="heading-font text-4xl font-bold text-[#333] text-center">{aboutPoweredBy.title}</h2>
        <p className="text-lg text-[#6F6F6F] leading-relaxed text-center">{aboutPoweredBy.intro}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {aboutPoweredBy.capabilities.map((item) => {
            const Icon = capIcons[item.icon];
            return (
              <div key={item.text} className="flex items-start space-x-4 p-4">
                <div className="w-12 h-12 bg-[#1F6559]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon className="w-6 h-6 text-[#1F6559]" />
                </div>
                <p className="text-lg text-[#6F6F6F] pt-2">{item.text}</p>
              </div>
            );
          })}
        </div>
        <div className="space-y-6 pt-6">
          {aboutPoweredBy.paragraphs.map((t, i) => (
            <p key={i} className="text-lg text-[#6F6F6F] leading-relaxed">
              {t}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
