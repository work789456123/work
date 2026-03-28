import { whatsapp } from "@/assets/content/home";

export default function HomeWhatsappFloatingButton() {
  return (
    <a
      id="home-whatsapp-fab"
      href={whatsapp.href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center group"
    >
      <div className="absolute inset-0 bg-[#25D366] rounded-full animate-ping opacity-20 group-hover:opacity-40 transition-opacity duration-300" />
      <div className="absolute inset-0 bg-[#25D366] rounded-full animate-pulse opacity-30 shadow-[0_0_15px_rgba(37,211,102,0.8)]" />
      <img
        src={whatsapp.imageUrl}
        alt={whatsapp.imageAlt}
        className="relative w-14 h-14 hover:scale-110 transition-transform drop-shadow-xl"
      />
    </a>
  );
}
