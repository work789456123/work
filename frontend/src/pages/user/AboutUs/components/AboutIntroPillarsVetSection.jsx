import { Sparkles, Heart, Shield, Zap } from "lucide-react";
import { aboutIntro, aboutPillars, aboutVetSupport } from "@/assets/about";

const pillarIcons = { sparkles: Sparkles, heart: Heart, zap: Zap, shield: Shield };

export default function AboutIntroPillarsVetSection() {
  const hi = aboutIntro.highlightPhrases;
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-12 space-y-8">
        <div className="space-y-6">
          <p className="text-lg text-[#6F6F6F] leading-relaxed">{aboutIntro.paragraphs[0]}</p>
          <p className="text-lg text-[#6F6F6F] leading-relaxed">
            PashuVaani <span className="font-semibold text-[#1F6559]">{hi.bridge}</span>
          </p>
          <p className="text-lg text-[#6F6F6F] leading-relaxed">
            PashuVaani is an{" "}
            <span className="font-semibold text-[#1F6559]">{hi.platform}</span>, designed to help humans better
            understand the animals they care for. By combining artificial intelligence with veterinary knowledge, the
            platform helps interpret symptoms, behavioural signals, and observable changes that may indicate potential
            health concerns. The goal is to support caretakers with early awareness and better understanding, so that they
            can take timely action when something seems wrong.
          </p>
          <p className="text-lg text-[#6F6F6F] leading-relaxed">
            However, PashuVaani is <span className="font-semibold text-[#1F6559]">{hi.notReplace}</span>.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-8">
          {aboutPillars.map((p) => {
            const Icon = pillarIcons[p.icon];
            return (
              <div
                key={p.title}
                className="p-6 rounded-2xl bg-[#1F6559]/5 border border-[#1F6559]/20 space-y-3"
              >
                <Icon className="w-10 h-10 text-[#1F6559]" />
                <h3 className="heading-font font-semibold text-[#333]">{p.title}</h3>
              </div>
            );
          })}
        </div>
        <div className="space-y-6 pt-8">
          <p className="text-lg text-[#6F6F6F] leading-relaxed">{aboutVetSupport.paragraphs[0]}</p>
          <p className="text-lg text-[#6F6F6F] leading-relaxed">
            In this way, the platform works{" "}
            <span className="font-semibold text-[#1F6559]">{aboutVetSupport.emphasis}</span> helping improve awareness
            and decision-making in animal care.
          </p>
        </div>
      </div>
    </section>
  );
}
