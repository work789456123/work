"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface VideoIntroProps {
  /** Called when the intro finishes (video ends or user skips). */
  onComplete: () => void;
}

/**
 * Full-screen video intro overlay.
 * Plays gopu.mp4 once, then fades out and calls onComplete.
 * The user can also skip at any time.
 */
export default function VideoIntro({ onComplete }: VideoIntroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [visible, setVisible] = useState(true);
  const [showSkip, setShowSkip] = useState(false);

  // Show the skip button after 1.5 s so it doesn't flash immediately
  useEffect(() => {
    const t = setTimeout(() => setShowSkip(true), 1500);
    return () => clearTimeout(t);
  }, []);

  const handleFinish = () => {
    if (!visible) return;
    setVisible(false);
    // Give the exit animation time to complete before unmounting
    setTimeout(onComplete, 700);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="video-intro"
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.5, ease: "easeOut" } }}
          exit={{ opacity: 0, transition: { duration: 0.7, ease: "easeInOut" } }}
        >
          {/* Video */}
          <video
            ref={videoRef}
            src="/gopu.mp4"
            autoPlay
            muted
            playsInline
            onEnded={handleFinish}
            className="h-full w-full object-contain md:object-cover"
          />

          {/* Subtle vignette overlay */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55) 100%)",
            }}
          />

          {/* Skip button */}
          <AnimatePresence>
            {showSkip && (
              <motion.button
                key="skip-btn"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }}
                exit={{ opacity: 0, transition: { duration: 0.2 } }}
                onClick={handleFinish}
                className="absolute bottom-4 right-4 md:bottom-8 md:right-8 flex items-center gap-2 rounded-full border border-white/30 bg-black/40 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20 active:scale-95"
              >
                Skip
                {/* Chevron right */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                    clipRule="evenodd"
                  />
                </svg>
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
