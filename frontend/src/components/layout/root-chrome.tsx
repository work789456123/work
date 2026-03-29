"use client";

import { ScrollToTop } from "@/components/layout/scroll-to-top";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer";
import TermsModal from "@/components/TermsModal";
import PromoModal from "@/components/PromoModal";

export function RootChrome({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main className="flex-1 [overflow-anchor:none]">{children}</main>
      <Footer />
      <TermsModal />
      <PromoModal />
    </>
  );
}
