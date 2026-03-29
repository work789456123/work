"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { brand } from "@/assets/content/shared/brand";

const MIN_VISIBLE_MS = 550;
const MAX_WAIT_MS = 14_000;

/**
 * Full-screen splash while the document finishes loading (window `load`).
 * Dismisses after at least MIN_VISIBLE_MS so the brand moment is visible.
 */
export function SiteLoadingScreen() {
  const [visible, setVisible] = useState(true);
  const reduced = useReducedMotion();
  const dismissed = useRef(false);
  const minTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const startedAt = Date.now();

    const dismiss = () => {
      if (dismissed.current) return;
      dismissed.current = true;

      const elapsed = Date.now() - startedAt;
      const wait = Math.max(0, MIN_VISIBLE_MS - elapsed);
      minTimerRef.current = window.setTimeout(() => {
        setVisible(false);
        document.body.style.overflow = prevOverflow || "";
        minTimerRef.current = null;
      }, wait);
    };

    let maxTimer: number | null = window.setTimeout(dismiss, MAX_WAIT_MS);

    const onLoad = () => {
      if (maxTimer) {
        window.clearTimeout(maxTimer);
        maxTimer = null;
      }
      dismiss();
    };

    if (document.readyState === "complete") {
      if (maxTimer) {
        window.clearTimeout(maxTimer);
        maxTimer = null;
      }
      dismiss();
    } else {
      window.addEventListener("load", onLoad, { once: true });
    }

    return () => {
      window.removeEventListener("load", onLoad);
      if (maxTimer) window.clearTimeout(maxTimer);
      if (minTimerRef.current) window.clearTimeout(minTimerRef.current);
      document.body.style.overflow = prevOverflow || "";
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="status"
          aria-live="polite"
          aria-busy="true"
          data-testid="site-loading-screen"
          className="fixed inset-0 z-[10000] flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#1F6559] via-[#1FA7A6] to-[#38C2B4]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0.15 : 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="sr-only">Loading {brand.name}</span>

          {/* Decorative orbs */}
          <div className="pointer-events-none absolute inset-0" aria-hidden>
            <div className="absolute -left-20 top-1/4 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -right-16 bottom-1/3 h-64 w-64 rounded-full bg-[#78D65C]/20 blur-3xl" />
          </div>

          <div className="relative z-10 flex flex-col items-center gap-8 px-6">
            <motion.div
              className="relative flex h-28 w-28 items-center justify-center rounded-3xl bg-white/15 p-4 shadow-xl backdrop-blur-sm ring-1 ring-white/25"
              initial={reduced ? false : { scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div
                className="flex h-20 w-auto items-center justify-center"
                aria-hidden
                animate={
                  reduced
                    ? {}
                    : {
                        scale: [1, 1.04, 1],
                      }
                }
                transition={{
                  duration: 1.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Image
                  src="/pvhalflogo.png"
                  alt=""
                  width={160}
                  height={64}
                  className="h-20 w-auto object-contain drop-shadow-md"
                  priority
                />
              </motion.div>
            </motion.div>

            <div className="text-center">
              <p className="heading-font text-2xl font-bold tracking-tight text-white md:text-3xl">{brand.name}</p>
              <p className="mt-2 max-w-xs text-sm text-white/80">{brand.tagline}</p>
            </div>

            {/* Indeterminate bar */}
            <div className="relative h-1 w-48 overflow-hidden rounded-full bg-white/20 md:w-56">
              <motion.div
                className="absolute top-0 h-full w-20 rounded-full bg-white/90"
                initial={{ left: "-20%" }}
                animate={reduced ? { left: "40%" } : { left: ["-20%", "100%"] }}
                transition={
                  reduced
                    ? { duration: 0.2 }
                    : { duration: 1.15, repeat: Infinity, ease: "easeInOut" }
                }
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
