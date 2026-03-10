import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";

const OurStory = () => {
  const [zoomedImage, setZoomedImage] = useState(null);

  const founders = [
    {
      name: "Mr. Mohan Vij",
      role: "Founder & CEO",
      image: "https://customer-assets.emergentagent.com/job_73651be8-bbea-4eee-a6be-0162100b6ac1/artifacts/ni8cmuaj_Mohan%20Vij.jpeg",
      story: [
        "For Mr. Mohan Vij, the idea behind PashuVaani began with a simple realization — when animals fall sick, people often feel helpless.",
        "Pet parents panic. Farmers lose income. Veterinary support is delayed. Reliable guidance is difficult to access.",
        "He saw a gap — not just in technology, but in confidence. There was no intelligent, accessible system that could guide people in real time and reduce uncertainty during health concerns.",
        "With a strong entrepreneurial drive and a vision to create meaningful impact, he set out to build a platform that would combine technology with compassion.",
        "That vision became PashuVaani — the Voice of Animal Health."
      ]
    },
    {
      name: "Mr. Utkarsh Srivastava",
      role: "Co-Founder, CTO & COO",
      image: "https://customer-assets.emergentagent.com/job_73651be8-bbea-4eee-a6be-0162100b6ac1/artifacts/r2osltwb_Utkarsh%20Srivastava.jpeg",
      story: [
        "For Mr. Utkarsh Srivastava, the mission was about building something scalable, intelligent, and dependable.",
        "He believed that artificial intelligence could do more than automate conversations — it could become a protective layer for animals and a decision-support system for their caregivers.",
        "He focused on building the technological backbone that powers Gopu — ensuring the platform would be reliable, secure, and designed for real-world use.",
        "His goal was clear: Technology should not replace human care. It should strengthen it."
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-[#1F6559]/5 to-white">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
          <h1 className="heading-font text-5xl lg:text-6xl font-bold text-[#111111]">
            Our Story
          </h1>
          <p className="text-xl text-[#6F6F6F] leading-relaxed">
            Building a future where no pet parent feels alone
          </p>
        </div>
      </section>

      {/* Why We Built PashuVaani */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6 space-y-8">
          <h2 className="heading-font text-4xl font-bold text-[#111111] text-center mb-12">
            Why We Built PashuVaani
          </h2>
          <div className="space-y-6">
            <p className="text-lg text-[#6F6F6F] leading-relaxed">
              PashuVaani was not born in a boardroom. It was born from observation, concern, and a deep belief 
              that animal healthcare deserves to be smarter, faster, and more accessible.
            </p>
            <p className="text-lg text-[#6F6F6F] leading-relaxed">
              In a country where animals support livelihoods and emotions alike, delayed advice often means irreversible loss. 
              We built PashuVaani to ensure that help is not limited by time, location, or availability.
            </p>
            <p className="text-lg text-[#1F6559] font-semibold text-xl">
              Our goal was simple yet ambitious: no animal caretaker should ever feel alone when an animal's health is at risk.
            </p>
          </div>
        </div>
      </section>

      {/* Founders Section */}
      <section className="py-20 bg-[#FAFAFA]">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="heading-font text-4xl font-bold text-[#111111] text-center mb-16">
            From the Desk of the Founders
          </h2>
          
          <div className="space-y-20">
            {founders.map((founder, idx) => (
              <div key={idx} className="grid lg:grid-cols-2 gap-12 items-start">
                <div className={`${idx % 2 === 0 ? 'lg:order-1' : 'lg:order-2'}`}>
                  <div 
                    className="relative group cursor-zoom-in overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300"
                    onClick={() => setZoomedImage(founder.image)}
                  >
                    <img
                      src={founder.image}
                      alt={founder.name}
                      className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                      <span className="text-white opacity-0 group-hover:opacity-100 bg-black/50 px-4 py-2 rounded-full text-sm transition-opacity duration-300">
                        Click to zoom
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className={`space-y-6 ${idx % 2 === 0 ? 'lg:order-2' : 'lg:order-1'}`}>
                  <div className="space-y-2">
                    <h3 className="heading-font text-3xl font-bold text-[#111111]">
                      {founder.name}
                    </h3>
                    <p className="text-lg font-semibold text-[#1F6559]">{founder.role}</p>
                  </div>
                  <div className="space-y-4">
                    {founder.story.map((paragraph, pIdx) => (
                      <p key={pIdx} className="text-lg text-[#6F6F6F] leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why We Started with Pets */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6 space-y-8">
          <h2 className="heading-font text-4xl font-bold text-[#111111] text-center mb-12">
            Why We Started with Pets
          </h2>
          <div className="space-y-6">
            <p className="text-lg text-[#6F6F6F] leading-relaxed">
              We chose to begin with pets because <span className="font-semibold text-[#111111]">they are family</span>.
            </p>
            <p className="text-lg text-[#6F6F6F] leading-relaxed">
              When a pet is unwell, emotions run high. Decisions must be made quickly. Reliable guidance matters.
            </p>
            <p className="text-lg text-[#6F6F6F] leading-relaxed">
              By starting with pets, we are building a foundation of trust, empathy, and intelligent care — 
              before expanding into a universal animal health ecosystem.
            </p>
          </div>
        </div>
      </section>

      {/* The Birth of Gopu */}
      <section className="py-20 bg-[#FAFAFA]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="https://customer-assets.emergentagent.com/job_73651be8-bbea-4eee-a6be-0162100b6ac1/artifacts/mumll039_Gopu%20Ai%20Image.png"
                alt="Gopu"
                className="w-full max-w-md mx-auto"
              />
            </div>
            <div className="space-y-6">
              <h2 className="heading-font text-4xl font-bold text-[#111111]">
                The Birth of Gopu
              </h2>
              <div className="space-y-4">
                <p className="text-lg text-[#6F6F6F] leading-relaxed">
                  As we built the platform, we realized something important.
                </p>
                <p className="text-lg text-[#1F6559] font-semibold">
                  People do not connect with algorithms. They connect with warmth.
                </p>
                <p className="text-lg text-[#6F6F6F] leading-relaxed">
                  That is how Gopu was born — not just as a mascot, but as a symbol of protection, intelligence, and reassurance.
                </p>
                <p className="text-lg text-[#6F6F6F] leading-relaxed">
                  Gopu represents what we stand for: <span className="font-semibold text-[#111111]">Compassion powered by technology</span>. 
                  A voice that does not panic, does not judge — but listens, understands, and guides.
                </p>
                <p className="text-lg text-[#6F6F6F] leading-relaxed">
                  In every interaction, Gopu exists to replace fear with clarity and confusion with confidence. 
                  It was created to stand beside farmers when help feels out of reach.
                </p>
                <p className="text-lg text-[#6F6F6F] leading-relaxed">
                  Whether it's a late-night concern or a critical health question, Gopu is designed to respond with 
                  empathy, accuracy, and speed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Road Ahead */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6 space-y-8">
          <h2 className="heading-font text-4xl font-bold text-[#111111] text-center mb-12">
            The Road Ahead
          </h2>
          <div className="space-y-6">
            <p className="text-lg text-[#6F6F6F] leading-relaxed">
              PashuVaani is more than an app. It is a long-term commitment to:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                "Preventive animal healthcare",
                "Intelligent decision support",
                "Reduced disease losses",
                "Stronger, more confident caregivers"
              ].map((item, idx) => (
                <div key={idx} className="flex items-start space-x-3 p-4 bg-[#FAFAFA] rounded-xl border border-[#EAEAEA]">
                  <div className="w-2 h-2 bg-[#1F6559] rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-lg text-[#6F6F6F]">{item}</p>
                </div>
              ))}
            </div>
            <p className="text-xl text-[#1F6559] font-semibold text-center pt-6">
              We are building a future where no pet parent or animal caretaker feels alone during a health concern.
            </p>
            <p className="text-xl text-[#111111] font-bold text-center">
              And this is just the beginning.
            </p>
          </div>
        </div>
      </section>

      {/* Image Zoom Modal */}
      <Dialog open={!!zoomedImage} onOpenChange={() => setZoomedImage(null)}>
        <DialogContent className="max-w-4xl p-0 bg-transparent border-0">
          <div className="relative">
            <button
              onClick={() => setZoomedImage(null)}
              className="absolute -top-10 right-0 bg-white/90 hover:bg-white text-gray-900 rounded-full p-2 z-50"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={zoomedImage}
              alt="Zoomed view"
              className="w-full h-auto rounded-lg shadow-2xl"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OurStory;