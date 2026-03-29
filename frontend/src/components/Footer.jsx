import { useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { Phone, Mail, MapPin, Linkedin, Instagram } from "lucide-react";
import { fadeUp, useScrollMotion, transitionMedium, viewportRepeat } from "@/motion/scrollMotion";
import { brand } from "@/assets/content/shared/brand";
import {
  footerBrand,
  footerColumns,
  footerSocial,
  footerLegal,
} from "@/assets/content/shared/footer";

const contactIcon = {
  phone: Phone,
  email: Mail,
  address: MapPin,
};

const Footer = () => {
  const location = useLocation();
  const ref = useRef(null);
  const isInView = useInView(ref, viewportRepeat);
  const { reduced, t } = useScrollMotion();
  const footerMotion = fadeUp(t(transitionMedium));
  const animate = reduced ? "visible" : isInView ? "visible" : "hidden";

  if (location.pathname.startsWith("/admin")) {
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
            <Link to="/" id="user-footer-brand-logo" className="flex items-center" data-testid="footer-logo-link">
              <img
                id="user-footer-brand-logo-image"
                src="/pvhalflogo.png"
                alt={brand.logoAlt}
                className="h-12 sm:h-16 w-auto object-contain"
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
                <Linkedin id="user-footer-brand-logo-linkedin-icon" className="w-6 h-6" />
              </a>
              <a
                id="user-footer-brand-logo-instagram-link"
                href={footerSocial.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 hover:text-white transition-colors"
              >
                <Instagram id="user-footer-brand-logo-instagram-icon" className="w-6 h-6" />
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

              {col.type === "links" && (
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
                          to={item.to}
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

              {col.type === "contact" && (
                <ul id={`user-footer-${col.id}-list`} className="space-y-3 text-white/80">
                  {col.lines.map((line) => {
                    const Icon = contactIcon[line.key];
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
                to={item.to}
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
