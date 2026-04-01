"use client";

import { useRef } from "react";
import Image from "next/image";
import {
	motion,
	useInView,
	useScroll,
	useTransform,
	useReducedMotion,
} from "framer-motion";
import { Sparkles, Heart, Globe, Users, Shield, Zap } from "lucide-react";
import { whyPashuVaani } from "@/assets/content/home";
import {
	fadeUp,
	scaleIn,
	homeEase,
	useScrollMotion,
	transitionMedium,
	viewportRepeat,
} from "@/motion/scrollMotion";
import { SplitHeading } from "@/motion/SplitHeading";
import { lucideFromMap } from "@/lib/lucideFromMap";

const iconMap = {
	sparkles: Sparkles,
	heart: Heart,
	globe: Globe,
	users: Users,
	shield: Shield,
	zap: Zap,
};

const hoverLift = { y: -6, transition: { duration: 0.22, ease: homeEase } };

const cardGradients = [
	"from-[#1FA7A6] to-[#38C2B4]",
	"from-[#1F6559] to-[#1FA7A6]",
	"from-[#38C2B4] to-[#78D65C]",
	"from-[#78D65C] to-[#38C2B4]",
	"from-[#1FA7A6] to-[#1F6559]",
	"from-[#38C2B4] to-[#1FA7A6]",
];

export default function HomeWhyPashuVaaniSection() {
	const ref = useRef(null);
	const sectionRef = useRef<HTMLElement>(null);
	const isInView = useInView(ref, viewportRepeat);
	const reduced = useReducedMotion();
	const { t, stagger, delayChildren } = useScrollMotion();
	const tr = t(transitionMedium);
	const titleFade = fadeUp(tr);
	const cardVariants = scaleIn(tr);
	const animate = reduced ? "visible" : isInView ? "visible" : "hidden";

	const { scrollYProgress } = useScroll({
		target: sectionRef,
		offset: ["start end", "end start"],
	});

	const headingY = useTransform(scrollYProgress, [0, 1], [50, -40]);
	const gridY = useTransform(scrollYProgress, [0, 1], [80, -20]);

	const outerVariants = {
		hidden: {},
		visible: {
			transition: {
				staggerChildren: stagger,
				delayChildren,
				when: "beforeChildren" as const,
			},
		},
	};
	const gridVariants = {
		hidden: {},
		visible: {
			transition: {
				staggerChildren: stagger * 0.7,
				delayChildren: 0.14,
				when: "beforeChildren" as const,
			},
		},
	};

	return (
		<section
			ref={sectionRef}
			id="home-why-pashuvaani"
			data-testid="why-section"
			className="relative overflow-hidden bg-teal-100/50  py-28 md:py-36"
		>
			{/* Decorative elements */}
			<div className="pointer-events-none absolute inset-0 z-0">
				<Image
					src="/images/bg_paws.png"
					alt=""
					fill
					className="object-cover opacity-10 "
					sizes="100vw"
					priority
				/>
			</div>

			<div className="relative mx-auto max-w-6xl px-6">
				<motion.div
					ref={ref}
					className="space-y-16"
					variants={outerVariants}
					initial="hidden"
					animate={animate}
				>
					{/* Title — parallax */}
					<motion.div
						className="text-center"
						style={reduced ? {} : { y: headingY }}
						variants={titleFade}
					>
						<div className="flex justify-center">
							<SplitHeading
								text={whyPashuVaani.title}
								as="h2"
								className="heading-font justify-center text-4xl font-bold text-[#1F6559] lg:text-5xl"
							/>
						</div>
					</motion.div>

					{/* Cards — parallax */}
					<motion.div
						className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
						style={reduced ? {} : { y: gridY }}
						variants={gridVariants}
					>
						{whyPashuVaani.cards.map((item, idx) => {
							const Icon = lucideFromMap(iconMap, item.icon);
							if (!Icon) return null;
							return (
								<motion.div
									key={idx}
									className="group flex items-start gap-4 rounded-2xl border border-[#1FA7A6]/10 bg-[#FAFAFA] p-6 transition-all duration-300 hover:border-[#1FA7A6]/25 hover:shadow-xl hover:shadow-[#1FA7A6]/8"
									variants={cardVariants}
									whileHover={reduced ? {} : hoverLift}
								>
									<div
										className={`mt-0.5 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${cardGradients[idx % cardGradients.length]} shadow-md`}
									>
										<Icon className="h-6 w-6 text-white" />
									</div>
									<h3 className="heading-font pt-2 text-base font-semibold text-[#333]">
										{item.title}
									</h3>
								</motion.div>
							);
						})}
					</motion.div>
				</motion.div>
			</div>
		</section>
	);
}
