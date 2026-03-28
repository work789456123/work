import { meetGopu } from "@/assets/content/home";

export default function HomeMeetGopuSection() {
  return (
    <section id="home-meet-gopu" className="py-24 bg-teal-50" data-testid="meet-gopu-section">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <video
              src={meetGopu.videoSrc}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-auto object-cover max-w-md mx-auto rounded-3xl"
            />
          </div>
          <div className="order-1 lg:order-2 space-y-6">
            <h2 className="heading-font text-4xl lg:text-5xl font-bold text-[#333]">{meetGopu.title}</h2>
            <p className="text-sm font-medium text-[#1F6559]">{meetGopu.subtitle}</p>
            {meetGopu.paragraphs.map((t, i) => (
              <p key={i} className="text-lg text-[#6F6F6F] leading-relaxed">
                {t}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
