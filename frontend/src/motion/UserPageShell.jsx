import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { fadeUp, transitionMedium, useScrollMotion } from "./scrollMotion";

/**
 * Subtle page entrance on route change (pathname key remounts animation).
 */
export default function UserPageShell({ children, className, ...rest }) {
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
