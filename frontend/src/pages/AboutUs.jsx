import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Sparkles, Heart, Shield, Zap, Globe, Users, Target, Award } from "lucide-react";

const AboutUs = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-teal-50">
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-[#1FA7A6] via-[#38C2B4] to-[#78D65C]" data-testid="AboutUs-section">        <div className="max-w-4xl mx-auto px-6 text-center space-y-4 md:space-y-6">
        <h1 className="heading-font text-3xl md:text-4xl lg:text-5xl font-bold text-white">
          About PashuVaani
        </h1>
        <p className="heading-font text-lg md:text-xl lg:text-xl font-bold text-white">
          Animals communicate constantly
        </p>
      </div>
      </section>

      {/* Introduction */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-12 space-y-8">
          <div className="space-y-6">
            <p className="text-lg text-[#6F6F6F] leading-relaxed">
              Through their behaviour, posture, sounds, and subtle changes in activity, they express discomfort, illness, stress, and pain. 
              Yet for many farmers, pet owners, and animal caretakers, these signals are difficult to interpret until the situation becomes serious.
              This gap in understanding is one of the biggest challenges in animal care.
            </p>
            <p className="text-lg text-[#6F6F6F] leading-relaxed">
              PashuVaani <span className="font-semibold text-[#1F6559]">was created to bridge this gap.</span>
             {/* <span className="font-semibold text-[#1F6559]"> Veterinary Expertise</span>,
              <span className="font-semibold text-[#1F6559]"> Data Intelligence</span>, and
              <span className="font-semibold text-[#1F6559]"> Compassionate Design</span> to build a smarter future for animal care. */}
            </p>
            <p className="text-lg text-[#6F6F6F] leading-relaxed">
              PashuVaani is an<span className="font-semibold text-[#1F6559]"> AI-powered animal intelligence platform</span>, designed to help humans better understand the animals they care for. 
              By combining artificial intelligence with veterinary knowledge, the platform helps interpret symptoms, behavioural signals, and observable changes that may indicate potential health concerns.
              The goal is to support caretakers with early awareness and better understanding, so that they can take timely action when something seems wrong.
            </p>
            <p className="text-lg text-[#6F6F6F] leading-relaxed">
              However, PashuVaani is <span className="font-semibold text-[#1F6559]">not a replacement for veterinary professionals</span>.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-8">
            <div className="p-6 rounded-2xl bg-[#1F6559]/5 border border-[#1F6559]/20 space-y-3">
              <Sparkles className="w-10 h-10 text-[#1F6559]" />
              <h3 className="heading-font font-semibold text-[#333]">Artificial Intelligence</h3>
            </div>
            <div className="p-6 rounded-2xl bg-[#1F6559]/5 border border-[#1F6559]/20 space-y-3">
              <Heart className="w-10 h-10 text-[#1F6559]" />
              <h3 className="heading-font font-semibold text-[#333]">Veterinary Expertise</h3>
            </div>
            <div className="p-6 rounded-2xl bg-[#1F6559]/5 border border-[#1F6559]/20 space-y-3">
              <Zap className="w-10 h-10 text-[#1F6559]" />
              <h3 className="heading-font font-semibold text-[#333]">Data Intelligence</h3>
            </div>
            <div className="p-6 rounded-2xl bg-[#1F6559]/5 border border-[#1F6559]/20 space-y-3">
              <Shield className="w-10 h-10 text-[#1F6559]" />
              <h3 className="heading-font font-semibold text-[#333]">Compassionate Design</h3>
            </div>
          </div>

          <div className="space-y-6 pt-8">
            <p className="text-lg text-[#6F6F6F] leading-relaxed">
              Veterinarians play a critical role in diagnosing and treating animal health conditions. 
              PashuVaani is designed to assist and support, helping caretakers recognize early warning signs and guiding them toward seeking professional veterinary care when needed.            </p>
            <p className="text-lg text-[#6F6F6F] leading-relaxed">
              In this way, the platform works <span className="font-semibold text-[#1F6559]"> alongside veterinary expertise, </span> helping improve awareness and 
              decision-making in animal care.
            </p>
          </div>
        </div>
      </section>

      {/* Meet Gopu */}
      <section className="py-20 bg-gradient-to-b from-[#1FA7A6] via-[#38C2B4] to-[#78D65C]/10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <video
                src="/gopuhivideo2.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-auto object-cover max-w-md mx-auto rounded-3xl"
              />
            </div>
            <div className="order-1 lg:order-2 space-y-6">
              <div className="space-y-3">
                <h2 className="heading-font text-4xl font-bold text-[#333]">
                  Meet Gopu
                </h2>
                <p className="text-lg font-semibold text-[#FFFFFF]">The Heart of PashuVaani</p>
              </div>
              <p className="text-lg text-[#FFFFFF] leading-relaxed">
                Gopu is the friendly face of PashuVaani — your pet's intelligent health companion.
              </p>
              <p className="text-lg text-[#FFFFFF] leading-relaxed">
                <span className="font-semibold text-[#FFFFFF]">Warm, Caring, Always alert,</span> Behind Gopu is advanced AI technology,
                but what pet parents experience is simplicity, clarity, and reassurance. Because when your pet isn't well,
                you need guidance — not confusion.
              </p>
              <p className="text-lg text-[#FFFFFF] leading-relaxed">
                Gopu listens before he speaks — noticing subtle changes, asking the right questions, and helping you act early.
                He is designed to feel less like a tool and more like a trusted companion — one that stands by you in moments
                of worry and guides you with calm confidence.
              </p>
              <p className="text-lg text-[#1F6559] font-semibold italic">
                Gopu represents our belief that technology, when built with heart, can care as deeply as humans do.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Powered by Advanced AI */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6 space-y-8">
          <h2 className="heading-font text-4xl font-bold text-[#333] text-center">
            Powered by Advanced AI
          </h2>
          <p className="text-lg text-[#6F6F6F] leading-relaxed text-center">
            At the core of PashuVaani is our proprietary AI system designed to:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon: Target, text: "Understand symptoms" },
              { icon: Zap, text: "Analyse behavioural patterns" },
              { icon: Shield, text: "Provide first-level guidance" },
              { icon: Users, text: "Recommend next steps" },
              { icon: Heart, text: "Connect users with verified veterinary professionals" },
            ].map((item, idx) => (
              <div key={idx} className="flex items-start space-x-4 p-4">
                <div className="w-12 h-12 bg-[#1F6559]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-6 h-6 text-[#1F6559]" />
                </div>
                <p className="text-lg text-[#6F6F6F] pt-2">{item.text}</p>
              </div>
            ))}
          </div>
          <div className="space-y-6 pt-6">
            <p className="text-lg text-[#6F6F6F] leading-relaxed">
              Our AI is built to simplify decision-making and reduce panic during health concerns. Our AI doesn't diagnose —
              it supports decisions, helping pet parents understand urgency, reduce uncertainty, and take the right next step with confidence.
            </p>
            <p className="text-lg text-[#6F6F6F] leading-relaxed">
              Every interaction makes the system smarter, enabling continuous learning from real-world cases while staying grounded
              in veterinary science. Built with safety, accuracy, and empathy at its core, PashuVaani's AI acts as a reliable
              first line of support — available anytime, anywhere.
            </p>
          </div>
        </div>
      </section>

      {/* Starting with Pets */}
      <section className="py-20 bg-gradient-to-b from-[#1FA7A6] via-[#38C2B4] to-[#78D65C]/10">
        <div className="max-w-7xl mx-auto px-6">

          {/* Heading */}
          <div className="max-w-3xl mb-16">
            <div className="w-16 h-1 bg-gradient-to-r from-[#1F6559] to-[#4DB6AC] mb-6 rounded-full"></div>

            <h2 className="text-4xl md:text-5xl font-bold text-[#333] leading-tight">
              The Story Behind PashuVaani
            </h2>

            <p className="text-lg text-[#FFFFFF] mt-6 leading-relaxed">
              PashuVaani was born from a simple but powerful question —
              when an animal falls sick, why is it so difficult to find reliable guidance quickly?
            </p>
          </div>


          {/* 2 Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">


            {/* LEFT SIDE STORY */}
            <div className="space-y-6">

              <p className="text-lg text-[#FFFFFF] leading-relaxed">
                For many farmers and animal caregivers, health concerns begin with uncertainty.
                Symptoms appear, questions arise, and answers are often difficult to access in the
                moment they are needed most.
              </p>

              <p className="text-lg text-[#FFFFFF] leading-relaxed">
                Across farms and homes, animals represent more than value — they represent
                livelihoods, responsibility, and trust. Yet the systems supporting their healthcare
                often remain fragmented.
              </p>

              <p className="text-lg text-[#FFFFFF] leading-relaxed">
                For Mohan Vij, the founder of PashuVaani, this gap became impossible to ignore.
                Years of observing the realities of animal care revealed a pattern — when animals
                showed signs of illness, caregivers often had to rely on scattered information,
                delayed consultations, or uncertain advice.
              </p>

              <p className="text-lg text-[#FFFFFF] leading-relaxed">
                Technology had transformed industries across the world, yet animal healthcare still
                lacked intelligent tools that could guide caregivers when they needed help the most.
              </p>

              <p className="text-xl font-semibold text-[#1F6559] pt-2">
                That vision became PashuVaani — the Voice of Animal Health.
              </p>

            </div>


            {/* RIGHT SIDE HIGHLIGHT CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

              {[
                {
                  title: "Early Symptom Understanding",
                  desc: "Helping caregivers recognize early signs of illness before they become serious problems."
                },
                {
                  title: "Accessible Knowledge",
                  desc: "Providing instant guidance and reliable information anytime caregivers need help."
                },
                {
                  title: "Trusted Veterinary Support",
                  desc: "Connecting caregivers with expert knowledge and professional veterinary care."
                },
                {
                  title: "Smarter Animal Healthcare",
                  desc: "Building a technology-driven ecosystem for preventive and scalable animal health."
                }
              ].map((card, index) => (

                <div
                  key={index}
                  className="p-6 bg-teal-50 border border-[#EAEAEA] rounded-2xl shadow-sm hover:shadow-lg transition duration-300"
                >

                  <h3 className="text-lg font-semibold text-[#333] mb-2">
                    {card.title}
                  </h3>

                  <p className="text-[#6F6F6F] text-sm leading-relaxed">
                    {card.desc}
                  </p>

                </div>

              ))}

            </div>

          </div>

        </div>
      </section>
      {/* Long-Term Vision */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6 space-y-8">
          <h2 className="heading-font text-4xl font-bold text-[#333] text-center">
            Our Mission
          </h2>
          <p className="text-lg text-[#6F6F6F] leading-relaxed">
              Our mission is to <span className="font-semibold text-[#1F6559]"> help humans understand animals better through intelligent technology </span> while supporting responsible veterinary care.
            </p>
          <p className="text-lg text-[#6F6F6F] leading-relaxed text-center">
            By developing AI-powered tools that assist in interpreting animal health signals and behavioural patterns, PashuVaani aims to help caretakers recognize potential concerns earlier and make more informed decisions for the animals they care for.          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Globe, text: "Livestock health" },
              { icon: Award, text: "Dairy productivity" },
              { icon: Target, text: "Poultry management" },
              { icon: Shield, text: "Preventive animal healthcare intelligence" },
              { icon: Zap, text: "AI-driven disease mapping" },
            ].map((item, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-[#1F6559]/5 border border-[#1F6559]/20 space-y-3 text-center">
                <item.icon className="w-10 h-10 text-[#1F6559] mx-auto" />
                <p className="heading-font font-semibold text-[#333]">{item.text}</p>
              </div>
            ))}
          </div>
          <p className="text-xl text-[#1F6559] font-semibold text-center pt-6">
            Our vision is to become India's most trusted AI-powered animal health guardian.
          </p>
        </div>
      </section>

      {/* Why PashuVaani */}
      <section className="py-20 bg-gradient-to-b from-[#1FA7A6]/80 via-[#38C2B4]/80 to-[#78D65C]/10">
        <div className="max-w-5xl mx-auto px-6 space-y-8">
          <h2 className="heading-font text-4xl font-bold text-[#333] text-center">
            Why PashuVaani?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              "Farmers can recognize health concerns earlier",
              "Pet owners can better understand their animals’ behaviour",
              "Caretakers have access to intelligent guidance anytime",
              "Veterinary professionals are supported by better early awareness tools",
              "AI-driven health intelligence",
              "Emotionally connected brand (Gopu)"
            ].map((item, idx) => (
              <div key={idx} className="flex items-center space-x-3 p-4 bg-teal-50 rounded-xl border border-[#EAEAEA]">
                <div className="w-6 h-6 text-[#1F6559] font-bold text-xl flex-shrink-0">✓</div>
                <p className="text-lg text-[#6F6F6F]">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Philosophy */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
          <h2 className="heading-font text-4xl font-bold text-[#333]">
            Our Philosophy
          </h2>
          <p className="text-2xl text-[#6F6F6F] leading-relaxed">
            Technology should not replace care — it should enhance it.
          </p>
          <p className="text-lg text-[#6F6F6F] leading-relaxed">
            PashuVaani believes in blending:
          </p>
          <p className="text-2xl md:text-3xl font-bold text-[#1F6559]">
            Compassion + Intelligence + Accessibility
          </p>
          <p className="text-lg text-[#6F6F6F] leading-relaxed">
            to protect animal lives and support those who care for them.
          </p>
        </div>
      </section>

      {/* Who We Serve */}
      <section className="py-20 bg-gradient-to-b from-[#1FA7A6] via-[#38C2B4] to-[#78D65C]/10">
        <div className="max-w-5xl mx-auto px-6 space-y-8">
          <h2 className="heading-font text-4xl font-bold text-[#333] text-center">
            Who We Serve
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Heart, text: "Pet parents" },
              { icon: Shield, text: "Veterinary professionals" },
              { icon: Users, text: "Animal health partners" },
              { icon: Globe, text: "Future livestock & dairy ecosystems" },
            ].map((item, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-teal-50 border border-[#EAEAEA] space-y-3 text-center">
                <item.icon className="w-10 h-10 text-[#1F6559] mx-auto" />
                <p className="heading-font font-semibold text-[#333]">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#1F6559] text-white">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
          <h2 className="heading-font text-4xl font-bold">
            Join the PashuVaani Movement
          </h2>
          <div className="space-y-2">
            <p className="text-2xl font-semibold">Smarter care.</p>
            <p className="text-2xl font-semibold">Healthier animals.</p>
            <p className="text-2xl font-semibold">Peace of mind.</p>
          </div>
          <Button
            onClick={() => navigate('/gopu')}
            className="rounded-full bg-teal-50 text-[#1F6559] hover:bg-teal-50/90 px-8 py-6 text-lg font-semibold"
          >
            Get Started with Gopu AI
          </Button>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
