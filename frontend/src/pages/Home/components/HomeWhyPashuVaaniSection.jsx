import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Sparkles, Heart, Globe, Users, Shield, Zap } from "lucide-react";
import { whyPashuVaani } from "@/assets/content/home";
import {
  fadeUp,
  scaleIn,
  useScrollMotion,
  transitionMedium,
  viewportRepeat,
} from "@/motion/scrollMotion";

const hoverLift = { y: -4, transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] } };

const iconMap = {
  sparkles: Sparkles,
  heart: Heart,
  globe: Globe,
  users: Users,
  shield: Shield,
  zap: Zap,
};

export default function HomeWhyPashuVaaniSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, viewportRepeat);
  const { t, stagger, delayChildren, reduced } = useScrollMotion();
  const tr = t(transitionMedium);
  const titleFade = fadeUp(tr);
  const cardVariants = scaleIn(tr);
  const animate = reduced ? "visible" : isInView ? "visible" : "hidden";

  const outerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: stagger, delayChildren, when: "beforeChildren" },
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
      id="home-why-pashuvaani"
      className="py-24 bg-gradient-to-r from-[#1FA7A6] via-[#38C2B4] to-[#78D65C]"
      data-testid="why-section"
    >
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          ref={ref}
          className="space-y-16"
          variants={outerVariants}
          initial="hidden"
          animate={animate}
        >
          <motion.h2
            className="heading-font text-4xl lg:text-5xl font-bold text-white text-center"
            variants={titleFade}
          >
            {whyPashuVaani.title}
          </motion.h2>
          <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8" variants={gridVariants}>
            {whyPashuVaani.cards.map((item, idx) => {
              const Icon = iconMap[item.icon];
              return (
                <motion.div
                  key={idx}
                  className="p-8 bg-teal-50/10 backdrop-blur-md rounded-2xl border border-white/20 space-y-4 hover:bg-teal-50/20 transition-colors"
                  variants={cardVariants}
                  whileHover={reduced ? {} : hoverLift}
                >
                  <Icon className="w-8 h-8 text-white" />
                  <h3 className="heading-font text-lg font-semibold text-white">{item.title}</h3>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
