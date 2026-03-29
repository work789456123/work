import { motion } from "framer-motion";
import { philosophy } from "@/assets/content/home";
import ScrollReveal from "@/motion/ScrollReveal";
import { staggerContainer, fadeUp, useScrollMotion, transitionMedium } from "@/motion/scrollMotion";

export default function HomePhilosophySection() {
  const { t, stagger, delayChildren } = useScrollMotion();
  const tr = t(transitionMedium);
  const fade = fadeUp(tr);

  return (
    <section id="home-philosophy" className="py-24 bg-teal-50">
      <ScrollReveal
        className="max-w-4xl mx-auto px-6 text-center space-y-8"
        variants={staggerContainer(stagger, delayChildren)}
      >
        <motion.h2 className="heading-font text-4xl lg:text-5xl font-bold text-[#333]" variants={fade}>
          {philosophy.title}
        </motion.h2>
        <motion.p
          className="text-2xl text-[rgba(111,111,111,0.75)] leading-relaxed"
          variants={fade}
        >
          {philosophy.lead}
        </motion.p>
        <motion.p className="text-lg text-[#6F6F6F] leading-relaxed" variants={fade}>
          {philosophy.bodyPrefix}
          <span className="font-semibold text-[#1F6559]">{philosophy.highlight}</span>
          {philosophy.bodySuffix}
        </motion.p>
      </ScrollReveal>
    </section>
  );
}
