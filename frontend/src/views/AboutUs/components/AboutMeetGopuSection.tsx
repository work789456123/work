"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { aboutMeetGopu } from "@/assets/content/about";
import { SplitHeading } from "@/motion/SplitHeading";
import { useScrollMotion, transitionMedium, staggerContainer, fadeUp, slideInRight, slideInLeft } from "@/motion/scrollMotion";
import ScrollReveal from "@/motion/ScrollReveal";

export default function AboutMeetGopuSection() {
  const { t, stagger, delayChildren } = useScrollMotion();
  const tr = t(transitionMedium);

  return (
    <section
      id="about-meet-gopu"
      className="relative overflow-hidden bg-gradient-to-r from-[#1FA7A6] via-[#38C2B4] to-[#78D65C] py-20 md:py-28"
    >
      <div
        className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-white/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-16 left-8 h-56 w-56 rounded-full bg-[#1F6559]/25 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <ScrollReveal
            variants={{ hidden: {}, visible: { transition: { staggerChildren: stagger, delayChildren } } }}
            className="order-2 lg:order-1"
          >
            <motion.div
              variants={slideInLeft(tr)}
              className="relative mx-auto max-w-md overflow-hidden rounded-3xl shadow-2xl shadow-[#1F6559]/30"
            >
              <video
                src={aboutMeetGopu.videoSrc}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-auto object-cover"
              />
              <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/20" />
            </motion.div>
          </ScrollReveal>

          <ScrollReveal
            variants={staggerContainer(stagger, delayChildren)}
            className="order-1 space-y-6 lg:order-2"
          >
            <motion.p
              variants={fadeUp(tr)}
              className="heading-font text-xs font-semibold uppercase tracking-[0.2em] text-white/80"
            >
              The Heart of PashuVaani
            </motion.p>

            <SplitHeading
              text={aboutMeetGopu.title}
              as="h2"
              className="heading-font text-4xl font-bold text-white md:text-5xl"
              wordDelay={0.12}
            />

            <motion.p variants={fadeUp(tr)} className="text-lg font-semibold leading-relaxed text-white/95">
              <span className="italic">{aboutMeetGopu.leadBold}</span> Behind Gopu is advanced AI
              technology, but what pet parents experience is simplicity, clarity, and reassurance.
              Because when your pet isn&apos;t well, you need guidance — not confusion.
            </motion.p>

            {aboutMeetGopu.paragraphs.map((para, i) => (
              <motion.p key={i} variants={fadeUp(tr)} className="text-lg leading-relaxed text-white/90">
                {para}
              </motion.p>
            ))}

            <motion.blockquote
              variants={slideInRight(tr)}
              className="relative mt-2 overflow-hidden rounded-2xl bg-white/15 p-6 backdrop-blur-sm ring-1 ring-white/25"
            >
              <Quote
                className="mb-3 h-6 w-6 text-white/50"
                aria-hidden
                strokeWidth={1.5}
              />
              <p className="text-lg font-medium italic leading-relaxed text-white">
                {aboutMeetGopu.quote}
              </p>
            </motion.blockquote>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
