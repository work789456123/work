import { Link, useLocation } from "react-router-dom";
import { Phone, Mail, MapPin, Linkedin, Instagram } from "lucide-react";

const Footer = () => {
  const location = useLocation();

  // Hide footer on admin pages
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-[#1F6559] text-white py-6" data-testid="footer">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {/* Brand */}
          <div className="space-y-4 col-span-1 sm:col-span-2 lg:col-span-1 flex flex-col items-center">
            <Link to="/" className="flex items-center" data-testid="footer-logo-link">
              <img
                src="/pvhalflogo.png"
                alt="PashuVaani Logo"
                className="h-12 sm:h-16 w-auto object-contain"
              />
              <span className="text-xl sm:text-2xl font-bold tracking-tight bg-gradient-to-r from-[#1FA7A6] via-[#38C2B4] to-[#78D65C] bg-clip-text text-transparent ml-2">
                PashuVaani
              </span>
            </Link>
            <p className="text-white/90 text-sm max-w-xs">
              Pashu Bhi Pariwar Hai - Your trusted partner in animal healthcare.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="https://www.linkedin.com/company/pashuvaani/" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition-colors">
                <Linkedin className="w-6 h-6" />
              </a>
              <a href="https://www.instagram.com/pashuvaani.ai?igsh=MTh2MnkyaHlyM2NueQ==" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition-colors">
                <Instagram className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center">
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-3 text-white/80 flex flex-col items-center">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/pashucare-suraksha-plan" className="hover:text-white transition-colors">PashuCare Suraksha Plan</Link></li>
              <li><Link to="/blogs" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link to="/appointments" className="hover:text-white transition-colors">Consult with Doctor</Link></li>
            </ul>
          </div>

          <div className="flex flex-col items-center">
            <h4 className="font-semibold text-lg mb-4">Company</h4>
            <ul className="space-y-3 text-white/80">
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/our-story" className="hover:text-white transition-colors">Founder's Stories</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link to="/careers" className="hover:text-white transition-colors">Careers</Link></li>
              <li>
                <button 
                  onClick={() => window.dispatchEvent(new CustomEvent('openPromoModal'))}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Try Gopu.AI
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col items-center">
            <h4 className="font-semibold text-lg mb-4">Contact</h4>
            <ul className="space-y-3 text-white/80">
              <li className="flex items-center justify-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+91 70730 41236</span>
              </li>
              <li className="flex items-center justify-center gap-2">
                <Mail className="w-4 h-4" />
                <span>contact@pashuvaani.com</span>
              </li>
              <li className="flex items-start justify-center gap-2">
                <MapPin className="w-4 h-4 mt-1" />
                <span>Mumbai, India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-white/60">
          <p>© {new Date().getFullYear()} PashuVaani. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms-and-conditions" className="hover:text-white transition-colors">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
