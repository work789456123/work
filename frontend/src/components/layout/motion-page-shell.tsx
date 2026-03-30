"use client";

import type { ReactNode } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { usePathname } from "next/navigation";
import { fadeUp, transitionMedium, useScrollMotion } from "@/motion/scrollMotion";

export type MotionPageShellProps = HTMLMotionProps<"div"> & { children?: ReactNode };

/**
 * Page wrapper with subtle entrance animation on route change (pathname key).
 * Use when you want the old UserPageShell behavior.
 */
export default function MotionPageShell({ children, className, ...rest }: MotionPageShellProps) {
  const pathname = usePathname();
  const { t } = useScrollMotion();
  const variants = fadeUp(t(transitionMedium));

  return (
    <motion.div
      key={pathname}
      className={className}
      variants={variants}
      initial="hidden"
      animate="visible"
      {...rest}
    >
      {children}
    </motion.div>
  );
}
