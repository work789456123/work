import { motion } from "framer-motion";
import Image from "next/image";
import { ReactNode } from "react";

interface PageTitleProps {
	id?: string;
	children: ReactNode;
	className?: string;
}

function PageTitle({ children, className,id }: PageTitleProps) {
	return (
		<section
			id={id}
			data-testid={id}
			className={
				"relative overflow-hidden bg-teal-200 py-24 md:py-32 " + className
			}
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

			{children}
		</section>
	);
}

export default PageTitle;
