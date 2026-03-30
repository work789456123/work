"use client";

import { motion } from "framer-motion";
import { Globe, Award, Target, Shield, Zap } from "lucide-react";
import { aboutMission } from "@/assets/content/about";
import { lucideFromMap } from "@/lib/lucideFromMap";
import { SplitHeading } from "@/motion/SplitHeading";
import { useScrollMotion, transitionMedium, staggerContainer, fadeUp, scaleIn } from "@/motion/scrollMotion";
import ScrollReveal from "@/motion/ScrollReveal";

const missionIcons = { globe: Globe, award: Award, target: Target, shield: Shield, zap: Zap };

const pillarsGradients = [
  "from-[#1FA7A6] to-[#38C2B4]",
  "from-[#38C2B4] to-[#78D65C]",
  "from-[#1F6559] to-[#1FA7A6]",
  "from-[#78D65C] to-[#1F6559]",
  "from-[#1FA7A6] to-[#1F6559]",
];

export default function AboutMissionSection() {
  const { t, stagger, delayChildren } = useScrollMotion();
  const tr = t(transitionMedium);

  return (
    <section id="about-mission" className="bg-[#1FA7A6]/[0.05] py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-14 text-center">
          <SplitHeading
            text={aboutMission.title}
            as="h2"
            className="heading-font mb-6 justify-center text-4xl font-bold text-[#333] md:text-5xl"
            wordDelay={0.12}
          />
          <motion.p
            className="mx-auto max-w-3xl text-xl leading-relaxed text-[#6F6F6F]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -80px 0px" }}
            transition={{ delay: 0.35, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            {aboutMission.leadPrefix}
            <span className="font-semibold text-[#1F6559]">{aboutMission.leadHighlight}</span>
            {aboutMission.leadSuffix}
          </motion.p>
        </div>

        <ScrollReveal
          variants={staggerContainer(stagger, delayChildren)}
          className="mb-10 text-center"
        >
          <motion.p
            variants={fadeUp(tr)}
            className="mx-auto max-w-3xl text-lg leading-relaxed text-[#6F6F6F]"
          >
            {aboutMission.body}
          </motion.p>
        </ScrollReveal>

        <ScrollReveal
          variants={staggerContainer(stagger * 1.2, delayChildren)}
          className="mb-14 flex flex-wrap justify-center gap-4"
        >
          {aboutMission.pillars.map((item, i) => {
            const Icon = lucideFromMap(missionIcons, item.icon);
            if (!Icon) return null;
            const grad = pillarsGradients[i % pillarsGradients.length];
            return (
              <motion.div
                key={item.text}
                variants={scaleIn(tr)}
                className="group flex items-center gap-2.5 rounded-full border border-[#E8EEEB] bg-white px-5 py-3 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#1F6559]/30 hover:shadow-md"
              >
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${grad}`}
                >
                  <Icon className="h-4 w-4 text-white" strokeWidth={2} />
                </div>
                <span className="heading-font text-sm font-semibold text-[#333]">{item.text}</span>
              </motion.div>
            );
          })}
        </ScrollReveal>

        <motion.div
          className="overflow-hidden rounded-2xl bg-gradient-to-r from-[#1FA7A6] via-[#38C2B4] to-[#78D65C] p-px"
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "0px 0px -80px 0px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="rounded-2xl bg-white px-8 py-7 text-center">
            <p className="heading-font text-xl font-semibold text-[#1F6559] md:text-2xl">
              {aboutMission.vision}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
