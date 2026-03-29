"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { Flame, ArrowRight } from "lucide-react";
import { philosophy } from "@/assets/content/home";
import { Button } from "@/components/ui/button";
import ScrollReveal from "@/motion/ScrollReveal";
import { SplitHeading } from "@/motion/SplitHeading";
import { staggerContainer, fadeUp, useScrollMotion, transitionMedium } from "@/motion/scrollMotion";

export default function HomePhilosophySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { t, stagger, delayChildren } = useScrollMotion();
  const tr = t(transitionMedium);
  const fade = fadeUp(tr);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const contentY = useTransform(scrollYProgress, [0, 1], [60, -30]);
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <section
      ref={sectionRef}
      id="home-philosophy"
      className="relative overflow-hidden py-32 md:py-40"
      style={{ background: "#1F6559" }}
    >
      {/* Parallax background layer */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={reduced ? {} : { y: bgY }}
        aria-hidden
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 50% 30%, rgba(31,167,166,0.15) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </motion.div>

      {/* Animated orbs */}
      {!reduced && (
        <>
          <motion.div
            className="pointer-events-none absolute -left-24 top-1/3 h-80 w-80 rounded-full bg-[#38C2B4]/10 blur-3xl"
            animate={{ y: [0, -30, 0], x: [0, 15, 0] }}
            transition={{ duration: 18, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
            aria-hidden
          />
          <motion.div
            className="pointer-events-none absolute -right-16 bottom-1/4 h-64 w-64 rounded-full bg-[#78D65C]/10 blur-3xl"
            animate={{ y: [0, 25, 0], scale: [1, 1.05, 1] }}
            transition={{ duration: 14, delay: 3, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
            aria-hidden
          />
        </>
      )}

      {/* Content — parallax */}
      <motion.div style={reduced ? {} : { y: contentY }}>
        <ScrollReveal
          className="relative mx-auto max-w-3xl px-6 text-center"
          variants={staggerContainer(stagger, delayChildren)}
        >
          <motion.div className="mb-6 flex justify-center" variants={fade}>
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
              <Flame className="h-7 w-7 text-[#78D65C]" />
            </span>
          </motion.div>

          <motion.div variants={fade} className="mb-8 flex justify-center">
            <SplitHeading
              text={philosophy.title}
              as="h2"
              className="heading-font justify-center text-4xl font-bold text-white lg:text-5xl"
            />
          </motion.div>

          <motion.p
            className="heading-font mb-6 text-xl font-medium italic leading-relaxed text-white/90 md:text-2xl"
            variants={fade}
          >
            &ldquo;{philosophy.lead}&rdquo;
          </motion.p>

          <motion.p className="mb-10 text-base leading-relaxed text-white/80 md:text-lg" variants={fade}>
            {philosophy.bodyPrefix}
            <span className="font-bold text-white">{philosophy.highlight}</span>
            {philosophy.bodySuffix}
          </motion.p>

          <motion.div variants={fade}>
            <Button
              onClick={() => window.dispatchEvent(new CustomEvent("openPromoModal"))}
              className="heading-font group h-12 rounded-xl bg-white px-8 text-base font-semibold text-[#1F6559] shadow-lg transition-all hover:bg-white/90 hover:shadow-xl"
            >
              Get Started
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </Button>
          </motion.div>

          <motion.div
            className="mx-auto mt-12 h-px w-32 rounded-full"
            style={{ background: "linear-gradient(to right, #1FA7A6, #78D65C)" }}
            variants={fade}
            aria-hidden
          />
        </ScrollReveal>
      </motion.div>
    </section>
  );
}
