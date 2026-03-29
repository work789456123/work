"use client";

import { motion } from "framer-motion";
import { aboutHero } from "@/assets/content/about";
import ScrollReveal from "@/motion/ScrollReveal";
import { staggerContainer, fadeUp, useScrollMotion, transitionMedium } from "@/motion/scrollMotion";

export default function AboutHeroSection() {
  const { t, stagger, delayChildren } = useScrollMotion();
  const tr = t(transitionMedium);
  const fade = fadeUp(tr);

  return (
    <section
      id="about-hero"
      className="py-16 md:py-24 bg-gradient-to-r from-[#1FA7A6] via-[#38C2B4] to-[#78D65C]"
      data-testid="AboutUs-section"
    >
      <ScrollReveal
        className="max-w-4xl mx-auto px-6 text-center space-y-4 md:space-y-6"
        variants={staggerContainer(stagger, delayChildren)}
      >
        <motion.h1 className="heading-font text-3xl md:text-4xl lg:text-5xl font-bold text-white" variants={fade}>
          {aboutHero.title}
        </motion.h1>
        <motion.p className="heading-font text-lg md:text-xl lg:text-xl font-bold text-white" variants={fade}>
          {aboutHero.subtitle}
        </motion.p>
      </ScrollReveal>
    </section>
  );
}
