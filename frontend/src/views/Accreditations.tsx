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
import UserPageShell from "@/motion/UserPageShell";
import PageTitle from "@/components/PageTitle";

const EASE = [0.22, 1, 0.36, 1] as const;
const certIcons = [Shield, Award, CheckCircle2, Star, Medal, Trophy];

function CertPlaceholder({ index }: { index: number }) {
  const Icon = certIcons[index % certIcons.length];
  return (
    <div className="flex flex-col items-center justify-center gap-3 p-6">
      <div className="rounded-2xl border border-[#E8EEEB] bg-gradient-to-br from-[#1FA7A6]/10 to-[#1F6559]/5 p-6">
        <Icon className="h-14 w-14 text-[#1F6559]" strokeWidth={1.25} />
      </div>
      <span className="text-center text-xs font-medium text-[#6F6F6F]/50">
        Certificate Image
      </span>
    </div>
  );
}

export default function Accreditations() {
  const { t, stagger, delayChildren } = useScrollMotion();
  const tr = t(transitionMedium);

  return (
    <UserPageShell id="page-accreditations" className="min-h-screen">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <PageTitle id="accreditations-hero">
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <motion.div
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#1F6559]/20 bg-[#1F6559]/10 px-4 py-1.5"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <Award className="h-4 w-4 text-[#1F6559]" strokeWidth={1.75} />
            <span className="text-sm font-medium tracking-wide text-[#1F6559]">
              Certified & Recognised
            </span>
          </motion.div>

          <SplitHeading
            text={aboutAccreditations.title}
            as="h1"
            className="heading-font justify-center text-4xl font-bold text-[#1F6559] md:text-5xl lg:text-6xl"
            wordDelay={0.1}
          />

          <motion.p
            className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-[#1F6559]/70"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.55, ease: EASE }}
          >
            {aboutAccreditations.subtitle}
          </motion.p>
        </div>
      </PageTitle>

      {/* ── Certificates Grid ─────────────────────────────────── */}
      <section
        id="accreditations-grid"
        className="bg-teal-50 relative overflow-hidden py-20 md:py-28"
      >
        {/* Paw texture — same as other sections */}
        <PawTexture />

        <div className="relative z-10 mx-auto max-w-6xl px-6">
          <ScrollReveal
            variants={staggerContainer(stagger * 1.1, delayChildren)}
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {aboutAccreditations.certificates.map((cert, i) => (
              <motion.div
                key={cert.name}
                variants={scaleIn(tr)}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-[#E8EEEB] bg-[#FAFAFA] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#1F6559]/30 hover:shadow-md"
              >
                {/* Image / placeholder area */}
                <div className="relative flex h-48 w-full items-center justify-center overflow-hidden border-b border-[#E8EEEB] bg-white">
                  <CertPlaceholder index={i} />
                  {/* Index badge */}
                  <span className="absolute left-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-[#1FA7A6]/15 text-xs font-semibold text-[#1F6559]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                {/* Text */}
                <div className="flex flex-1 flex-col gap-2 p-5">
                  <h3 className="heading-font text-base font-semibold leading-snug text-[#333]">
                    {cert.name}
                  </h3>
                  <p className="text-sm leading-relaxed text-[#6F6F6F]">
                    {cert.description}
                  </p>
                </div>

                {/* Hover accent line */}
                <div className="h-0.5 w-0 bg-gradient-to-r from-[#1FA7A6] to-[#1F6559] transition-all duration-300 group-hover:w-full" />
              </motion.div>
            ))}
          </ScrollReveal>
        </div>
      </section>
    </UserPageShell>
  );
}
