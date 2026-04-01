"use client";

import { motion } from "framer-motion";
import { Target, Zap, Shield, Users, Heart } from "lucide-react";
import { aboutPoweredBy } from "@/assets/content/about";
import { lucideFromMap } from "@/lib/lucideFromMap";
import { SplitHeading } from "@/motion/SplitHeading";
import { useScrollMotion, transitionMedium, staggerContainer, fadeUp, scaleIn } from "@/motion/scrollMotion";
import ScrollReveal from "@/motion/ScrollReveal";
import Image from "next/image";

const capIcons = { target: Target, zap: Zap, shield: Shield, users: Users, heart: Heart };

export default function AboutPoweredBySection() {
  const { t, stagger, delayChildren } = useScrollMotion();
  const tr = t(transitionMedium);

  return (
    <section id="about-powered-by" className="bg-teal-50 relative py-20 md:py-28">
      <div className="pointer-events-none absolute inset-0 z-0">
                    <Image
                      src="/images/bg_paws.png"
                      alt=""
                      fill
                      className="object-cover opacity-5 "
                      sizes="100vw"
                      priority
                    />
                  </div>
      <div className="mx-auto max-w-5xl px-6 relative">
        <div className="mb-12 text-center">
          <SplitHeading
            text={aboutPoweredBy.title}
            as="h2"
            className="heading-font mb-4 justify-center text-3xl font-bold text-[#333] md:text-4xl"
            wordDelay={0.09}
          />
          <motion.p
            className="mx-auto max-w-2xl text-lg text-[#6F6F6F]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -80px 0px" }}
            transition={{ delay: 0.4, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            {aboutPoweredBy.intro}
          </motion.p>
        </div>

        <ScrollReveal
          variants={staggerContainer(stagger * 1.2, delayChildren)}
          className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {aboutPoweredBy.capabilities.map((item, i) => {
            const Icon = lucideFromMap(capIcons, item.icon);
            if (!Icon) return null;
            return (
              <motion.div
                key={item.text}
                variants={scaleIn(tr)}
                className="group flex items-center gap-4 rounded-2xl border border-[#E8EEEB] bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#1F6559]/30 hover:shadow-md"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#1FA7A6]/15 to-[#1F6559]/10 transition-colors group-hover:from-[#1FA7A6]/25 group-hover:to-[#1F6559]/20">
                  <Icon className="h-5 w-5 text-[#1F6559]" strokeWidth={1.75} />
                </div>
                <div className="flex items-center gap-3">
                  <span className="heading-font text-sm font-semibold text-[#1F6559]/50">0{i + 1}</span>
                  <p className="font-medium text-[#333]">{item.text}</p>
                </div>
              </motion.div>
            );
          })}
        </ScrollReveal>

        <ScrollReveal
          variants={staggerContainer(stagger, delayChildren)}
          className="space-y-5 border-t border-[#E8EEEB] pt-10"
        >
          {aboutPoweredBy.paragraphs.map((para, i) => (
            <motion.p key={i} variants={fadeUp(tr)} className="text-lg leading-relaxed text-[#6F6F6F]">
              {para}
            </motion.p>
          ))}
        </ScrollReveal>
      </div>
    </section>
  );
}
