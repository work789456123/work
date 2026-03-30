"use client";

import dynamic from "next/dynamic";

const GopuChat = dynamic(() => import("@/views/Gopu/GopuChat"), { ssr: false });

export default function GopuChatLazy() {
  return <GopuChat />;
}
