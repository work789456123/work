"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { aboutWhy } from "@/assets/content/about";
import { SplitHeading } from "@/motion/SplitHeading";
import { useScrollMotion, transitionMedium, staggerContainer, fadeUp } from "@/motion/scrollMotion";
import ScrollReveal from "@/motion/ScrollReveal";

export default function AboutWhySection() {
  const { t, stagger, delayChildren } = useScrollMotion();
  const tr = t(transitionMedium);

  return (
    <section id="about-why" className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-14 text-center">
          <SplitHeading
            text={aboutWhy.title}
            as="h2"
            className="heading-font justify-center text-4xl font-bold text-[#333] md:text-5xl"
            wordDelay={0.12}
          />
        </div>

        <ScrollReveal
          variants={staggerContainer(stagger * 1.1, delayChildren)}
          className="grid grid-cols-1 gap-4 md:grid-cols-2"
        >
          {aboutWhy.bullets.map((item, i) => (
            <motion.div
              key={item}
              variants={{
                hidden: { opacity: 0, x: i % 2 === 0 ? -24 : 24 },
                visible: { opacity: 1, x: 0, transition: tr },
              }}
              className="group flex items-start gap-4 rounded-2xl border border-[#E8EEEB] bg-[#FAFAFA] p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#1F6559]/30 hover:shadow-md"
            >
              <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#1FA7A6] to-[#1F6559] shadow-sm">
                <Check className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
              </div>
              <p className="text-base leading-relaxed text-[#4A4A4A]">{item}</p>
            </motion.div>
          ))}
        </ScrollReveal>
      </div>
    </section>
  );
}
