import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/layout/providers";
import { RootChrome } from "@/components/layout/root-chrome";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "PashuVaani",
    template: "%s | PashuVaani",
  },
  description: "AI-powered animal health guidance and veterinary care resources.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${manrope.variable} App min-h-screen flex flex-col antialiased`}>
        <Providers>
          <RootChrome>{children}</RootChrome>
        </Providers>
      </body>
    </html>
  );
}
