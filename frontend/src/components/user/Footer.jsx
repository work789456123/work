import { Link, useLocation } from "react-router-dom";
import { Phone, Mail, MapPin, Linkedin, Instagram } from "lucide-react";
import { brand } from "@/assets/content/shared/brand";
import {
  footerBrand,
  footerQuickLinks,
  footerCompanyLinks,
  footerContact,
  footerSocial,
  footerLegal,
  footerSections,
} from "@/assets/content/shared/footer";

const Footer = () => {
  const location = useLocation();

  if (location.pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <footer id="user-footer" className="bg-[#1F6559] text-white py-6 pt-12" data-testid="footer">
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

          <div id="user-footer-quick-links" className="flex flex-col items-left">
            <h4 id="user-footer-quick-links-title" className="font-semibold text-lg mb-4">{footerSections.quickTitle}</h4>
            <ul id="user-footer-quick-links-list" className="space-y-3 text-white/80 flex flex-col items-left">
              {footerQuickLinks.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} id={`user-footer-quick-links-link-${item.label}`} className="hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div id="user-footer-company" className="flex flex-col items-start">
            <h4 id="user-footer-company-title" className="font-semibold text-lg mb-4">{footerSections.companyTitle}</h4>
            <ul id="user-footer-company-list" className="space-y-3 text-white/80">
              {footerCompanyLinks.map((item) =>
                item.type === "promo" ? (
                  <li key={item.label}>
                    <button
                      type="button"
                      id={`user-footer-company-button-${item.label}`}
                      onClick={() =>
                        window.dispatchEvent(new CustomEvent("openPromoModal"))
                      }
                      className="hover:text-white transition-colors cursor-pointer"
                    >
                      {item.label}
                    </button>
                  </li>
                ) : (
                  <li key={item.to}>
                    <Link to={item.to} id={`user-footer-company-link-${item.label}`} className="hover:text-white transition-colors">
                      {item.label}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          <div id="user-footer-contact" className="flex flex-col items-start">
            <h4 id="user-footer-contact-title" className="font-semibold text-lg mb-4">{footerSections.contactTitle}</h4>
            <ul id="user-footer-contact-list" className="space-y-3 text-white/80">
              <li id="user-footer-contact-phone" className="flex items-center justify-start gap-2">
                <Phone id="user-footer-contact-phone-icon" className="w-4 h-4" />
                <span>{footerContact.phone}</span>
              </li>
              <li id="user-footer-contact-email" className="flex items-center justify-start gap-2">
                <Mail id="user-footer-contact-email-icon" className="w-4 h-4" />
                <span>{footerContact.email}</span>
              </li>
              <li id="user-footer-contact-address" className="flex items-start justify-start gap-2">
                <MapPin className="w-4 h-4 mt-1" />
                <span>{footerContact.address}</span>
              </li>
            </ul>
          </div>
        </div>

        <div id="user-footer-bottom" className="border-t border-white/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-white/60">
          <p id="user-footer-bottom-copyright" className="text-white/60">© {new Date().getFullYear()} {brand.name}. All rights reserved.</p>
          <div id="user-footer-legal-links" className="flex gap-4 mt-4 md:mt-0">
            {footerLegal.map((item) => (
              <Link key={item.to} to={item.to} id={`user-footer-legal-link-${item.label}`} className="hover:text-white transition-colors">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
