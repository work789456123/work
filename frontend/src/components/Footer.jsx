import { Link, useLocation } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";

const Footer = () => {
  const location = useLocation();
  
  // Hide footer on admin pages
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-slate-950 text-white py-24 mt-20" data-testid="footer">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-6">
            <img 
              src="https://customer-assets.emergentagent.com/job_c5cc5284-c7c6-4671-8ab4-5008fe8fa5a2/artifacts/zsncbn16_pashuvanilogpic.png" 
              alt="PashuVaani Logo" 
              className="h-20 drop-shadow-2xl"
            />
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs font-medium">
              Pashu Bhi Pariwar Hai. We are revolutionizing animal healthcare with <span className="text-primary font-bold">Gopu AI</span> technology.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-black text-xs uppercase tracking-widest mb-6 text-slate-500">Quick Links</h4>
            <ul className="space-y-4 text-slate-300 text-sm font-bold">
              <li><Link to="/" className="hover:text-primary transition-all">Home</Link></li>
              <li><Link to="/doctors" className="hover:text-primary transition-all">Our Doctors</Link></li>
              <li><Link to="/appointments" className="hover:text-primary transition-all">Book Appointment</Link></li>
              <li><Link to="/blogs" className="hover:text-primary transition-all">Blog</Link></li>
              <li><Link to="/pashucare-suraksha-plan" className="hover:text-primary transition-all">Suraksha Plan</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-black text-xs uppercase tracking-widest mb-6 text-slate-500">Company</h4>
            <ul className="space-y-4 text-slate-300 text-sm font-bold">
              <li><Link to="/about" className="hover:text-primary transition-all">About Us</Link></li>
              <li><Link to="/our-story" className="hover:text-primary transition-all">Founders Stories</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-all">Contact Us</Link></li>
              <li><Link to="/careers" className="hover:text-primary transition-all">Careers</Link></li>
              <li><Link to="/gopu" className="hover:text-primary transition-all underline decoration-primary underline-offset-4">Try Gopu.AI</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Contact</h4>
            <ul className="space-y-3 text-white/80">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>contact@pashuvaani.com</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1" />
                <span>India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-white/60">
          <p>© {new Date().getFullYear()} PashuVaani. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
