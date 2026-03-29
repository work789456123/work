import type { ReactNode } from "react";
import { motion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";
import { useLocation } from "react-router-dom";
import { fadeUp, transitionMedium, useScrollMotion } from "./scrollMotion";

type UserPageShellProps = HTMLMotionProps<"div"> & { children?: ReactNode };

/**
 * Subtle page entrance on route change (pathname key remounts animation).
 */
export default function UserPageShell({ children, className, ...rest }: UserPageShellProps) {
  const { pathname } = useLocation();
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
