import { brand } from "./brand";

export const footerBrand = {
  ...brand,
  description: brand.tagline,
};

export const footerColumns = [
  {
    id: "quick-links",
    title: "Quick Links",
    type: "links",
    links: [
      { label: "Home", to: "/" },
      { label: "PashuCare Suraksha Plan", to: "/pashucare-suraksha-plan" },
      { label: "Blog", to: "/blogs" },
      { label: "Consult with Doctor", to: "/appointments" },
    ],
  },
  {
    id: "company",
    title: "Company",
    type: "links",
    links: [
      { label: "About Us", to: "/about" },
      { label: "Founder's Stories", to: "/our-story" },
      { label: "Contact Us", to: "/contact" },
      { label: "Careers", to: "/careers" },
      { type: "promo", label: "Try Gopu.AI" },
    ],
  },
  {
    id: "contact",
    title: "Contact",
    type: "contact",
    lines: [
      { key: "phone", text: "+91 70730 41236" },
      { key: "email", text: "contact@pashuvaani.com" },
      { key: "address", text: "Mumbai, India" },
    ],
  },
];

export const footerSocial = {
  linkedin: "https://www.linkedin.com/company/pashuvaani/",
  instagram:
    "https://www.instagram.com/pashuvaani.ai?igsh=MTh2MnkyaHlyM2NueQ==",
};

export const footerLegal = [
  { label: "Privacy Policy", to: "/privacy-policy" },
  { label: "Terms & Conditions", to: "/terms-and-conditions" },
  { label: "Data Deletion", to: "/data-deletion" },
];
