"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { Sparkles, Heart, Zap, Shield } from "lucide-react";
import { aboutSection, aboutPillars } from "@/assets/content/home";
import {
  fadeUp,
  scaleIn,
  useScrollMotion,
  transitionMedium,
  viewportRepeat,
  homeEase,
} from "@/motion/scrollMotion";
import { SplitHeading } from "@/motion/SplitHeading";
import { lucideFromMap } from "@/lib/lucideFromMap";
import Image from "next/image";

const iconMap = { sparkles: Sparkles, heart: Heart, zap: Zap, shield: Shield };

const pillGradients = [
  "from-[#1FA7A6] to-[#38C2B4]",
  "from-[#1F6559] to-[#1FA7A6]",
  "from-[#38C2B4] to-[#78D65C]",
  "from-[#78D65C] to-[#38C2B4]",
];

export default function HomeAboutPillarsSection() {
  const ref = useRef(null);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(ref, viewportRepeat);
  const reduced = useReducedMotion();
  const { t, stagger, delayChildren } = useScrollMotion();
  const tr = t(transitionMedium);
  const fade = fadeUp(tr);
  const cardIn = scaleIn(tr);
  const animate = reduced ? "visible" : isInView ? "visible" : "hidden";

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const headingY = useTransform(scrollYProgress, [0, 1], [60, -40]);
  const cardsY = useTransform(scrollYProgress, [0, 1], [80, -30]);

  const outerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: stagger, delayChildren, when: "beforeChildren" as const } },
  };
  const gridVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: stagger * 0.8, delayChildren: 0.18, when: "beforeChildren" as const } },
  };

  return (
    <section
      ref={sectionRef}
      id="home-about-pillars"
      data-testid="about-section"
      className="relative overflow-hidden bg-teal-50 py-28 md:py-36"
    >
      <div className="pointer-events-none absolute inset-0 z-0">
              <Image
                src="/images/bg_paws.png"
                alt=""
                fill
                className="object-cover opacity-10 "
                sizes="100vw"
                priority
              /></div>

      <div className="relative mx-auto max-w-5xl px-6 text-center">
        <motion.div
          ref={ref}
          className="space-y-16"
          variants={outerVariants}
          initial="hidden"
          animate={animate}
        >
          {/* Header — parallax */}
          <motion.div
            className="space-y-5"
            style={reduced ? {} : { y: headingY }}
            variants={fade}
          >
            <div className="flex justify-center">
              <SplitHeading
                text={aboutSection.title}
                as="h2"
                className="heading-font justify-center text-4xl font-bold text-[#1F6559] lg:text-5xl"
              />
            </div>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-[#555]">
              {aboutSection.body}
            </p>
          </motion.div>

          {/* Pillar cards — parallax */}
          <motion.div
            className="grid grid-cols-2 gap-5 lg:grid-cols-4 lg:gap-6"
            style={reduced ? {} : { y: cardsY }}
            variants={gridVariants}
          >
            {aboutPillars.map((p, idx) => {
              const Icon = lucideFromMap(iconMap, p.icon);
              if (!Icon) return null;
              return (
                <motion.div
                  key={p.title}
                  className="group flex flex-col items-center gap-4 rounded-2xl border border-[#1FA7A6]/10 bg-[#FAFAFA] p-7 text-center transition-all duration-300 hover:-translate-y-1 hover:border-[#1FA7A6]/25 hover:shadow-xl hover:shadow-[#1FA7A6]/8"
                  variants={cardIn}
                  whileHover={reduced ? {} : { y: -6, transition: { duration: 0.22, ease: homeEase } }}
                >
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${pillGradients[idx % pillGradients.length]} shadow-md`}
                  >
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="heading-font text-sm font-semibold leading-snug text-[#333] md:text-base">
                    {p.title}
                  </h3>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
