"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Clock } from "lucide-react";
import { blogsHeader, blogList } from "@/assets/content/blogs";
import { brand } from "@/assets/content/shared/brand";
import MotionPageShell from "@/components/layout/motion-page-shell";
import { SplitHeading } from "@/motion/SplitHeading";
import ScrollReveal from "@/motion/ScrollReveal";
import {
  useScrollMotion,
  transitionMedium,
  transitionShort,
  staggerContainer,
  fadeUp,
  scaleIn,
} from "@/motion/scrollMotion";

const EASE = [0.22, 1, 0.36, 1] as const;

const Blogs = () => {
  const h = blogsHeader;
  const { t, stagger, delayChildren } = useScrollMotion();
  const tr = t(transitionMedium);
  const trShort = t(transitionShort);

  return (
    <MotionPageShell id="page-blogs" className="min-h-screen bg-white">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#1FA7A6] via-[#38C2B4] to-[#78D65C] py-24 md:py-32">
        <div
          className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-white/10 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-20 right-8 h-64 w-64 rounded-full bg-[#1F6559]/20 blur-3xl"
          aria-hidden
        />

        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <motion.p
            className="heading-font mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-white/85"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            {h.eyebrow}
          </motion.p>

          <SplitHeading
            text={h.title}
            as="h1"
            className="heading-font justify-center text-4xl font-bold text-white md:text-5xl lg:text-6xl"
            wordDelay={0.1}
          />

          <motion.p
            className="mx-auto mt-5 max-w-xl text-lg text-white/90"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.55, ease: EASE }}
          >
            {h.subtitle}
          </motion.p>

          <motion.div
            className="mt-8 flex justify-center"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.9, duration: 0.55, ease: EASE }}
          >
            <div className="h-0.5 w-14 rounded-full bg-white/60" />
          </motion.div>
        </div>
      </section>

      {/* ── Blog grid ─────────────────────────────────────────── */}
      <section id="blogs-inner" className="bg-[#FAFAFA] py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <ScrollReveal
            id="blogs-grid"
            variants={staggerContainer(stagger * 1.4, delayChildren)}
            className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {blogList.map((blog) => (
              <motion.article
                id={`blogs-card-${blog.id}`}
                key={blog.id}
                variants={scaleIn(trShort)}
                className="group flex flex-col overflow-hidden rounded-2xl border border-[#E8EEEB] bg-white shadow-sm transition-all hover:-translate-y-1 hover:border-[#1F6559]/20 hover:shadow-xl"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {"tag" in blog && blog.tag && (
                    <span className="heading-font absolute left-3 top-3 rounded-full bg-[#1F6559]/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white shadow-sm backdrop-blur-sm">
                      {blog.tag}
                    </span>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-5">
                  {"readTime" in blog && blog.readTime && (
                    <div className="mb-3 flex items-center gap-1.5 text-xs text-[#9B9B9B]">
                      <Clock className="h-3.5 w-3.5" aria-hidden />
                      <span>{blog.readTime}</span>
                    </div>
                  )}
                  <h3 className="heading-font mb-3 text-base font-bold leading-snug text-[#333] md:text-[1.05rem]">
                    {blog.title}
                  </h3>
                  <p className="mb-5 flex-1 text-sm leading-relaxed text-[#6F6F6F]">
                    {blog.description}
                  </p>
                  <Link
                    href={`/blogs/${blog.id}`}
                    className="group/link heading-font inline-flex items-center gap-1.5 text-sm font-semibold text-[#1F6559] transition-colors hover:text-[#184F46]"
                    aria-label={`Read ${blog.title}`}
                  >
                    Read More
                    <ArrowRight
                      className="h-4 w-4 transition-transform group-hover/link:translate-x-0.5"
                      aria-hidden
                    />
                  </Link>
                </div>
              </motion.article>
            ))}
          </ScrollReveal>

          {blogList.length === 0 && (
            <motion.p
              variants={fadeUp(tr)}
              className="mt-16 text-center text-lg text-[#9B9B9B]"
            >
              No articles yet — check back soon.
            </motion.p>
          )}
        </div>
      </section>
    </MotionPageShell>
  );
};

export default Blogs;
