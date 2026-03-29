import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Sparkles, Heart, Globe, Users, Shield, Zap } from "lucide-react";
import { aboutSection, aboutPillars } from "@/assets/content/home";
import {
  fadeUp,
  scaleIn,
  useScrollMotion,
  transitionMedium,
  viewportRepeat,
} from "@/motion/scrollMotion";
import { lucideFromMap } from "@/lib/lucideFromMap";

const iconMap = {
  sparkles: Sparkles,
  heart: Heart,
  globe: Globe,
  users: Users,
  shield: Shield,
  zap: Zap,
};

export default function HomeAboutPillarsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, viewportRepeat);
  const { t, stagger, delayChildren, reduced } = useScrollMotion();
  const tr = t(transitionMedium);
  const fade = fadeUp(tr);
  const cardIn = scaleIn(tr);
  const animate = reduced ? "visible" : isInView ? "visible" : "hidden";

  const outerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: stagger, delayChildren, when: "beforeChildren" },
    },
  };
  const headerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: stagger, delayChildren: 0.04, when: "beforeChildren" },
    },
  };
  const gridVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: stagger, delayChildren: 0.04, when: "beforeChildren" },
    },
  };

  return (
    <section
      id="home-about-pillars"
      className="py-24 bg-gradient-to-r from-[#1FA7A6] via-[#38C2B4] to-[#78D65C]"
      data-testid="about-section"
    >
      <div className="max-w-5xl mx-auto px-6 text-center">
        <motion.div
          ref={ref}
          className="space-y-12"
          variants={outerVariants}
          initial="hidden"
          animate={animate}
        >
          <motion.div className="space-y-6" variants={headerVariants}>
            <motion.h2 className="heading-font text-4xl lg:text-5xl font-bold text-white" variants={fade}>
              {aboutSection.title}
            </motion.h2>
            <motion.p className="text-lg text-white/90 leading-relaxed max-w-3xl mx-auto" variants={fade}>
              {aboutSection.body}
            </motion.p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pt-0"
            variants={gridVariants}
          >
            {aboutPillars.map((p) => {
              const Icon = lucideFromMap(iconMap, p.icon);
              if (!Icon) return null;
              return (
                <motion.div key={p.title} className="space-y-3" variants={cardIn}>
                  <div className="w-12 h-12 bg-teal-50/20 rounded-xl flex items-center justify-center mx-auto backdrop-blur-sm">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="heading-font font-semibold text-white">{p.title}</h3>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
