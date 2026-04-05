"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { Quote } from "lucide-react";
import { meetGopu } from "@/assets/content/home";
import {
  fadeUp,
  slideInLeft,
  slideInRight,
  useScrollMotion,
  transitionMedium,
  viewportRepeat,
} from "@/motion/scrollMotion";
import { SplitHeading } from "@/motion/SplitHeading";

export default function HomeMeetGopuSection() {
  const ref = useRef(null);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(ref, viewportRepeat);
  const reduced = useReducedMotion();
  const { t, stagger, delayChildren } = useScrollMotion();
  const tr = t(transitionMedium);
  const fade = fadeUp(tr);
  const fromLeft = slideInLeft(tr);
  const fromRight = slideInRight(tr);
  const animate = reduced ? "visible" : isInView ? "visible" : "hidden";

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const videoY = useTransform(scrollYProgress, [0, 1], [60, -50]);
  const textY = useTransform(scrollYProgress, [0, 1], [40, -30]);

  const gridVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: stagger, delayChildren, when: "beforeChildren" as const } },
  };
  const textColumnVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: stagger, delayChildren } },
  };

  return (
    <section
      ref={sectionRef}
      id="home-meet-gopu"
      data-testid="meet-gopu-section"
      className="relative overflow-hidden bg-teal-100 py-28 md:py-36"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <Image
          src="/images/meet_gopu_bg_1.png"
          alt=""
          fill
          className="object-cover opacity-20 hidden md:block"
          sizes="100vw"
        />
        <Image
          src="/images/meet_gopu_bg_mobile.png"
          alt=""
          fill
          className="object-cover opacity-20 block md:hidden"
          sizes="100vw"
        />
      </div>

      <div className="relative mx-auto max-w-6xl px-6">
        <motion.div
          ref={ref}
          className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2 "
          variants={gridVariants}
          initial="hidden"
          animate={animate}
        >
          {/* Text — dark palette for contrast on light mint / decorative bg */}
          <motion.div
            className="order-1 z-10 space-y-6 lg:order-2"
            style={reduced ? {} : { y: textY }}
            variants={textColumnVariants}
          >
            <motion.p
              className="heading-font text-xs font-semibold uppercase tracking-[0.25em] text-[#1F6559]"
              variants={fade}
            >
              {meetGopu.subtitle}
            </motion.p>

            <motion.div variants={fromRight}>
              <SplitHeading
                text={meetGopu.title}
                as="h2"
                className="heading-font text-4xl font-bold text-[#1F6559] lg:text-5xl"
              />
            </motion.div>

            {meetGopu.paragraphs.map((text, i) => (
              <motion.p
                key={i}
                className="text-base leading-relaxed text-[#444] md:text-lg"
                variants={fade}
              >
                {text}
              </motion.p>
            ))}

            <motion.blockquote
              className="relative rounded-2xl border border-[#1FA7A6]/20 bg-white/85 px-6 py-5 shadow-sm backdrop-blur-sm"
              variants={fade}
            >
              <Quote className="mb-2 h-5 w-5 text-[#1FA7A6]" aria-hidden />
              <p className="heading-font text-base font-medium italic leading-relaxed text-[#333]">
                &ldquo;Warm. Caring. Always alert. Gopu feels less like a tool and more like a trusted companion.&rdquo;
              </p>
            </motion.blockquote>
          </motion.div>
          {/* Video — parallax */}
          <motion.div
            className="relative z-10 order-1 lg:order-2"
            style={reduced ? {} : { y: videoY }}
            variants={fromRight}
          >
            <div className="relative mx-auto max-w-md overflow-hidden rounded-3xl shadow-2xl shadow-black/20">
              <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-white/30 via-transparent to-white/10 pointer-events-none" />
              <video
                src={meetGopu.videoSrc}
                autoPlay
                loop
                muted
                playsInline
                className="relative h-[575px] w-full object-cover"
              />
            </div>
          </motion.div>

          
        </motion.div>
      </div>
    </section>
  );
}
