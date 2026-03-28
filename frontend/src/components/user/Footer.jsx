import { Link, useLocation } from "react-router-dom";
import { Phone, Mail, MapPin, Linkedin, Instagram } from "lucide-react";
import { brand } from "@/assets/shared/brand";
import {
  footerBrand,
  footerQuickLinks,
  footerCompanyLinks,
  footerContact,
  footerSocial,
  footerLegal,
  footerSections,
} from "@/assets/shared/footer";

const Footer = () => {
  const location = useLocation();

  if (location.pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="bg-[#1F6559] text-white py-6 pt-12" data-testid="footer">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
          <div className="space-y-4 col-span-1 sm:col-span-2 lg:col-span-1 flex flex-col items-start">
            <Link to="/" className="flex items-center" data-testid="footer-logo-link">
              <img
                src="/pvhalflogo.png"
                alt={brand.logoAlt}
                className="h-12 sm:h-16 w-auto object-contain"
              />
              <span className="text-xl sm:text-2xl font-bold tracking-tight bg-gradient-to-r from-[#1FA7A6] via-[#38C2B4] to-[#78D65C] bg-clip-text text-transparent ml-2">
                {footerBrand.name}
              </span>
            </Link>
            <p className="text-white/90 text-sm max-w-xs">{footerBrand.description}</p>
            <div className="flex space-x-4 pt-2">
              <a
                href={footerSocial.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 hover:text-white transition-colors"
              >
                <Linkedin className="w-6 h-6" />
              </a>
              <a
                href={footerSocial.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 hover:text-white transition-colors"
              >
                <Instagram className="w-6 h-6" />
              </a>
            </div>
          </div>

          <div className="flex flex-col items-left">
            <h4 className="font-semibold text-lg mb-4">{footerSections.quickTitle}</h4>
            <ul className="space-y-3 text-white/80 flex flex-col items-left">
              {footerQuickLinks.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col items-start">
            <h4 className="font-semibold text-lg mb-4">{footerSections.companyTitle}</h4>
            <ul className="space-y-3 text-white/80">
              {footerCompanyLinks.map((item) =>
                item.type === "promo" ? (
                  <li key={item.label}>
                    <button
                      type="button"
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
                    <Link to={item.to} className="hover:text-white transition-colors">
                      {item.label}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          <div className="flex flex-col items-start">
            <h4 className="font-semibold text-lg mb-4">{footerSections.contactTitle}</h4>
            <ul className="space-y-3 text-white/80">
              <li className="flex items-center justify-start gap-2">
                <Phone className="w-4 h-4" />
                <span>{footerContact.phone}</span>
              </li>
              <li className="flex items-center justify-start gap-2">
                <Mail className="w-4 h-4" />
                <span>{footerContact.email}</span>
              </li>
              <li className="flex items-start justify-start gap-2">
                <MapPin className="w-4 h-4 mt-1" />
                <span>{footerContact.address}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-white/60">
          <p>© {new Date().getFullYear()} {brand.name}. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            {footerLegal.map((item) => (
              <Link key={item.to} to={item.to} className="hover:text-white transition-colors">
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
