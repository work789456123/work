"use client";

import { motion } from "framer-motion";
import { Sparkles, Heart, Zap, Shield } from "lucide-react";
import { aboutIntro, aboutPillars, aboutVetSupport } from "@/assets/content/about";
import { lucideFromMap } from "@/lib/lucideFromMap";
import { SplitHeading } from "@/motion/SplitHeading";
import { useScrollMotion, transitionMedium, transitionShort, staggerContainer, fadeUp, scaleIn } from "@/motion/scrollMotion";
import ScrollReveal from "@/motion/ScrollReveal";

const pillarIcons = { sparkles: Sparkles, heart: Heart, zap: Zap, shield: Shield };

const pillarColors: Record<string, string> = {
  sparkles: "from-[#1FA7A6] to-[#38C2B4]",
  heart: "from-[#38C2B4] to-[#78D65C]",
  zap: "from-[#1F6559] to-[#1FA7A6]",
  shield: "from-[#78D65C] to-[#1F6559]",
};

export default function AboutIntroPillarsVetSection() {
  const { t, stagger, delayChildren } = useScrollMotion();
  const tr = t(transitionMedium);
  const trShort = t(transitionShort);
  const hi = aboutIntro.highlightPhrases;

  return (
    <section id="about-intro-pillars-vet" className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6 lg:px-12">

        <ScrollReveal
          variants={staggerContainer(stagger, delayChildren)}
          className="mb-16  space-y-6"
        >
          <motion.p variants={fadeUp(tr)} className="text-lg leading-relaxed text-[#6F6F6F]">
            {aboutIntro.paragraphs[0]}
          </motion.p>
          <motion.p variants={fadeUp(tr)} className="text-lg leading-relaxed text-[#6F6F6F]">
            PashuVaani{" "}
            <span className="font-semibold text-[#1F6559]">{hi.bridge}</span>
          </motion.p>
          <motion.p variants={fadeUp(tr)} className="text-lg leading-relaxed text-[#6F6F6F]">
            PashuVaani is an{" "}
            <span className="font-semibold text-[#1F6559]">{hi.platform}</span>, designed to help
            humans better understand the animals they care for. By combining artificial
            intelligence with veterinary knowledge, the platform helps interpret symptoms,
            behavioural signals, and observable changes that may indicate potential health
            concerns. The goal is to support caretakers with early awareness and better
            understanding, so that they can take timely action when something seems wrong.
          </motion.p>
          <motion.p variants={fadeUp(tr)} className="text-lg leading-relaxed text-[#6F6F6F]">
            However, PashuVaani is{" "}
            <span className="font-semibold text-[#1F6559]">{hi.notReplace}</span>.
          </motion.p>
        </ScrollReveal>

        <div className="mb-8">
          <SplitHeading
            text="Built on Four Pillars"
            as="h2"
            className="heading-font mb-12 justify-center text-3xl font-bold text-[#333] md:text-4xl"
            wordDelay={0.09}
          />
          <ScrollReveal
            variants={staggerContainer(stagger * 1.4, delayChildren)}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {aboutPillars.map((p) => {
              const Icon = lucideFromMap(pillarIcons, p.icon);
              if (!Icon) return null;
              const gradient = pillarColors[p.icon] ?? "from-[#1FA7A6] to-[#1F6559]";
              return (
                <motion.div
                  key={p.title}
                  variants={scaleIn(t(trShort))}
                  className="group relative overflow-hidden rounded-2xl border border-[#E8EEEB] bg-[#FAFAFA] p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div
                    className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} shadow-sm`}
                  >
                    <Icon className="h-6 w-6 text-white" strokeWidth={1.75} />
                  </div>
                  <h3 className="heading-font font-semibold text-[#333]">{p.title}</h3>
                  <div
                    className={`absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r ${gradient} opacity-0 transition-opacity group-hover:opacity-100`}
                  />
                </motion.div>
              );
            })}
          </ScrollReveal>
        </div>

        <ScrollReveal
          variants={staggerContainer(stagger, delayChildren)}
          className="mt-16 max-w-3xl space-y-6 border-l-2 border-[#1F6559]/30 pl-6"
        >
          <motion.p variants={fadeUp(tr)} className="text-lg leading-relaxed text-[#6F6F6F]">
            {aboutVetSupport.paragraphs[0]}
          </motion.p>
          <motion.p variants={fadeUp(tr)} className="text-lg leading-relaxed text-[#6F6F6F]">
            In this way, the platform works{" "}
            <span className="font-semibold text-[#1F6559]">{aboutVetSupport.emphasis}</span>{" "}
            helping improve awareness and decision-making in animal care.
          </motion.p>
        </ScrollReveal>
      </div>
    </section>
  );
}
