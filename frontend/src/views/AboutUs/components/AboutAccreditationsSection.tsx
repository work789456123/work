"use client";

import { motion } from "framer-motion";
import { Award, Shield, Star, CheckCircle2, Medal, Trophy } from "lucide-react";
import { aboutAccreditations } from "@/assets/content/about";
import { SplitHeading } from "@/motion/SplitHeading";
import {
  useScrollMotion,
  transitionMedium,
  staggerContainer,
  scaleIn,
} from "@/motion/scrollMotion";
import ScrollReveal from "@/motion/ScrollReveal";
import PawTexture from "@/components/PawTexture";

const certIcons = [Shield, Award, CheckCircle2, Star, Medal, Trophy];

function CertPlaceholder({ index, name }: { index: number; name: string }) {
  const Icon = certIcons[index % certIcons.length];
  return (
    <div className="flex flex-col items-center justify-center gap-3 p-6">
      <div className="rounded-2xl border border-[#1FA7A6]/20 bg-gradient-to-br from-[#1FA7A6]/10 to-[#1F6559]/5 p-6">
        <Icon className="h-14 w-14 text-[#1FA7A6]" strokeWidth={1.25} />
      </div>
      <span className="text-center text-xs font-medium text-[#a8d5d0]/60">
        Certificate Placeholder
      </span>
    </div>
  );
}

export default function AboutAccreditationsSection() {
  const { t, stagger, delayChildren } = useScrollMotion();
  const tr = t(transitionMedium);

  return (
    <section
      id="about-accreditations"
      className="relative overflow-hidden py-20 md:py-28"
      style={{
        background:
          "linear-gradient(135deg, #0d3d35 0%, #1F6559 45%, #1a5c52 70%, #0f4a40 100%)",
      }}
    >
      {/* Subtle radial glow */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 40%, rgba(31,167,166,0.18) 0%, transparent 70%)",
        }}
      />

      {/* Paw texture with teal tint */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-10">
        <PawTexture />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="mb-14 text-center">
          <motion.div
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#1FA7A6]/40 bg-[#1FA7A6]/10 px-4 py-1.5"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -60px 0px" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <Award className="h-4 w-4 text-[#1FA7A6]" strokeWidth={1.75} />
            <span className="text-sm font-medium tracking-wide text-[#1FA7A6]">
              Certified & Recognised
            </span>
          </motion.div>

          <SplitHeading
            text={aboutAccreditations.title}
            as="h2"
            className="heading-font mb-4 justify-center text-3xl font-bold text-white md:text-4xl"
            wordDelay={0.09}
          />

          <motion.p
            className="mx-auto max-w-2xl text-base leading-relaxed text-[#a8d5d0]"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -60px 0px" }}
            transition={{ delay: 0.35, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            {aboutAccreditations.subtitle}
          </motion.p>
        </div>

        {/* Certificate Cards */}
        <ScrollReveal
          variants={staggerContainer(stagger * 1.1, delayChildren)}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {aboutAccreditations.certificates.map((cert, i) => (
            <motion.div
              key={cert.name}
              variants={scaleIn(tr)}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#1FA7A6]/50 hover:bg-white/10 hover:shadow-[0_8px_32px_rgba(31,167,166,0.2)]"
            >
              {/* Certificate image area */}
              <div className="relative flex h-44 w-full items-center justify-center overflow-hidden border-b border-white/10 bg-white/[0.04]">
                <CertPlaceholder index={i} name={cert.name} />

                {/* Index badge */}
                <span className="absolute left-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-[#1FA7A6]/20 text-xs font-semibold text-[#1FA7A6]">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>

              {/* Text content */}
              <div className="flex flex-1 flex-col gap-2 p-5">
                <h3 className="heading-font text-base font-semibold leading-snug text-white">
                  {cert.name}
                </h3>
                <p className="text-sm leading-relaxed text-[#a8d5d0]">
                  {cert.description}
                </p>
              </div>

              {/* Bottom accent line */}
              <div className="h-0.5 w-0 bg-gradient-to-r from-[#1FA7A6] to-[#1F6559] transition-all duration-300 group-hover:w-full" />
            </motion.div>
          ))}
        </ScrollReveal>
      </div>
    </section>
  );
}
