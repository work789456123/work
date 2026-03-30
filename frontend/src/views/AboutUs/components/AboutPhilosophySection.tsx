"use client";

import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import { aboutPhilosophy } from "@/assets/content/about";
import { SplitHeading } from "@/motion/SplitHeading";
import { useScrollMotion, transitionMedium, staggerContainer, fadeUp } from "@/motion/scrollMotion";
import ScrollReveal from "@/motion/ScrollReveal";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function AboutPhilosophySection() {
  const { t, stagger, delayChildren } = useScrollMotion();
  const tr = t(transitionMedium);

  return (
    <section
      id="about-philosophy"
      className="relative overflow-hidden bg-[#1F6559] py-24 md:py-32"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_60%_0%,#38C2B4_0%,transparent_60%)] opacity-20"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-[#78D65C]/15 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <motion.div
          className="mb-8 flex justify-center"
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "0px 0px -80px 0px" }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20">
            <Flame className="h-7 w-7 text-[#78D65C]" strokeWidth={1.75} aria-hidden />
          </div>
        </motion.div>

        <SplitHeading
          text={aboutPhilosophy.title}
          as="h2"
          className="heading-font mb-8 justify-center text-4xl font-bold text-white md:text-5xl"
          wordDelay={0.12}
        />

        <ScrollReveal
          variants={staggerContainer(stagger, delayChildren)}
          className="space-y-6"
        >
          <motion.p
            variants={fadeUp(tr)}
            className="mx-auto max-w-2xl text-2xl font-medium leading-relaxed text-white/90 md:text-3xl"
          >
            {aboutPhilosophy.lead}
          </motion.p>

          <motion.p variants={fadeUp(tr)} className="text-lg text-white/70">
            {aboutPhilosophy.prefix}
          </motion.p>

          <motion.p
            variants={fadeUp(tr)}
            className="heading-font text-2xl font-bold text-[#78D65C] md:text-3xl"
          >
            {aboutPhilosophy.highlight}
          </motion.p>

          <motion.p variants={fadeUp(tr)} className="text-lg text-white/70">
            {aboutPhilosophy.suffix}
          </motion.p>
        </ScrollReveal>
      </div>
    </section>
  );
}
