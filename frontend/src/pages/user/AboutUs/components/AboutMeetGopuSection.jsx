import { aboutMeetGopu } from "@/assets/content/about";

export default function AboutMeetGopuSection() {
  return (
    <section id="about-meet-gopu" className="py-20 bg-gradient-to-b from-[#1FA7A6] via-[#38C2B4] to-[#78D65C]/10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <video
              src={aboutMeetGopu.videoSrc}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-auto object-cover max-w-md mx-auto rounded-3xl"
            />
          </div>
          <div className="order-1 lg:order-2 space-y-6">
            <div className="space-y-3">
              <h2 className="heading-font text-4xl font-bold text-[#333]">{aboutMeetGopu.title}</h2>
              <p className="text-lg font-semibold text-[#FFFFFF]">{aboutMeetGopu.subtitle}</p>
            </div>
            <p className="text-lg text-[#FFFFFF] leading-relaxed">
              Gopu is the friendly face of PashuVaani — your pet&apos;s intelligent health companion.
            </p>
            <p className="text-lg text-[#FFFFFF] leading-relaxed">
              <span className="font-semibold text-[#FFFFFF]">{aboutMeetGopu.leadBold}</span> Behind Gopu is advanced AI
              technology, but what pet parents experience is simplicity, clarity, and reassurance. Because when your
              pet isn&apos;t well, you need guidance — not confusion.
            </p>
            {aboutMeetGopu.paragraphs.map((t, i) => (
              <p key={i} className="text-lg text-[#FFFFFF] leading-relaxed">
                {t}
              </p>
            ))}
            <p className="text-lg text-[#1F6559] font-semibold italic">{aboutMeetGopu.quote}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
