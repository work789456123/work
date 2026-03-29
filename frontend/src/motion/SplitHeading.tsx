"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

type HeadingLevel = "h1" | "h2" | "h3";
const Tags = {
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
} as const;

type SplitHeadingProps = {
  text: string;
  as?: HeadingLevel;
  className?: string;
  /** Per-word delay in seconds. Default 0.07 */
  wordDelay?: number;
};

/**
 * Heading that reveals each word individually when scrolled into view.
 * Uses `inline-flex flex-wrap` so words line-wrap naturally.
 */
export function SplitHeading({ text, as = "h2", className, wordDelay = 0.07 }: SplitHeadingProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -80px 0px" });
  const reduced = useReducedMotion();
  const Tag = Tags[as];

  return (
    <Tag
      ref={ref}
      className={cn("inline-flex flex-wrap gap-x-[0.28em] gap-y-[0.1em]", className)}
    >
      {text.split(" ").map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          className="inline-block"
          initial={reduced ? false : { opacity: 0, y: 28 }}
          animate={(inView || !!reduced) ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
          transition={{ delay: i * wordDelay, duration: 0.55, ease: EASE }}
        >
          {word}
        </motion.span>
      ))}
    </Tag>
  );
}
