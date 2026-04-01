"use client";

import { motion } from "framer-motion";
import { aboutHero } from "@/assets/content/about";
import { brand } from "@/assets/content/shared/brand";
import { SplitHeading } from "@/motion/SplitHeading";
import {
	useScrollMotion,
	transitionMedium,
	fadeUp,
} from "@/motion/scrollMotion";
import Image from "next/image";
import PageTitle from "@/components/PageTitle";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function AboutHeroSection() {
	const { t } = useScrollMotion();
	const tr = t(transitionMedium);
	const fade = fadeUp(tr);

	return (
		<PageTitle id="about-hero">
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
				<motion.p
					className="heading-font mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-[#1F6559]"
					initial={{ opacity: 0, y: 16 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, ease: EASE }}
				>
					{brand.name}
				</motion.p>

				<SplitHeading
					text={aboutHero.title}
					as="h1"
					className="heading-font justify-center text-4xl font-bold leading-tight text-[#1F6559] md:text-5xl lg:text-6xl"
					wordDelay={0.1}
				/>

				<motion.p
					className="heading-font mx-auto mt-6 max-w-2xl text-xl font-semibold text-[#1F6559] md:text-2xl"
					variants={fade}
					initial="hidden"
					animate="visible"
					transition={{ delay: 0.6 }}
				>
					{aboutHero.subtitle}
				</motion.p>

				<motion.div
					className="mt-8 flex justify-center"
					initial={{ opacity: 0, scaleX: 0 }}
					animate={{ opacity: 1, scaleX: 1 }}
					transition={{ delay: 0.9, duration: 0.6, ease: EASE }}
				>
					<div className="h-1 w-16 rounded-full bg-white/60" />
				</motion.div>
			</div>
		</PageTitle>
	);
}
