"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { meetGopu } from "@/assets/content/home";
import {
  fadeUp,
  slideInLeft,
  slideInRight,
  useScrollMotion,
  transitionMedium,
  viewportRepeat,
} from "@/motion/scrollMotion";

export default function HomeMeetGopuSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, viewportRepeat);
  const { t, stagger, delayChildren, reduced } = useScrollMotion();
  const tr = t(transitionMedium);
  const fade = fadeUp(tr);
  const fromLeft = slideInLeft(tr);
  const fromRight = slideInRight(tr);
  const animate = reduced ? "visible" : isInView ? "visible" : "hidden";

  const gridVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: stagger, delayChildren, when: "beforeChildren" },
    },
  };
  const textColumnVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: stagger, delayChildren },
    },
  };

  return (
    <section id="home-meet-gopu" className="py-24 bg-teal-50" data-testid="meet-gopu-section">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          ref={ref}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          variants={gridVariants}
          initial="hidden"
          animate={animate}
        >
          <motion.div className="order-2 lg:order-1" variants={fromLeft}>
            <video
              src={meetGopu.videoSrc}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-auto object-cover max-w-md mx-auto rounded-3xl"
            />
          </motion.div>
          <motion.div className="order-1 lg:order-2 space-y-6" variants={textColumnVariants}>
            <motion.h2
              className="heading-font text-4xl lg:text-5xl font-bold text-[#333]"
              variants={fromRight}
            >
              {meetGopu.title}
            </motion.h2>
            <motion.p className="text-sm font-medium text-[#1F6559]" variants={fade}>
              {meetGopu.subtitle}
            </motion.p>
            {meetGopu.paragraphs.map((text, i) => (
              <motion.p key={i} className="text-lg text-[#6F6F6F] leading-relaxed" variants={fade}>
                {text}
              </motion.p>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
