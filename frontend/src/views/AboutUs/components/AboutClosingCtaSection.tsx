"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { aboutCta } from "@/assets/content/about";
import { SplitHeading } from "@/motion/SplitHeading";
import { useScrollMotion, transitionMedium, staggerContainer, fadeUp } from "@/motion/scrollMotion";
import ScrollReveal from "@/motion/ScrollReveal";
import Image from "next/image";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function AboutClosingCtaSection() {
  const { t, stagger, delayChildren } = useScrollMotion();
  const tr = t(transitionMedium);

  return (
    <section
      id="about-closing-cta"
      className="relative overflow-hidden bg-teal-500 py-24 md:py-32"
    >
      <div className="pointer-events-none absolute inset-0 z-0">
        <Image
          src="/images/contact_bg.png"
          alt=""
          fill
          className="object-cover opacity-30"
          sizes="100vw"
          priority
        />
      </div>
      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <motion.div
          className="mb-4 flex justify-center"
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true, margin: "0px 0px -80px 0px" }}
          transition={{ duration: 0.55, ease: EASE }}
        >
          <div className="h-1 w-12 rounded-full bg-white/60" />
        </motion.div>

        <SplitHeading
          text={aboutCta.title}
          as="h2"
          className="heading-font mb-10 justify-center text-4xl font-bold text-white md:text-5xl"
          wordDelay={0.09}
        />

        <ScrollReveal
          variants={staggerContainer(stagger * 0.8, delayChildren)}
          className="mb-10 space-y-2"
        >
          {aboutCta.lines.map((line) => (
            <motion.p
              key={line}
              variants={fadeUp(tr)}
              className="heading-font text-2xl font-semibold text-white/90 md:text-3xl"
            >
              {line}
            </motion.p>
          ))}
        </ScrollReveal>

        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "0px 0px -80px 0px" }}
          transition={{ delay: 0.5, duration: 0.55, ease: EASE }}
        >
          <Button
            asChild
            size="lg"
            className="heading-font h-14 rounded-2xl bg-white px-8 text-base font-semibold text-[#1F6559] shadow-xl shadow-[#1F6559]/20 transition hover:-translate-y-0.5 hover:bg-white/95 hover:shadow-2xl"
          >
            <Link href={aboutCta.path} className="flex items-center gap-2">
              {aboutCta.button}
              <ArrowRight className="h-5 w-5" strokeWidth={2} />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
