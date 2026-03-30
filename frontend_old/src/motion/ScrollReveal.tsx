import { useRef, type ReactNode } from "react";
import { motion, useInView } from "framer-motion";
import type { HTMLMotionProps, Variants } from "framer-motion";
import { useScrollMotion, viewportRepeat } from "./scrollMotion";

type ScrollRevealProps = Omit<HTMLMotionProps<"div">, "children" | "variants"> & {
  variants: Variants;
  children?: ReactNode;
  viewportOptions?: NonNullable<Parameters<typeof useInView>[1]>;
};

/**
 * Reveals when in view; returns to `hidden` when scrolled away (unless reduced motion).
 */
export default function ScrollReveal({ variants, className, children, viewportOptions, ...rest }: ScrollRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, viewportOptions ?? viewportRepeat);
  const { reduced } = useScrollMotion();
  const animate = reduced ? "visible" : isInView ? "visible" : "hidden";

  return (
    <motion.div ref={ref} className={className} variants={variants} initial="hidden" animate={animate} {...rest}>
      {children}
    </motion.div>
  );
}
