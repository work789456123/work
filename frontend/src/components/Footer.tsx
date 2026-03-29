"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useInView } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { Phone, Mail, MapPin } from "lucide-react";
import { fadeUp, useScrollMotion, transitionMedium, viewportRepeat } from "@/motion/scrollMotion";
import { brand } from "@/assets/content/shared/brand";
import {
  footerBrand,
  footerColumns,
  footerSocial,
  footerLegal,
} from "@/assets/content/shared/footer";

type ContactLineKey = "phone" | "email" | "address";

function LinkedInIcon({ className, id }: { className?: string; id?: string }) {
  return (
    <svg id={id} className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function InstagramIcon({ className, id }: { className?: string; id?: string }) {
  return (
    <svg id={id} className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

const contactIcon: Record<ContactLineKey, LucideIcon> = {
  phone: Phone,
  email: Mail,
  address: MapPin,
};

const Footer = () => {
  const pathname = usePathname();
  const ref = useRef(null);
  const isInView = useInView(ref, viewportRepeat);
  const { reduced, t } = useScrollMotion();
  const footerMotion = fadeUp(t(transitionMedium));
  const animate = reduced ? "visible" : isInView ? "visible" : "hidden";

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <motion.footer
      ref={ref}
      id="user-footer"
      className="bg-[#1F6559] text-white py-6 pt-12 z-10"
      data-testid="footer"
      variants={footerMotion}
      initial="hidden"
      animate={animate}
    >
      <div id="user-footer-inner" className="max-w-7xl mx-auto px-6">
        <div id="user-footer-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
          <div id="user-footer-brand" className="space-y-4 col-span-1 sm:col-span-2 lg:col-span-1 flex flex-col items-start">
            <Link href="/" id="user-footer-brand-logo" className="flex items-center" data-testid="footer-logo-link">
              <Image
                id="user-footer-brand-logo-image"
                src="/pvhalflogo.png"
                alt={brand.logoAlt}
                width={200}
                height={80}
                className="h-12 w-auto object-contain sm:h-16"
              />
              <span id="user-footer-brand-logo-text" className="text-xl sm:text-2xl font-bold tracking-tight bg-gradient-to-r from-[#1FA7A6] via-[#38C2B4] to-[#78D65C] bg-clip-text text-transparent ml-2">
                {footerBrand.name}
              </span>
            </Link>
            <p id="user-footer-brand-description" className="text-white/90 text-sm max-w-xs">{footerBrand.description}</p>
            <div id="user-footer-brand-logo-social-links" className="flex space-x-4 pt-2">
              <a
                id="user-footer-brand-logo-linkedin-link"
                href={footerSocial.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 hover:text-white transition-colors"
              >
                <LinkedInIcon id="user-footer-brand-logo-linkedin-icon" className="w-6 h-6" />
              </a>
              <a
                id="user-footer-brand-logo-instagram-link"
                href={footerSocial.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 hover:text-white transition-colors"
              >
                <InstagramIcon id="user-footer-brand-logo-instagram-icon" className="w-6 h-6" />
              </a>
            </div>
          </div>

          {footerColumns.map((col) => (
            <div
              key={col.id}
              id={`user-footer-${col.id}`}
              className={`flex flex-col ${col.id === "quick-links" ? "items-left" : "items-start"}`}
            >
              <h4 id={`user-footer-${col.id}-title`} className="font-semibold text-lg mb-4">
                {col.title}
              </h4>

              {col.type === "links" && col.links && (
                <ul
                  id={`user-footer-${col.id}-list`}
                  className={`space-y-3 text-white/80 flex flex-col ${col.id === "quick-links" ? "items-left" : ""}`}
                >
                  {col.links.map((item) =>
                    item.type === "promo" ? (
                      <li key={item.label}>
                        <button
                          type="button"
                          id={`user-footer-${col.id}-button-${item.label}`}
                          onClick={() => window.dispatchEvent(new CustomEvent("openPromoModal"))}
                          className="hover:text-white transition-colors cursor-pointer"
                        >
                          {item.label}
                        </button>
                      </li>
                    ) : (
                      <li key={item.to}>
                        <Link
                          href={item.to ?? "/"}
                          id={`user-footer-${col.id}-link-${item.label}`}
                          className="hover:text-white transition-colors"
                        >
                          {item.label}
                        </Link>
                      </li>
                    )
                  )}
                </ul>
              )}

              {col.type === "contact" && col.lines && (
                <ul id={`user-footer-${col.id}-list`} className="space-y-3 text-white/80">
                  {col.lines.map((line) => {
                    const Icon = contactIcon[line.key as ContactLineKey];
                    const isAddress = line.key === "address";
                    return (
                      <li
                        key={line.key}
                        id={`user-footer-${col.id}-${line.key}`}
                        className={`flex ${isAddress ? "items-start" : "items-center"} justify-start gap-2`}
                      >
                        {Icon && (
                          <Icon
                            id={`user-footer-${col.id}-${line.key}-icon`}
                            className={`w-4 h-4 ${isAddress ? "mt-1" : ""}`}
                          />
                        )}
                        <span>{line.text}</span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          ))}
        </div>

        <div id="user-footer-bottom" className="border-t border-white/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-white/60">
          <p id="user-footer-bottom-copyright" className="text-white/60">
            © {new Date().getFullYear()} {brand.name}. All rights reserved.
          </p>
          <div id="user-footer-legal-links" className="flex gap-4 mt-4 md:mt-0">
            {footerLegal.map((item) => (
              <Link
                key={item.to}
                href={item.to}
                id={`user-footer-legal-link-${item.label}`}
                className="hover:text-white transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
