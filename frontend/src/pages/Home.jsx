import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Sparkles, Heart, Globe, Users, Shield, Zap } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section with Fixed Tagline Structure */}
      {/* Hero Section with Fixed Tagline Structure */}
      <section className="relative overflow-hidden pt-32 pb-24" data-testid="hero-section">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary/5 to-transparent -z-10"></div>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-4">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Next-Gen Healthcare
              </div>
              
              <h1 className="heading-font text-7xl lg:text-9xl font-black text-slate-900 tracking-tighter leading-[0.85]" data-testid="main-heading">
                Pashu<span className="text-primary italic">Vaani</span>
              </h1>
              
              <p className="text-2xl font-bold text-primary tracking-tight" style={{marginTop: '20px', marginBottom: '24px'}}>
                The intelligent voice of animal health.
              </p>
              
              <p className="text-xl text-slate-500 leading-relaxed font-medium max-w-lg">
                AI-powered diagnostics for pets today. <br/>
                A universal health ecosystem for the future.
              </p>
              
              <div className="flex gap-4 pt-6">
                <Button
                  onClick={() => navigate('/gopu')}
                  data-testid="get-started-btn"
                  className="rounded-2xl bg-primary text-white hover:bg-primary-hover px-10 py-8 text-lg font-black uppercase tracking-widest shadow-2xl shadow-primary/30 transition-all hover:-translate-y-1 active:scale-95"
                >
                  Meet Gopu AI
                </Button>
                <Button
                  onClick={() => navigate('/appointments')}
                  variant="outline"
                  className="rounded-2xl border-slate-200 text-slate-600 hover:bg-slate-50 px-10 py-8 text-lg font-bold"
                >
                  Find a Doctor
                </Button>
              </div>
            </div>
            <div className="relative group">
              <div className="absolute -inset-4 bg-primary/20 rounded-[3rem] blur-3xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
              <div className="relative aspect-square glass-morphism !bg-white/40 dark:!bg-white/5 rounded-[4rem] flex items-center justify-center p-12 overflow-hidden border-white/40 shadow-2xl transform hover:rotate-1 transition-transform duration-700">
                <img
                  src="https://customer-assets.emergentagent.com/job_73651be8-bbea-4eee-a6be-0162100b6ac1/artifacts/mumll039_Gopu%20Ai%20Image.png"
                  alt="Gopu AI"
                  className="w-full h-full object-contain scale-110 group-hover:scale-125 transition-transform duration-1000"
                  data-testid="gopu-hero-image"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About PashuVaani */}
      <section className="py-32 bg-slate-50/50" data-testid="about-section">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="heading-font text-5xl lg:text-6xl font-black text-slate-900 tracking-tighter mb-6">
            PashuVaani Philosophy
          </h2>
          <p className="text-xl text-slate-500 leading-relaxed max-w-3xl mx-auto font-medium">
            We are building an AI-driven animal health platform dedicated to making intelligent, 
            accessible, and preventive healthcare available for every life.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-20">
            <div className="glass-card p-10 group hover:-translate-y-2">
              <div className="size-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h3 className="heading-font font-black text-xs uppercase tracking-widest text-slate-900">AI Logic</h3>
            </div>
            <div className="glass-card p-10 group hover:-translate-y-2">
              <div className="size-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Heart className="w-8 h-8 text-primary" />
              </div>
              <h3 className="heading-font font-black text-xs uppercase tracking-widest text-slate-900">Compassion</h3>
            </div>
            <div className="glass-card p-10 group hover:-translate-y-2">
              <div className="size-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <h3 className="heading-font font-black text-xs uppercase tracking-widest text-slate-900">Intelligence</h3>
            </div>
            <div className="glass-card p-10 group hover:-translate-y-2">
              <div className="size-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="heading-font font-black text-xs uppercase tracking-widest text-slate-900">Security</h3>
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
      <section className="py-32 bg-white" data-testid="why-section">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="heading-font text-5xl lg:text-6xl font-black text-slate-900 tracking-tighter mb-4">
                Why PashuVaani?
              </h2>
              <p className="text-lg text-slate-500 font-medium">Built for the modern pet parent and the global livestock ecosystem.</p>
            </div>
            <Button variant="link" className="text-primary font-black uppercase tracking-widest text-xs">Explore all features</Button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "AI-driven health intelligence", icon: Sparkles, desc: "Real-time diagnostics and predictive analytics." },
              { title: "Human-centred design", icon: Users, desc: "Simple, intuitive interface for everyone." },
              { title: "Emotionally connected", icon: Heart, desc: "Technology that understands the bond." },
              { title: "Scalable tech foundation", icon: Zap, desc: "Built to serve millions of animals globally." },
              { title: "Urban & rural ecosystems", icon: Globe, desc: "Bridging the gap in veterinary access." },
              { title: "Trusted and secure", icon: Shield, desc: "Your data is protected and private." },
            ].map((item, idx) => (
              <div key={idx} className="glass-card p-10 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 group">
                <item.icon className="w-10 h-10 text-primary mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="heading-font text-xl font-black text-slate-900 tracking-tight mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500 font-medium">{item.desc}</p>
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