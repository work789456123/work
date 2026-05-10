"use client";

import dynamic from "next/dynamic";

const GopuMedicalChat = dynamic(
  () => import("@/views/Gopu/GopuMedicalChat"),
  { ssr: false },
);

export default function GopuMedicalChatLazy() {
  return <GopuMedicalChat />;
}
