"use client";

import { motion } from "framer-motion";
import { Heart, Shield, Users, Globe } from "lucide-react";
import { aboutWhoWeServe } from "@/assets/content/about";
import { lucideFromMap } from "@/lib/lucideFromMap";
import { SplitHeading } from "@/motion/SplitHeading";
import {
	useScrollMotion,
	transitionMedium,
	staggerContainer,
	scaleIn,
} from "@/motion/scrollMotion";
import ScrollReveal from "@/motion/ScrollReveal";
import Image from "next/image";
import PawTexture from "@/components/PawTexture";

const whoIcons = { heart: Heart, shield: Shield, users: Users, globe: Globe };

const cardGradients = [
	"from-[#1FA7A6] to-[#38C2B4]",
	"from-[#1F6559] to-[#1FA7A6]",
	"from-[#38C2B4] to-[#78D65C]",
	"from-[#78D65C] to-[#1F6559]",
];

export default function AboutWhoWeServeSection() {
	const { t, stagger, delayChildren } = useScrollMotion();
	const tr = t(transitionMedium);

	return (
		<section id="about-who-we-serve" className="bg-teal-50 relative py-20 md:py-28">
			<div className="pointer-events-none absolute inset-0 z-0">
				<PawTexture/>
			</div>
			<div className="mx-auto max-w-5xl relative px-6">
				<div className="mb-14 text-center">
					<SplitHeading
						text={aboutWhoWeServe.title}
						as="h2"
						className="heading-font justify-center text-4xl font-bold text-[#333] md:text-5xl"
						wordDelay={0.1}
					/>
				</div>

				<ScrollReveal
					variants={staggerContainer(stagger * 1.3, delayChildren)}
					className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
				>
					{aboutWhoWeServe.items.map((item, i) => {
						const Icon = lucideFromMap(whoIcons, item.icon);
						if (!Icon) return null;
						const grad = cardGradients[i % cardGradients.length];
						return (
							<motion.div
								key={item.text}
								variants={scaleIn(tr)}
								className="group flex flex-col items-center gap-4 rounded-2xl border border-[#E8EEEB] bg-white p-7 text-center shadow-sm transition-all hover:-translate-y-1 hover:border-[#1F6559]/20 hover:shadow-lg"
							>
								<div
									className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${grad} shadow-sm transition-transform group-hover:scale-105`}
								>
									<Icon className="h-8 w-8 text-white" strokeWidth={1.75} />
								</div>
								<p className="heading-font font-semibold leading-snug text-[#333]">
									{item.text}
								</p>
							</motion.div>
						);
					})}
				</ScrollReveal>
			</div>
		</section>
	);
}
