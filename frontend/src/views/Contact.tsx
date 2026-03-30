"use client";

import { useState, type FormEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { submitContactMessage } from "@/app/actions/contact";
import { Mail, Phone, MapPin, ArrowRight, Send } from "lucide-react";
import { contactPage, contactChannels, contactForm } from "@/assets/content/contact";
import { brand } from "@/assets/content/shared/brand";
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
import { lucideFromMap } from "@/lib/lucideFromMap";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;
const iconFor = { phone: Phone, email: Mail, address: MapPin };

const channelGradients: Record<string, string> = {
  phone: "from-[#1FA7A6] to-[#38C2B4]",
  email: "from-[#38C2B4] to-[#78D65C]",
  address: "from-[#1F6559] to-[#1FA7A6]",
};

const fieldInputClass =
  "h-11 rounded-xl border-[#E2E8E5] bg-[#FAFAFA]/90 shadow-sm transition-colors placeholder:text-muted-foreground/70 focus-visible:border-[#1F6559]/40 focus-visible:ring-[#1F6559]/30";

/** Floating orb — pauses when reduced motion is on */
function FloatingOrb({
  className,
  animate,
  duration,
  delay = 0,
}: {
  className: string;
  animate: { y: number[]; x: number[]; scale?: number[] };
  duration: number;
  delay?: number;
}) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className} aria-hidden />;
  return (
    <motion.div
      className={className}
      animate={animate}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        repeatType: "mirror",
        ease: "easeInOut",
      }}
      aria-hidden
    />
  );
}

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);
  const { t, stagger, delayChildren } = useScrollMotion();
  const tr = t(transitionMedium);
  const trShort = t(transitionShort);
  const p = contactPage;
  const f = contactForm;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    const result = await submitContactMessage(formData);
    setSending(false);
    if (result.ok) {
      toast.success(result.message);
      setFormData({ name: "", email: "", message: "" });
    } else {
      toast.error(result.error);
    }
  };

  return (
    <UserPageShell
      id="page-contact"
      data-testid="contact-page"
      className="relative min-h-screen overflow-hidden bg-[url('/images/contact_bg.png')] bg-cover bg-center"
    >
      {/* ── Content ──────────────────────────────────────────── */}
      <div
        id="contact-inner"
        className="relative mx-auto max-w-6xl px-6 py-20 md:py-28"
      >
        {/* Page intro */}
        <div id="contact-intro" className="mb-16 text-center">
          <motion.p
            className="heading-font mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#1FA7A6]"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            {p.eyebrow}
          </motion.p>

          <div id="contact-page-title" data-testid="contact-heading">
            <SplitHeading
              text={p.title}
              as="h1"
              className="heading-font justify-center text-4xl font-bold text-[#333] md:text-5xl lg:text-6xl"
              wordDelay={0.11}
            />
          </div>

        </div>

        {/* Two-column layout */}
        <div id="contact-layout" className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16">

          {/* ── Left: info panel ──────────────────────────────── */}
          <div className="space-y-10">
            {/* Brand tagline card */}
            <motion.div
              className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1FA7A6] via-[#38C2B4] to-[#78D65C] p-8 text-white"
              initial={{ opacity: 0, x: -32, scale: 0.97 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.65, ease: EASE }}
            >
              <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/10 blur-2xl" aria-hidden />
              <div className="pointer-events-none absolute -bottom-8 left-4 h-36 w-36 rounded-full bg-[#1F6559]/25 blur-2xl" aria-hidden />
              <div className="relative space-y-3">
                <p className="heading-font text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
                  {brand.name}
                </p>
                <p className="heading-font text-2xl font-bold leading-snug text-white md:text-3xl">
                  {p.tagline}
                </p>
                <p className="text-base leading-relaxed text-white/85">{brand.tagline}</p>
              </div>
            </motion.div>

            {/* Contact channels */}
            <div id="contact-channels" className="space-y-4">
              <ScrollReveal
                variants={staggerContainer(stagger * 1.3, delayChildren)}
                className="space-y-4"
              >
                {contactChannels.map((ch) => {
                  const Icon = lucideFromMap(iconFor, ch.key);
                  if (!Icon) return null;
                  const grad = channelGradients[ch.key] ?? "from-[#1FA7A6] to-[#1F6559]";
                  return (
                    <motion.div
                      key={ch.key}
                      variants={slideInLeft(tr)}
                      className="group flex items-center gap-5 rounded-2xl border border-[#E8EEEB] bg-white/80 p-5 shadow-sm backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-[#1F6559]/25 hover:shadow-md"
                    >
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${grad} shadow-sm transition-transform group-hover:scale-105`}
                      >
                        <Icon className="h-5 w-5 text-white" strokeWidth={1.75} />
                      </div>
                      <div className="min-w-0">
                        <p className="heading-font mb-0.5 text-sm font-semibold text-[#333]">
                          {ch.title}
                        </p>
                        <p
                          className="truncate text-[#6F6F6F]"
                          data-testid={`contact-${ch.key}`}
                        >
                          {ch.value}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </ScrollReveal>
            </div>
          </div>

          {/* ── Right: form ───────────────────────────────────── */}
          <motion.div
            id="contact-form-card"
            className="relative overflow-hidden rounded-3xl border border-[#E8EEEB] bg-white/90 p-8 shadow-xl shadow-[#1F6559]/5 backdrop-blur-sm md:p-10"
            initial={{ opacity: 0, x: 32, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.65, ease: EASE }}
          >
            {/* Subtle gradient shine at top */}
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-1 rounded-t-3xl bg-gradient-to-r from-[#1FA7A6] via-[#38C2B4] to-[#78D65C]"
              aria-hidden
            />

            <div className="mb-7 space-y-1">
              <h2 className="heading-font text-xl font-bold text-[#333] md:text-2xl">{f.title}</h2>
              <p className="text-sm text-[#9B9B9B]">{f.description}</p>
            </div>

            <form id="contact-message-form" onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="contact-form-name" className="text-[#333]">
                    {f.labels.name}
                  </Label>
                  <Input
                    id="contact-form-name"
                    data-testid="contact-name-input"
                    placeholder={f.placeholders.name}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className={fieldInputClass}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-form-email" className="text-[#333]">
                    {f.labels.email}
                  </Label>
                  <Input
                    type="email"
                    id="contact-form-email"
                    data-testid="contact-email-input"
                    placeholder={f.placeholders.email}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className={fieldInputClass}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact-form-message" className="text-[#333]">
                  {f.labels.message}
                </Label>
                <Textarea
                  id="contact-form-message"
                  data-testid="contact-message-input"
                  placeholder={f.placeholders.message}
                  rows={6}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  className={cn(
                    "min-h-[160px] resize-y rounded-xl border-[#E2E8E5] bg-[#FAFAFA]/90 shadow-sm transition-colors placeholder:text-muted-foreground/70 focus-visible:border-[#1F6559]/40 focus-visible:ring-[#1F6559]/30"
                  )}
                />
              </div>

              <Button
                id="contact-form-submit"
                type="submit"
                data-testid="contact-submit-button"
                disabled={sending}
                className="heading-font group h-12 w-full rounded-xl bg-[#1F6559] text-base font-semibold text-white shadow-sm transition-all hover:bg-[#184F46] hover:shadow-md disabled:opacity-70"
              >
                {sending ? (
                  <span className="flex items-center gap-2">
                    <motion.span
                      className="inline-block h-4 w-4 rounded-full border-2 border-white/30 border-t-white"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                    />
                    Sending…
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
                    {f.submit}
                  </span>
                )}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </UserPageShell>
  );
};

export default Contact;
