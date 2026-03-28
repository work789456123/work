import { useReducedMotion } from "framer-motion";

/** Shared easing (smooth ease-out). */
export const homeEase = [0.22, 1, 0.36, 1];

/** Fire animation only the first time the element enters the viewport. */
export const viewportOnce = {
  once: true,
  amount: 0.2,
  margin: "0px 0px -48px 0px",
};

/** Replay enter/exit when scrolling past and back. */
export const viewportRepeat = {
  once: false,
  amount: 0.2,
  margin: "0px 0px -48px 0px",
};

export const transitionShort = { duration: 0.45, ease: homeEase };
export const transitionMedium = { duration: 0.55, ease: homeEase };
export const transitionSpring = { type: "spring", stiffness: 380, damping: 30 };

export function useScrollMotion() {
  const reduced = useReducedMotion();
  const t = (base) => (reduced ? { duration: 0 } : base);
  const stagger = reduced ? 0 : 0.11;
  const delayChildren = reduced ? 0 : 0.06;
  return { reduced, t, stagger, delayChildren };
}

export const staggerContainer = (stagger, delayChildren) => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: stagger, delayChildren, when: "beforeChildren" },
  },
});

export const fadeUp = (transition) => ({
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition,
  },
});

export const fadeIn = (transition) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition,
  },
});

export const slideInRight = (transition) => ({
  hidden: { opacity: 0, x: 48 },
  visible: {
    opacity: 1,
    x: 0,
    transition,
  },
});

export const slideInLeft = (transition) => ({
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition,
  },
});

export const scaleIn = (transition) => ({
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition,
  },
});
