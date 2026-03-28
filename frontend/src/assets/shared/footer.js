import { brand } from "./brand";

export const footerBrand = {
  ...brand,
  description: brand.tagline,
};

export const footerQuickLinks = [
  { label: "Home", to: "/" },
  { label: "PashuCare Suraksha Plan", to: "/pashucare-suraksha-plan" },
  { label: "Blog", to: "/blogs" },
  { label: "Consult with Doctor", to: "/appointments" },
];

export const footerCompanyLinks = [
  { label: "About Us", to: "/about" },
  { label: "Founder's Stories", to: "/our-story" },
  { label: "Contact Us", to: "/contact" },
  { label: "Careers", to: "/careers" },
  { type: "promo", label: "Try Gopu.AI" },
];

export const footerContact = {
  phone: "+91 70730 41236",
  email: "contact@pashuvaani.com",
  address: "Mumbai, India",
};

export const footerSocial = {
  linkedin: "https://www.linkedin.com/company/pashuvaani/",
  instagram:
    "https://www.instagram.com/pashuvaani.ai?igsh=MTh2MnkyaHlyM2NueQ==",
};

export const footerLegal = [
  { label: "Privacy Policy", to: "/privacy" },
  { label: "Terms & Conditions", to: "/terms-and-conditions" },
];

export const footerSections = {
  quickTitle: "Quick Links",
  companyTitle: "Company",
  contactTitle: "Contact",
};
