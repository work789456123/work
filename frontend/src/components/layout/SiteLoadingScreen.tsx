"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { brand } from "@/assets/content/shared/brand";

const MIN_VISIBLE_MS = 550;
const MAX_WAIT_MS = 14_000;

/**
 * Full-screen splash: animations are CSS-driven so they run as soon as styles load (not after hydration).
 * Dismisses after DOMContentLoaded + MIN_VISIBLE_MS (does not wait for window `load` / every asset).
 */
export function SiteLoadingScreen() {
  const [phase, setPhase] = useState<"show" | "exiting">("show");
  const [renderOverlay, setRenderOverlay] = useState(true);
  const dismissed = useRef(false);
  const exitingRef = useRef(false);
  const minTimerRef = useRef<number | null>(null);
  const prevOverflowRef = useRef("");

  useEffect(() => {
    prevOverflowRef.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const startedAt = Date.now();

    const beginExit = () => {
      if (exitingRef.current) return;
      exitingRef.current = true;
      setPhase("exiting");
    };

    const dismiss = () => {
      if (dismissed.current) return;
      dismissed.current = true;

      const elapsed = Date.now() - startedAt;
      const wait = Math.max(0, MIN_VISIBLE_MS - elapsed);
      minTimerRef.current = window.setTimeout(() => {
        beginExit();
        minTimerRef.current = null;
      }, wait);
    };

    let maxTimer: number | null = window.setTimeout(dismiss, MAX_WAIT_MS);

    const onDomReady = () => {
      if (maxTimer) {
        window.clearTimeout(maxTimer);
        maxTimer = null;
      }
      dismiss();
    };

    // DOMContentLoaded: HTML parsed; app shell can show without waiting for all images (window `load`).
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", onDomReady, { once: true });
    } else {
      onDomReady();
    }

    return () => {
      document.removeEventListener("DOMContentLoaded", onDomReady);
      if (maxTimer) window.clearTimeout(maxTimer);
      if (minTimerRef.current) window.clearTimeout(minTimerRef.current);
      if (!exitingRef.current) {
        document.body.style.overflow = prevOverflowRef.current || "";
      }
    };
  }, []);

  const handleTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    if (e.propertyName !== "opacity") return;
    if (!exitingRef.current) return;
    exitingRef.current = false;
    setRenderOverlay(false);
    document.body.style.overflow = prevOverflowRef.current || "";
  };

  if (!renderOverlay) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy={phase === "show"}
      data-testid="site-loading-screen"
      className={cn(
        "fixed inset-0 z-[10000] flex flex-col items-center justify-center overflow-hidden bg-teal-500/60 backdrop-blur-lg transition-opacity duration-300 ease-out motion-reduce:duration-150",
        phase === "exiting" ? "pointer-events-none opacity-0" : "opacity-100",
      )}
      onTransitionEnd={handleTransitionEnd}
    >
      <span className="sr-only">Loading {brand.name}</span>

      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -left-20 top-1/4 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -right-16 bottom-1/3 h-64 w-64 rounded-full bg-[#78D65C]/20 blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8 px-6">
        <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-white/15 p-4 shadow-xl backdrop-blur-sm ring-1 ring-white/25">
          <div className="site-loader-logo flex h-20 w-auto items-center justify-center" aria-hidden>
            <Image
              src="/pvhalflogo.png"
              alt=""
              width={160}
              height={64}
              className="h-20 w-auto object-contain drop-shadow-md"
              priority
            />
          </div>
        </div>

        <div className="text-center">
          <p className="heading-font text-2xl font-bold tracking-tight text-white md:text-3xl">{brand.name}</p>
          <p className="mt-2 max-w-xs text-sm text-white/80">{brand.tagline}</p>
        </div>

        <div className="relative h-1 w-48 overflow-hidden rounded-full bg-white/20 md:w-56">
          <div className="site-loader-shimmer-inner" aria-hidden />
        </div>
      </div>
    </div>
  );
}
