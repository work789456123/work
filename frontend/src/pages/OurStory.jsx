import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";

const OurStory = () => {
  const [zoomedImage, setZoomedImage] = useState(null);

  const founders = [
    {
      name: "Mr. Mohan Vij",
      role: "Founder & CEO",
      image: "/foundermohan.jpg",
      story: [
        "The idea behind PashuVaani began with a moment that changed how our founder saw the relationship between humans and animals.",
        "During a visit to a village, he noticed a farmer sitting beside his cow. The animal appeared restless and uncomfortable. The farmer gently patted her and kept asking softly:",
        "What is wrong? Tell me what is wrong.",
        "But the cow could not answer.",
        "The nearest veterinarian was far away, and it would take hours before help could arrive. The farmer cared deeply about his animal, yet he had no way of understanding what the cow was trying to communicate.",
        "That moment revealed something powerful:",
        "Animals communicate constantly through behaviour, posture, and sound — but humans often struggle to understand these signals in time.",
        "The experience stayed with our founder and sparked a deeper curiosity about how this gap could be solved."
      ]
    },
    {
      name: "Mr. Utkarsh Srivastava",
      role: "Co-Founder & COO",
      image: "/founderutkarsh.jpg",
      story: [
        "To turn the idea of PashuVaani into something real, our founder shared the vision with Mr. Utkarsh Srivastava our co-founder.",
        "From the very first conversation, the idea resonated strongly with him. The possibility of using technology to help humans better understand animals represented more than just a product idea — it was an opportunity to solve a meaningful problem faced by millions of farmers, pet owners, and animal caretakers.",
        "Utkarsh recognized that many challenges in animal healthcare arise not because people do not care, but because they lack the tools and information needed to recognize problems early.",
        "Together, Mohan and Utkarsh began shaping the concept of PashuVaani into a platform that could combine artificial intelligence, practical animal health knowledge, and accessible technology to support better decision-making for animal care."
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-teal-50">

      {/* Hero Section */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-[#1FA7A6] via-[#38C2B4] to-[#78D65C]/10">
        <div className="max-w-2xl mx-auto px-4 text-center space-y-4">
          <h1 className="heading-font text-3xl md:text-4xl lg:text-5xl font-bold text-white">
            Our Story
          </h1>
          <p className="heading-font text-xl lg:text-xl font-bold text-white">
            From the Desk of the Founders
          </p>
        </div>
      </section>


      {/* Why We Built PashuVaani */}
      {/*<section className="py-20 bg-gradient-to-b from-[#1FA7A6]/10 via-[#38C2B4]/10 to-[#78D65C]/10">
        <div className="max-w-5xl mx-auto px-6 space-y-8">
          <h2 className="heading-font text-4xl font-bold text-[#333] text-center mb-12">
            The Beginning of PashuVaani
          </h2>
          <div className="space-y-6">
            <p className="text-lg text-[#6F6F6F] leading-relaxed">
              Some companies are created from business plans.
              Others begin with a deeper realization — that something important needs to change , PashuVaani was born from observing a challenge that exists across farms, homes, and communities: when animals fall sick, the people who care for them often face uncertainty.
            </p>

            <p className="text-lg text-[#6F6F6F] leading-relaxed">
              Farmers try to interpret symptoms without clear guidance.
              Animal caregivers search for reliable information.
              Veterinary support may not always be immediately accessible.

              Despite the critical role animals play in livelihoods, food systems, and companionship, animal healthcare often remains reactive instead of preventive. PashuVaani was founded with a vision to help change that reality — by building a platform that combines technology, data insights, and veterinary knowledge to make animal healthcare more accessible and informed.
            </p>

            <p className="text-lg text-[#1F6559] font-semibold text-xl">
              Our goal was simple yet ambitious: no animal caretaker should ever feel alone when an animal's health is at risk.
            </p>
          </div>
        </div>
      </section> */}

      {/* Founders Section */}
      <section className="py-20 bg-[#FAFAFA]">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="heading-font text-3xl md:text-4xl font-bold text-[#333] text-center mb-10 md:mb-16">
            Where the Idea Began
          </h2>

          <div className="space-y-24 md:space-y-40">
            {founders.map((founder, idx) => (
              <div key={idx} className="flex flex-col">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">

                  <div className={`${idx % 2 === 0 ? "lg:order-1" : "lg:order-2"}`}>
                    <div
                      className="relative group cursor-zoom-in overflow-hidden rounded-[2.5rem] shadow-xl hover:shadow-2xl transition-all duration-300 aspect-[4/5] w-full mx-auto"
                      onClick={() => setZoomedImage(founder.image)}
                    >
                      <img
                        src={founder.image}
                        alt={founder.name}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </div>

                  <div className={`space-y-6 ${idx % 2 === 0 ? "lg:order-2" : "lg:order-1"}`}>
                    <div className="space-y-2 text-center lg:text-left">
                      <h3 className="heading-font text-2xl md:text-3xl font-bold text-[#333]">
                        {founder.name}
                      </h3>
                      <p className="text-base md:text-lg font-semibold text-[#1F6559]">
                        {founder.role}
                      </p>
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

                {idx === 0 && (
                  <div className="mt-16 md:mt-32 mb-8 md:mb-16 py-10 md:py-16 bg-gradient-to-b from-[#1FA7A6]/10 via-[#38C2B4]/10 to-[#78D65C]/10 rounded-[2rem]">
                    <div className="max-w-5xl mx-auto px-6 space-y-6 md:space-y-8">
                      <h2 className="heading-font text-2xl md:text-4xl font-bold text-[#333] text-center mb-6 md:mb-8">
                        A Question That Sparked PashuVaani
                      </h2>
                      <div className="space-y-6 text-center">
                        <p className="text-lg text-[#6F6F6F] leading-relaxed">
                          As our founder reflected on that moment, he began thinking about how far technology has evolved.
                          Artificial intelligence today can translate languages, recognize faces, detect emotions, and analyse complex behavioural patterns.
                        </p>
                        <p className="text-lg text-[#6F6F6F] leading-relaxed">
                          During a visit to a village, our founder noticed a farmer sitting beside his cow, gently patting her and asking softly, <span className="font-semibold text-[#1F6559]">“What is wrong? Tell me what is wrong.”</span> But the cow could not answer.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* The Journey Ahead */}
      <section className="py-20 bg-gradient-to-b from-[#1FA7A6]/10 via-[#38C2B4]/10 to-[#78D65C]/10">
        <div className="max-w-5xl mx-auto px-6 space-y-8 text-center">
          <h2 className="heading-font text-4xl font-bold text-[#333]">
            The Journey Ahead
          </h2>
          <div className="space-y-6">
            <p className="text-lg text-[#6F6F6F] leading-relaxed">
              Today, PashuVaani is being developed to help farmers, pet owners, and animal caretakers better understand animal health signals through intelligent assistance.
            </p>
            <p className="text-lg text-[#6F6F6F] leading-relaxed">
              By combining artificial intelligence with veterinary knowledge, the platform aims to make animal healthcare more proactive, accessible, and informed.
            </p>
            <p className="text-lg text-[#6F6F6F] leading-relaxed">
              What began as a quiet moment between a farmer and his cow has now grown into a mission to transform how humans care for animals.
            </p>
            <p className="text-xl text-[#1F6559] font-semibold leading-relaxed">
              Because when animals cannot speak our language, technology can help us listen.
            </p>
          </div>
        </div>
      </section>


      {/* Image Zoom Modal */}
      <Dialog open={!!zoomedImage} onOpenChange={() => setZoomedImage(null)}>
        <DialogContent className="max-w-[95vw] md:max-w-4xl p-0 bg-transparent border-0 outline-none shadow-none">
          <div className="relative">
            <button
              onClick={() => setZoomedImage(null)}
              className="absolute -top-12 md:-top-10 right-0 bg-teal-50/90 hover:bg-teal-50 text-gray-900 rounded-full p-2 z-50"
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