import Image from "next/image";

function PawTexture() {
	return (
		<div className="pointer-events-none absolute inset-0 z-0">
			<Image
				src="/images/bg_paws.png"
				alt=""
				fill
				className="object-cover opacity-25 "
				sizes="100vw"
				priority
			/>
		</div>
	);
}

export default PawTexture;
