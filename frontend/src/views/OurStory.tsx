"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X, ZoomIn, Quote } from "lucide-react";
import {
  ourStoryHero,
  foundersSectionTitle,
  founders,
  ourStoryQuestion,
  ourStoryJourney,
} from "@/assets/content/our_story";
import { brand } from "@/assets/content/shared/brand";
import UserPageShell from "@/motion/UserPageShell";
import { SplitHeading } from "@/motion/SplitHeading";
import ScrollReveal from "@/motion/ScrollReveal";
import {
  useScrollMotion,
  transitionMedium,
  transitionShort,
  staggerContainer,
  fadeUp,
  fadeIn,
  slideInLeft,
  slideInRight,
  scaleIn,
} from "@/motion/scrollMotion";

const EASE = [0.22, 1, 0.36, 1] as const;

const OurStory = () => {
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const { t, stagger, delayChildren } = useScrollMotion();
  const tr = t(transitionMedium);
  const trShort = t(transitionShort);
  const q = ourStoryQuestion;

  return (
    <UserPageShell id="page-our-story" className="min-h-screen bg-white">

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section
        id="our-story-hero"
        className="relative overflow-hidden bg-gradient-to-r from-[#1FA7A6] via-[#38C2B4] to-[#78D65C] py-24 "
      >
        <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-white/10 blur-3xl" aria-hidden />
        <div className="pointer-events-none absolute -bottom-20 right-8 h-64 w-64 rounded-full bg-[#1F6559]/20 blur-3xl" aria-hidden />
        <div className="pointer-events-none absolute right-1/3 top-6 h-48 w-48 rounded-full bg-white/[0.07] blur-2xl" aria-hidden />

        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <motion.p
            className="heading-font mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-white/85"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            {brand.name}
          </motion.p>

          <SplitHeading
            text={ourStoryHero.title}
            as="h1"
            className="heading-font justify-center text-4xl font-bold text-white md:text-5xl lg:text-6xl"
            wordDelay={0.13}
          />

          <motion.p
            className="heading-font mx-auto mt-5 max-w-xl text-xl font-semibold text-white/90"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.55, ease: EASE }}
          >
            {ourStoryHero.subtitle}
          </motion.p>

          <motion.div
            className="mt-8 flex justify-center"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.9, duration: 0.55, ease: EASE }}
          >
            <div className="h-0.5 w-14 rounded-full bg-white/60" />
          </motion.div>
        </div>
      </section>

      {/* ── Founders ─────────────────────────────────────────── */}
      <section id="our-story-founders" className="bg-[#FAFAFA] py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">

          <div className="mb-16 text-center md:mb-20">
            <SplitHeading
              text={foundersSectionTitle}
              as="h2"
              className="heading-font justify-center text-3xl font-bold text-[#333] md:text-4xl"
              wordDelay={0.09}
            />
          </div>

          <div className="space-y-28 md:space-y-40">
            {founders.map((founder, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <div key={founder.name}>
                  <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">

                    {/* Image */}
                    <ScrollReveal
                      variants={{ hidden: {}, visible: { transition: { staggerChildren: stagger, delayChildren } } }}
                      className={isEven ? "lg:order-1" : "lg:order-2"}
                    >
                      <motion.div
                        variants={isEven ? slideInLeft(tr) : slideInRight(tr)}
                        className="group relative mx-auto aspect-[4/5] w-full max-w-base cursor-zoom-in overflow-hidden rounded-[2.5rem] shadow-xl transition-shadow hover:shadow-2xl"
                        role="button"
                        tabIndex={0}
                        aria-label={`View photo of ${founder.name}`}
                        onClick={() => setZoomedImage(founder.image)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") setZoomedImage(founder.image);
                        }}
                      >
                        <img
                          src={founder.image}
                          alt={founder.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1F6559]/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                        <div className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-[#1F6559] opacity-0 shadow-md backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                          <ZoomIn className="h-3.5 w-3.5" aria-hidden />
                          View
                        </div>
                      </motion.div>
                    </ScrollReveal>

                    {/* Text */}
                    <ScrollReveal
                      variants={staggerContainer(stagger, delayChildren)}
                      className={`space-y-5 ${isEven ? "lg:order-2" : "lg:order-1"}`}
                    >
                      <motion.div variants={fadeUp(tr)} className="space-y-1">
                        <div className="mb-3 flex items-center gap-3">
                          <div className="h-0.5 w-8 rounded-full bg-gradient-to-r from-[#1FA7A6] to-[#78D65C]" />
                          <span className="heading-font text-xs font-semibold uppercase tracking-widest text-[#1F6559]/70">
                            Founder
                          </span>
                        </div>
                        <SplitHeading
                          text={founder.name}
                          as="h3"
                          className="heading-font text-2xl font-bold text-[#333] md:text-3xl"
                          wordDelay={0.09}
                        />
                        <p className="text-base font-semibold text-[#1FA7A6] md:text-lg">{founder.role}</p>
                      </motion.div>

                      <div className="space-y-4">
                        {founder.story.map((para, pIdx) => (
                          <motion.p
                            key={pIdx}
                            variants={fadeUp(tr)}
                            className="text-[#6F6F6F] leading-relaxed"
                          >
                            {para}
                          </motion.p>
                        ))}
                      </div>
                    </ScrollReveal>
                  </div>

                  {/* Question interlude — after first founder */}
                  {idx === 0 && (
                    <motion.div
                      className="relative mt-24 overflow-hidden rounded-3xl bg-[#1F6559] p-8 md:mt-32 md:p-14"
                      initial={{ opacity: 0, y: 40, scale: 0.97 }}
                      whileInView={{ opacity: 1, y: 0, scale: 1 }}
                      viewport={{ once: true, margin: "0px 0px -100px 0px" }}
                      transition={{ duration: 0.7, ease: EASE }}
                    >
                      <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#38C2B4]/20 blur-3xl" aria-hidden />
                      <div className="pointer-events-none absolute -bottom-12 left-8 h-48 w-48 rounded-full bg-[#78D65C]/15 blur-3xl" aria-hidden />

                      <div className="relative mx-auto max-w-4xl space-y-7 text-center">
                        <SplitHeading
                          text={q.title}
                          as="h2"
                          className="heading-font justify-center text-2xl font-bold text-white md:text-4xl"
                          wordDelay={0.07}
                        />

                        <ScrollReveal
                          variants={staggerContainer(stagger, delayChildren)}
                          className="space-y-6"
                        >
                          <motion.p variants={fadeUp(tr)} className="text-lg leading-relaxed text-white/85">
                            {q.lead}
                          </motion.p>

                          <motion.blockquote
                            variants={scaleIn(tr)}
                            className="relative overflow-hidden rounded-2xl bg-white/10 px-8 py-7 ring-1 ring-white/20 backdrop-blur-sm"
                          >
                            <Quote className="mb-3 h-6 w-6 text-[#78D65C]" aria-hidden strokeWidth={1.5} />
                            <p className="text-lg leading-relaxed text-white/95">
                              {q.villageStory.before}
                              <span className="font-bold text-[#78D65C]">{q.villageStory.emphasis}</span>
                              {q.villageStory.after}
                            </p>
                          </motion.blockquote>
                        </ScrollReveal>
                      </div>
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Journey ──────────────────────────────────────────── */}
      <section
        id="our-story-journey"
        className="relative overflow-hidden bg-gradient-to-r from-[#1FA7A6] via-[#38C2B4] to-[#78D65C] py-20 md:py-28"
      >
        <div className="pointer-events-none absolute -left-16 top-0 h-72 w-72 rounded-full bg-white/10 blur-3xl" aria-hidden />
        <div className="pointer-events-none absolute -bottom-16 right-0 h-64 w-64 rounded-full bg-[#1F6559]/20 blur-3xl" aria-hidden />

        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <SplitHeading
            text={ourStoryJourney.title}
            as="h2"
            className="heading-font mb-10 justify-center text-3xl font-bold text-white md:text-4xl lg:text-5xl"
            wordDelay={0.1}
          />

          <ScrollReveal
            variants={staggerContainer(stagger, delayChildren)}
            className="space-y-6"
          >
            {ourStoryJourney.paragraphs.map((para, i) => (
              <motion.p
                key={i}
                variants={fadeUp(tr)}
                className="text-lg leading-relaxed text-white/90"
              >
                {para}
              </motion.p>
            ))}

            <motion.div variants={scaleIn(tr)} className="pt-4">
              <div className="inline-block overflow-hidden rounded-2xl bg-white/15 px-8 py-6 ring-1 ring-white/25 backdrop-blur-sm">
                <p className="heading-font text-xl font-semibold italic text-white md:text-2xl">
                  {ourStoryJourney.closing}
                </p>
              </div>
            </motion.div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Image Zoom Dialog ────────────────────────────────── */}
      <Dialog open={!!zoomedImage} onOpenChange={() => setZoomedImage(null)}>
        <DialogContent
          id="our-story-image-dialog"
          className="max-w-[95vw] border-0 bg-transparent p-0 shadow-none outline-none md:max-w-4xl"
        >
          <AnimatePresence>
            {zoomedImage && (
              <motion.div
                className="relative"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.3, ease: EASE }}
              >
                <button
                  type="button"
                  onClick={() => setZoomedImage(null)}
                  className="absolute -top-12 right-0 z-50 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#333] shadow-lg backdrop-blur-sm transition hover:bg-white hover:scale-110"
                  aria-label="Close image"
                >
                  <X className="h-5 w-5" />
                </button>
                <img
                  src={zoomedImage}
                  alt="Zoomed view"
                  className="w-full h-auto rounded-2xl shadow-2xl"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </UserPageShell>
  );
};

export default OurStory;
