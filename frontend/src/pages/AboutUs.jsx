import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Sparkles, Heart, Shield, Zap, Globe, Users, Target, Award } from "lucide-react";

const AboutUs = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-[#1F6559]/5 to-white">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
          <h1 className="heading-font text-5xl lg:text-6xl font-bold text-[#111111]">
            About PashuVaani
          </h1>
          <p className="text-xl text-[#6F6F6F] leading-relaxed">
            Voice of Animal Health
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6 space-y-8">
          <div className="space-y-6">
            <p className="text-lg text-[#6F6F6F] leading-relaxed">
              PashuVaani is an AI-driven animal health platform dedicated to making intelligent, accessible, 
              and preventive healthcare available for every animal.
            </p>
            <p className="text-lg text-[#6F6F6F] leading-relaxed">
              We combine <span className="font-semibold text-[#1F6559]">Artificial Intelligence</span>, 
              <span className="font-semibold text-[#1F6559]"> Veterinary Expertise</span>, 
              <span className="font-semibold text-[#1F6559]"> Data Intelligence</span>, and 
              <span className="font-semibold text-[#1F6559]"> Compassionate Design</span> to build a smarter future for animal care.
            </p>
            <p className="text-lg text-[#6F6F6F] leading-relaxed">
              We are beginning our journey with pets — and building toward a universal animal health ecosystem.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 py-8">
            <div className="p-6 rounded-2xl bg-[#1F6559]/5 border border-[#1F6559]/20 space-y-3">
              <Sparkles className="w-10 h-10 text-[#1F6559]" />
              <h3 className="heading-font font-semibold text-[#111111]">Artificial Intelligence</h3>
            </div>
            <div className="p-6 rounded-2xl bg-[#1F6559]/5 border border-[#1F6559]/20 space-y-3">
              <Heart className="w-10 h-10 text-[#1F6559]" />
              <h3 className="heading-font font-semibold text-[#111111]">Veterinary Expertise</h3>
            </div>
            <div className="p-6 rounded-2xl bg-[#1F6559]/5 border border-[#1F6559]/20 space-y-3">
              <Zap className="w-10 h-10 text-[#1F6559]" />
              <h3 className="heading-font font-semibold text-[#111111]">Data Intelligence</h3>
            </div>
            <div className="p-6 rounded-2xl bg-[#1F6559]/5 border border-[#1F6559]/20 space-y-3">
              <Shield className="w-10 h-10 text-[#1F6559]" />
              <h3 className="heading-font font-semibold text-[#111111]">Compassionate Design</h3>
            </div>
          </div>

          <div className="space-y-6 pt-8">
            <p className="text-lg text-[#6F6F6F] leading-relaxed">
              PashuVaani exists to answer a simple but powerful question: <span className="font-semibold text-[#111111]">What if animal healthcare could be proactive instead of reactive?</span>
            </p>
            <p className="text-lg text-[#6F6F6F] leading-relaxed">
              By combining technology with empathy, we aim to empower pet parents and caregivers with timely insights, 
              trusted guidance, and peace of mind — exactly when it matters most.
            </p>
            <p className="text-lg text-[#6F6F6F] leading-relaxed">
              Our mission is to make animal health intelligence available not just to a few, but to every household, 
              clinic, and community that cares for animals.
            </p>
          </div>
        </div>
      </section>

      {/* Meet Gopu */}
      <section className="py-20 bg-[#FAFAFA]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <img
                src="https://customer-assets.emergentagent.com/job_73651be8-bbea-4eee-a6be-0162100b6ac1/artifacts/mumll039_Gopu%20Ai%20Image.png"
                alt="Gopu - The Heart of PashuVaani"
                className="w-full max-w-md mx-auto"
              />
            </div>
            <div className="order-1 lg:order-2 space-y-6">
              <div className="space-y-3">
                <h2 className="heading-font text-4xl font-bold text-[#111111]">
                  Meet Gopu
                </h2>
                <p className="text-lg font-semibold text-[#1F6559]">The Heart of PashuVaani</p>
              </div>
              <p className="text-lg text-[#6F6F6F] leading-relaxed">
                Gopu is the friendly face of PashuVaani — your pet's intelligent health companion.
              </p>
              <p className="text-lg text-[#6F6F6F] leading-relaxed">
                <span className="font-semibold text-[#111111]">Warm. Caring. Always alert.</span> Behind Gopu is advanced AI technology, 
                but what pet parents experience is simplicity, clarity, and reassurance. Because when your pet isn't well, 
                you need guidance — not confusion.
              </p>
              <p className="text-lg text-[#6F6F6F] leading-relaxed">
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
          <h2 className="heading-font text-4xl font-bold text-[#111111] text-center">
            Powered by Advanced AI
          </h2>
          <p className="text-lg text-[#6F6F6F] leading-relaxed text-center">
            At the core of PashuVaani is our proprietary AI system designed to:
          </p>
          <div className="grid md:grid-cols-2 gap-6">
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
      <section className="py-20 bg-[#FAFAFA]">
        <div className="max-w-5xl mx-auto px-6 space-y-8">
          <h2 className="heading-font text-4xl font-bold text-[#111111] text-center">
            Starting with Pets
          </h2>
          <p className="text-lg text-[#6F6F6F] leading-relaxed">
            We are launching with pet healthcare to:
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              "Provide instant symptom guidance",
              "Offer vaccination and preventive reminders",
              "Help pet parents make informed decisions",
              "Bridge the gap between home care and clinical care"
            ].map((item, idx) => (
              <div key={idx} className="flex items-start space-x-3 p-4 bg-white rounded-xl border border-[#EAEAEA]">
                <div className="w-2 h-2 bg-[#1F6559] rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-lg text-[#6F6F6F]">{item}</p>
              </div>
            ))}
          </div>
          <div className="space-y-6 pt-6">
            <p className="text-lg text-[#6F6F6F] leading-relaxed">
              <span className="font-semibold text-[#111111]">Pets are family — and their care should be intelligent, accessible, and trustworthy.</span>
            </p>
            <p className="text-lg text-[#6F6F6F] leading-relaxed">
              Pets are often unable to express discomfort clearly — and small signs are easy to miss. PashuVaani helps pet parents 
              notice early signals before they become serious problems.
            </p>
            <p className="text-lg text-[#6F6F6F] leading-relaxed">
              By starting with pets, we are building a deeply personal, trust-led experience that forms the foundation for larger 
              animal health ecosystems. What begins as care for pets becomes a blueprint for scalable, preventive animal healthcare across India.
            </p>
          </div>
        </div>
      </section>

      {/* Long-Term Vision */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6 space-y-8">
          <h2 className="heading-font text-4xl font-bold text-[#111111] text-center">
            Our Long-Term Vision
          </h2>
          <p className="text-lg text-[#6F6F6F] leading-relaxed text-center">
            While we begin with pets, PashuVaani is designed to scale into:
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Globe, text: "Livestock health" },
              { icon: Award, text: "Dairy productivity" },
              { icon: Target, text: "Poultry management" },
              { icon: Shield, text: "Preventive animal healthcare intelligence" },
              { icon: Zap, text: "AI-driven disease mapping" },
            ].map((item, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-[#1F6559]/5 border border-[#1F6559]/20 space-y-3 text-center">
                <item.icon className="w-10 h-10 text-[#1F6559] mx-auto" />
                <p className="heading-font font-semibold text-[#111111]">{item.text}</p>
              </div>
            ))}
          </div>
          <p className="text-xl text-[#1F6559] font-semibold text-center pt-6">
            Our vision is to become India's most trusted AI-powered animal health guardian.
          </p>
        </div>
      </section>

      {/* Why PashuVaani */}
      <section className="py-20 bg-[#FAFAFA]">
        <div className="max-w-5xl mx-auto px-6 space-y-8">
          <h2 className="heading-font text-4xl font-bold text-[#111111] text-center">
            Why PashuVaani?
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              "AI-driven health intelligence",
              "Human-centred design",
              "Emotionally connected brand (Gopu)",
              "Scalable tech foundation",
              "Built for both urban and rural ecosystems"
            ].map((item, idx) => (
              <div key={idx} className="flex items-center space-x-3 p-4 bg-white rounded-xl border border-[#EAEAEA]">
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
          <h2 className="heading-font text-4xl font-bold text-[#111111]">
            Our Philosophy
          </h2>
          <p className="text-2xl text-[#6F6F6F] leading-relaxed">
            Technology should not replace care — it should enhance it.
          </p>
          <p className="text-lg text-[#6F6F6F] leading-relaxed">
            PashuVaani believes in blending:
          </p>
          <p className="text-3xl font-bold text-[#1F6559]">
            Compassion + Intelligence + Accessibility
          </p>
          <p className="text-lg text-[#6F6F6F] leading-relaxed">
            to protect animal lives and support those who care for them.
          </p>
        </div>
      </section>

      {/* Who We Serve */}
      <section className="py-20 bg-[#FAFAFA]">
        <div className="max-w-5xl mx-auto px-6 space-y-8">
          <h2 className="heading-font text-4xl font-bold text-[#111111] text-center">
            Who We Serve
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: Heart, text: "Pet parents" },
              { icon: Shield, text: "Veterinary professionals" },
              { icon: Users, text: "Animal health partners" },
              { icon: Globe, text: "Future livestock & dairy ecosystems" },
            ].map((item, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-white border border-[#EAEAEA] space-y-3 text-center">
                <item.icon className="w-10 h-10 text-[#1F6559] mx-auto" />
                <p className="heading-font font-semibold text-[#111111]">{item.text}</p>
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
            className="rounded-full bg-white text-[#1F6559] hover:bg-white/90 px-8 py-6 text-lg font-semibold"
          >
            Get Started with Gopu AI
          </Button>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
