"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, ChevronDown, Globe } from "lucide-react";
import { blogHero, blogArticle, blogFaqs } from "@/assets/content/blog_detail";
import { blogsHeader } from "@/assets/content/blogs";
import UserPageShell from "@/motion/UserPageShell";
import { SplitHeading } from "@/motion/SplitHeading";
import ScrollReveal from "@/motion/ScrollReveal";
import {
  useScrollMotion,
  transitionMedium,
  transitionShort,
  staggerContainer,
  fadeUp,
  slideInLeft,
  slideInRight,
  scaleIn,
} from "@/motion/scrollMotion";
import type { BlogLocalizedCopy } from "@/types/blog";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

const BlogDetails = () => {
  const [language, setLanguage] = useState("en");
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const { t: motion_t, stagger, delayChildren } = useScrollMotion();
  const tr = motion_t(transitionMedium);
  const trShort = motion_t(transitionShort);
  const lc = (o: BlogLocalizedCopy) => o[language] ?? o.en;
  const art = blogArticle;

  const toggleFAQ = (index: number) =>
    setOpenFAQ(openFAQ === index ? null : index);

  return (
    <UserPageShell id="page-blog-detail" className="min-h-screen bg-white">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section
        id="blog-detail-hero"
        className="relative overflow-hidden bg-gradient-to-r from-[#1FA7A6] via-[#38C2B4] to-[#78D65C] pb-24 pt-12 md:pt-16"
      >
        <div
          className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute right-8 top-8 h-56 w-56 rounded-full bg-[#1F6559]/20 blur-3xl"
          aria-hidden
        />

        <div
          id="blog-detail-hero-inner"
          className="relative mx-auto max-w-7xl px-6 pb-0"
        >
          {/* Back link */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="mb-8"
          >
            <Link
              href="/blogs"
              className="inline-flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/25 backdrop-blur-sm transition hover:bg-white/25"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
              {blogsHeader.title}
            </Link>
          </motion.div>

          <div className="grid items-end gap-10 lg:grid-cols-2 lg:gap-14">
            {/* Text column */}
            <div className="order-1 space-y-6 pb-10">
              {/* Language toggle */}
              <motion.div
                id="blog-detail-lang-toggle"
                className="flex items-center gap-2"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.45, ease: EASE }}
              >
                <Globe className="h-4 w-4 text-white/70" aria-hidden />
                {(["en", "hi"] as const).map((lang) => (
                  <button
                    key={lang}
                    id={`blog-detail-lang-${lang}`}
                    type="button"
                    onClick={() => setLanguage(lang)}
                    className={cn(
                      "heading-font rounded-full px-4 py-1.5 text-xs font-semibold transition-all",
                      language === lang
                        ? "bg-white text-[#1F6559] shadow-md"
                        : "bg-white/15 text-white ring-1 ring-white/25 hover:bg-white/25"
                    )}
                  >
                    {blogHero.langButtons[lang]}
                  </button>
                ))}
              </motion.div>

              <SplitHeading
                text={lc(blogHero.title)}
                as="h1"
                className="heading-font text-3xl font-bold leading-tight text-white md:text-4xl"
                wordDelay={0.05}
              />

              <motion.p
                className="text-lg leading-relaxed text-white/90"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.55, ease: EASE }}
              >
                {lc(blogHero.subtitle)}
              </motion.p>
            </div>

            {/* Image column — bleeds into section below */}
            <motion.div
              className="order-2 overflow-hidden rounded-3xl shadow-2xl shadow-[#1F6559]/30"
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.65, ease: EASE }}
            >
              <img
                src={blogHero.imageSrc}
                alt={blogHero.imageAlt}
                className="aspect-[16/10] w-full object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Article ───────────────────────────────────────────── */}
      <section id="blog-detail-article" className="bg-[#FAFAFA] py-16 ">
        <div className="mx-auto max-w-7xl px-6">
          <div className="rounded-2xl border border-[#E8EEEB] bg-white p-8 shadow-sm md:p-12">

            {/* Intro */}
            <ArticleSection
              heading={lc(art.intro.heading)}
              stagger={stagger}
              delayChildren={delayChildren}
              tr={tr}
            >
              {art.intro.paragraphs.map((p, i) => (
                <motion.p key={i} variants={fadeUp(tr)} className="text-[#6F6F6F] leading-relaxed">
                  {lc(p)}
                </motion.p>
              ))}
            </ArticleSection>

            {/* AI section */}
            <ArticleSection
              heading={lc(art.aiSection.heading)}
              stagger={stagger}
              delayChildren={delayChildren}
              tr={tr}
            >
              {art.aiSection.paragraphs.map((p, i) => (
                <motion.p key={i} variants={fadeUp(tr)} className="text-[#6F6F6F] leading-relaxed">
                  {lc(p)}
                </motion.p>
              ))}
            </ArticleSection>

            {/* Pet section */}
            <ArticleSection
              heading={lc(art.petSection.heading)}
              stagger={stagger}
              delayChildren={delayChildren}
              tr={tr}
            >
              <motion.p variants={fadeUp(tr)} className="text-[#6F6F6F] leading-relaxed">
                {lc(art.petSection.lead)}
              </motion.p>
              <ScrollReveal
                variants={staggerContainer(stagger, delayChildren)}
                className="ml-1 space-y-3"
              >
                {art.petSection.bullets.map((b, i) => (
                  <motion.div
                    key={i}
                    variants={slideInLeft(tr)}
                    className="flex items-start gap-3"
                  >
                    <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-gradient-to-br from-[#1FA7A6] to-[#1F6559]" />
                    <span className="text-[#4A4A4A]">{lc(b)}</span>
                  </motion.div>
                ))}
              </ScrollReveal>
            </ArticleSection>

            {/* Dairy section */}
            <ArticleSection
              heading={lc(art.dairySection.heading)}
              stagger={stagger}
              delayChildren={delayChildren}
              tr={tr}
            >
              <motion.p variants={fadeUp(tr)} className="text-[#6F6F6F] leading-relaxed">
                {lc(art.dairySection.paragraph)}
              </motion.p>
            </ArticleSection>

            {/* FAQ */}
            <div className="mt-12">
              <div id="blog-detail-faq-title">
                <SplitHeading
                  text={lc(art.faqTitle)}
                  as="h2"
                  className="heading-font mb-6 text-2xl font-bold text-[#333] md:text-3xl"
                  wordDelay={0.08}
                />
              </div>

              <div id="blog-detail-faq-list" className="space-y-3">
                {blogFaqs.map((faq, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "0px 0px -60px 0px" }}
                    transition={{ delay: index * 0.07, duration: 0.5, ease: EASE }}
                    className={cn(
                      "overflow-hidden rounded-2xl border transition-colors",
                      openFAQ === index
                        ? "border-[#1F6559]/30 bg-[#1F6559]/[0.03]"
                        : "border-[#E8EEEB] bg-white"
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => toggleFAQ(index)}
                      className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left"
                      aria-expanded={openFAQ === index}
                    >
                      <span className="heading-font font-semibold text-[#333]">
                        {lc(faq.question)}
                      </span>
                      <motion.span
                        animate={{ rotate: openFAQ === index ? 180 : 0 }}
                        transition={{ duration: 0.3, ease: EASE }}
                        className="shrink-0 text-[#1F6559]"
                      >
                        <ChevronDown className="h-5 w-5" aria-hidden />
                      </motion.span>
                    </button>

                    <AnimatePresence initial={false}>
                      {openFAQ === index && (
                        <motion.div
                          key="faq-answer"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: EASE }}
                          className="overflow-hidden"
                        >
                          <p className="border-t border-[#E8EEEB] px-6 py-4 text-[#6F6F6F] leading-relaxed">
                            {lc(faq.answer)}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Conclusion */}
            <ArticleSection
              heading={lc(art.conclusion.heading)}
              stagger={stagger}
              delayChildren={delayChildren}
              tr={tr}
              className="mt-12"
            >
              <motion.p variants={fadeUp(tr)} className="text-[#6F6F6F] leading-relaxed">
                {lc(art.conclusion.paragraph)}
              </motion.p>
            </ArticleSection>
          </div>
        </div>
      </section>
    </UserPageShell>
  );
};

type ArticleSectionProps = {
  heading: string;
  stagger: number;
  delayChildren: number;
  tr: object;
  className?: string;
  children: React.ReactNode;
};

function ArticleSection({ heading, stagger, delayChildren, tr, className, children }: ArticleSectionProps) {
  return (
    <div className={cn("mt-10 first:mt-0", className)}>
      <SplitHeading
        text={heading}
        as="h2"
        className="heading-font mb-4 text-xl font-bold text-[#333] md:text-2xl"
        wordDelay={0.07}
      />
      <ScrollReveal
        variants={staggerContainer(stagger, delayChildren)}
        className="space-y-4"
      >
        {children}
      </ScrollReveal>
    </div>
  );
}

export default BlogDetails;
