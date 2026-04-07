"use client";

import Image from "next/image";

export default function PawTexture() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0" style={{ zIndex: 0 }}>
      <Image
        src="/images/bg_plain.png"
        alt="background"
        fill
        className="object-cover" 
        sizes="100vw"
        priority
      />
    </div>
  );
}
