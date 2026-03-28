import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useScrollMotion, viewportRepeat } from "./scrollMotion";

/**
 * Reveals when in view; returns to `hidden` when scrolled away (unless reduced motion).
 */
export default function ScrollReveal({ variants, className, children, viewportOptions, ...rest }) {
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
