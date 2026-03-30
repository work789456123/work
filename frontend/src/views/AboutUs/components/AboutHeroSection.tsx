"use client";

import { motion } from "framer-motion";
import { aboutHero } from "@/assets/content/about";
import { brand } from "@/assets/content/shared/brand";
import { SplitHeading } from "@/motion/SplitHeading";
import { useScrollMotion, transitionMedium, fadeUp } from "@/motion/scrollMotion";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function AboutHeroSection() {
  const { t } = useScrollMotion();
  const tr = t(transitionMedium);
  const fade = fadeUp(tr);

  return (
    <section
      id="about-hero"
      data-testid="AboutUs-section"
      className="relative overflow-hidden bg-gradient-to-r from-[#1FA7A6] via-[#38C2B4] to-[#78D65C] py-24 md:py-32"
    >
      <div
        className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-white/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-24 right-0 h-80 w-80 rounded-full bg-[#1F6559]/20 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute right-1/4 top-8 h-56 w-56 rounded-full bg-white/[0.06] blur-2xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <motion.p
          className="heading-font mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-white/80"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          {brand.name}
        </motion.p>

        <SplitHeading
          text={aboutHero.title}
          as="h1"
          className="heading-font justify-center text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl"
          wordDelay={0.1}
        />

        <motion.p
          className="heading-font mx-auto mt-6 max-w-2xl text-xl font-semibold text-white/90 md:text-2xl"
          variants={fade}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.6 }}
        >
          {aboutHero.subtitle}
        </motion.p>

        <motion.div
          className="mt-8 flex justify-center"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.9, duration: 0.6, ease: EASE }}
        >
          <div className="h-1 w-16 rounded-full bg-white/60" />
        </motion.div>
      </div>
    </section>
  );
}
