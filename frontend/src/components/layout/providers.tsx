"use client";

import { Toaster } from "sonner";
import { ForceLightDocument } from "./ForceLightDocument";
import { SiteLoadingScreen } from "./SiteLoadingScreen";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ForceLightDocument />
      {children}
      <Toaster position="top-right" richColors theme="light" duration={2000} />
      <SiteLoadingScreen />
    </>
  );
}
