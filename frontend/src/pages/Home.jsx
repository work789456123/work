import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Sparkles, Heart, Globe, Users, Shield, Zap } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section with Fixed Tagline Structure */}
      <section className="relative bg-white py-24" data-testid="hero-section">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-0">
              {/* Main Heading */}
              <h1 className="heading-font text-6xl lg:text-7xl font-bold text-[#111111] leading-tight mb-0" data-testid="main-heading">
                PashuVaani
              </h1>
              
              {/* Tagline - EXACTLY as specified with inline styles */}
              <p className="text-2xl font-semibold text-[#1F6559]" style={{marginTop: '10px', marginBottom: '18px'}}>
                The Voice of Animal Health
              </p>
              
              {/* Description */}
              <p className="text-xl text-[#6F6F6F] leading-relaxed">
                AI-powered care for pets today.<br/>
                Universal animal health ecosystem for tomorrow.
              </p>
              
              <Button
                onClick={() => navigate('/gopu')}
                data-testid="get-started-btn"
                className="rounded-full bg-[#1F6559] text-white hover:bg-[#184F46] px-8 py-6 text-lg mt-6"
              >
                Chat with Gopu AI
              </Button>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-[#1F6559]/10 to-transparent rounded-3xl flex items-center justify-center">
                <img
                  src="https://customer-assets.emergentagent.com/job_73651be8-bbea-4eee-a6be-0162100b6ac1/artifacts/mumll039_Gopu%20Ai%20Image.png"
                  alt="Gopu AI"
                  className="w-3/4 h-3/4 object-contain"
                  data-testid="gopu-hero-image"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About PashuVaani */}
      <section className="py-24 bg-[#FAFAFA]" data-testid="about-section">
        <div className="max-w-5xl mx-auto px-6 text-center space-y-6">
          <h2 className="heading-font text-4xl lg:text-5xl font-bold text-[#111111]">
            About PashuVaani
          </h2>
          <p className="text-lg text-[#6F6F6F] leading-relaxed">
            PashuVaani is an AI-driven animal health platform dedicated to making intelligent, accessible, 
            and preventive healthcare available for every animal.
          </p>
          <div className="grid md:grid-cols-4 gap-8 pt-12">
            <div className="space-y-3">
              <div className="w-12 h-12 bg-[#1F6559]/10 rounded-xl flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6 text-[#1F6559]" />
              </div>
              <h3 className="heading-font font-semibold text-[#111111]">Artificial Intelligence</h3>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 bg-[#1F6559]/10 rounded-xl flex items-center justify-center mx-auto">
                <Heart className="w-6 h-6 text-[#1F6559]" />
              </div>
              <h3 className="heading-font font-semibold text-[#111111]">Veterinary Expertise</h3>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 bg-[#1F6559]/10 rounded-xl flex items-center justify-center mx-auto">
                <Zap className="w-6 h-6 text-[#1F6559]" />
              </div>
              <h3 className="heading-font font-semibold text-[#111111]">Data Intelligence</h3>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 bg-[#1F6559]/10 rounded-xl flex items-center justify-center mx-auto">
                <Shield className="w-6 h-6 text-[#1F6559]" />
              </div>
              <h3 className="heading-font font-semibold text-[#111111]">Compassionate Design</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Meet Gopu */}
      <section className="py-24 bg-white" data-testid="meet-gopu-section">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <img
                src="https://customer-assets.emergentagent.com/job_73651be8-bbea-4eee-a6be-0162100b6ac1/artifacts/mumll039_Gopu%20Ai%20Image.png"
                alt="Gopu - The Heart of PashuVaani"
                className="w-full max-w-md mx-auto"
                data-testid="gopu-character-image"
              />
            </div>
            <div className="order-1 lg:order-2 space-y-6">
              <h2 className="heading-font text-4xl lg:text-5xl font-bold text-[#111111]">
                Meet Gopu
              </h2>
              <p className="text-sm font-medium text-[#1F6559]">The Heart of PashuVaani</p>
              <p className="text-lg text-[#6F6F6F] leading-relaxed">
                Gopu is the friendly face of PashuVaani — your pet's intelligent health companion. 
                Warm. Caring. Always alert. Behind Gopu is advanced AI technology, but what pet parents 
                experience is simplicity, clarity, and reassurance.
              </p>
              <p className="text-lg text-[#6F6F6F] leading-relaxed">
                Gopu listens before he speaks — noticing subtle changes, asking the right questions, 
                and helping you act early. He is designed to feel less like a tool and more like a trusted 
                companion — one that stands by you in moments of worry and guides you with calm confidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why PashuVaani */}
      <section className="py-24 bg-[#FAFAFA]" data-testid="why-section">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="heading-font text-4xl lg:text-5xl font-bold text-[#111111] text-center mb-16">
            Why PashuVaani?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "AI-driven health intelligence", icon: Sparkles },
              { title: "Human-centred design", icon: Users },
              { title: "Emotionally connected brand", icon: Heart },
              { title: "Scalable tech foundation", icon: Zap },
              { title: "Urban and rural ecosystems", icon: Globe },
              { title: "Trusted and secure", icon: Shield },
            ].map((item, idx) => (
              <div key={idx} className="p-8 bg-white rounded-2xl border border-[#EAEAEA] space-y-4">
                <item.icon className="w-8 h-8 text-[#1F6559]" />
                <h3 className="heading-font text-lg font-semibold text-[#111111]">{item.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Philosophy */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
          <h2 className="heading-font text-4xl lg:text-5xl font-bold text-[#111111]">
            Our Philosophy
          </h2>
          <p className="text-2xl text-[#6F6F6F] leading-relaxed">
            Technology should not replace care — it should enhance it.
          </p>
          <p className="text-lg text-[#6F6F6F] leading-relaxed">
            PashuVaani believes in blending <span className="font-semibold text-[#1F6559]">Compassion + Intelligence + Accessibility</span>
            {" "}to protect animal lives and support those who care for them.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[#1F6559] text-white" data-testid="cta-section">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
          <h2 className="heading-font text-4xl lg:text-5xl font-bold">
            Join the PashuVaani Movement
          </h2>
          <p className="text-xl opacity-90">
            Smarter care. Healthier animals. Peace of mind.
          </p>
          <Button
            onClick={() => navigate('/gopu')}
            data-testid="cta-button"
            className="rounded-full bg-white text-[#1F6559] hover:bg-white/90 px-8 py-6 text-lg font-semibold"
          >
            Get Started Now
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;