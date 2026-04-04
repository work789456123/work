"use client";

import Image from "next/image";
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
          : { ...transitionSpring, delay: 2.5 }
      }
      whileHover={reduced ? {} : { scale: 1.08 }}
      whileTap={reduced ? {} : { scale: 0.95 }}
    >
      <div className="absolute inset-0 bg-[#25D366] rounded-full opacity-20 animate-ping [animation-duration:3s]" />
      <div className="absolute inset-0 bg-[#25D366] rounded-full opacity-25 shadow-[0_0_10px_rgba(37,211,102,0.6)] animate-pulse [animation-duration:2.5s]" />
      <Image
        src="/images/whatsappicon.png"
        alt=""
        width={92}
        height={92}
        className="relative h-16 w-14 drop-shadow-xl"
        aria-hidden
      />
    </motion.a>
  );
}
