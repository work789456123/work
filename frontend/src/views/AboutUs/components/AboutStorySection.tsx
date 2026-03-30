"use client";

import { motion } from "framer-motion";
import { aboutStory } from "@/assets/content/about";
import { SplitHeading } from "@/motion/SplitHeading";
import { useScrollMotion, transitionMedium, staggerContainer, fadeUp, slideInRight, scaleIn } from "@/motion/scrollMotion";
import ScrollReveal from "@/motion/ScrollReveal";

export default function AboutStorySection() {
  const { t, stagger, delayChildren } = useScrollMotion();
  const tr = t(transitionMedium);

  return (
    <section id="about-story" className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal
          variants={staggerContainer(stagger, delayChildren)}
          className="mb-16 max-w-3xl"
        >
          <motion.div
            variants={fadeUp(tr)}
            className="mb-5 flex items-center gap-3"
          >
            <div className="h-1 w-10 rounded-full bg-gradient-to-r from-[#1F6559] to-[#38C2B4]" />
            <span className="heading-font text-xs font-semibold uppercase tracking-[0.2em] text-[#1F6559]">
              Our Journey
            </span>
          </motion.div>

          <SplitHeading
            text={aboutStory.accentTitle}
            as="h2"
            className="heading-font mb-6 text-4xl font-bold leading-tight text-[#333] md:text-5xl"
            wordDelay={0.07}
          />

          <motion.p variants={fadeUp(tr)} className="text-xl leading-relaxed text-[#6F6F6F]">
            {aboutStory.lead}
          </motion.p>
        </ScrollReveal>

        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-16">
          <ScrollReveal
            variants={staggerContainer(stagger, delayChildren)}
            className="space-y-5"
          >
            {aboutStory.leftColumn.map((para, i) => (
              <motion.p key={i} variants={fadeUp(tr)} className="text-lg leading-relaxed text-[#6F6F6F]">
                {para}
              </motion.p>
            ))}
            <motion.p
              variants={fadeUp(tr)}
              className="heading-font pt-2 text-lg font-semibold text-[#1F6559]"
            >
              {aboutStory.tagline}
            </motion.p>
          </ScrollReveal>

          <ScrollReveal
            variants={staggerContainer(stagger * 1.3, delayChildren)}
            className="grid grid-cols-1 gap-5 sm:grid-cols-2"
          >
            {aboutStory.highlightCards.map((card, i) => (
              <motion.div
                key={card.title}
                variants={scaleIn(tr)}
                className="group relative overflow-hidden rounded-2xl border border-[#E8EEEB] bg-[#FAFAFA] p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#1F6559]/25 hover:shadow-md"
              >
                <div className="absolute left-0 top-0 h-full w-0.5 rounded-l-full bg-gradient-to-b from-[#1FA7A6] to-[#78D65C] opacity-0 transition-opacity group-hover:opacity-100" />
                <span className="heading-font mb-3 block text-2xl font-bold text-[#1F6559]/20">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="heading-font mb-2 text-base font-semibold text-[#333]">{card.title}</h3>
                <p className="text-sm leading-relaxed text-[#6F6F6F]">{card.desc}</p>
              </motion.div>
            ))}
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
