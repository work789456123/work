"use client";

import { motion, useReducedMotion } from "framer-motion";
import { whatsapp } from "@/assets/content/home";
import { transitionSpring } from "@/motion/scrollMotion";

export default function HomeWhatsappFloatingButton() {
  const reduced = useReducedMotion();

  return (
    <motion.a
      id="home-whatsapp-fab"
      href={whatsapp.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={whatsapp.imageAlt}
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center group"
      initial={{ opacity: 0, scale: 0.6, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={
        reduced
          ? { duration: 0 }
          : { ...transitionSpring, delay: 0.9 }
      }
      whileHover={reduced ? {} : { scale: 1.08 }}
      whileTap={reduced ? {} : { scale: 0.95 }}
    >
      <div className="absolute inset-0 bg-[#25D366] rounded-full animate-ping opacity-20 group-hover:opacity-40 transition-opacity duration-300" />
      <div className="absolute inset-0 bg-[#25D366] rounded-full animate-pulse opacity-30 shadow-[0_0_15px_rgba(37,211,102,0.8)]" />
      <img
        src={whatsapp.imageUrl}
        alt=""
        aria-hidden
        className="relative w-14 h-14 drop-shadow-xl"
      />
    </motion.a>
  );
}
