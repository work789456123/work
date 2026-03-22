import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Sparkles, Heart, Globe, Users, Shield, Zap, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

const Home = () => {
  const navigate = useNavigate();

  const slides = [
    { image: "/heropageimage.jpeg" },
    { image: "/slider1.jpeg" },
    { image: "/slider2.jpeg" },
    { image: "/slider3.jpeg" }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section with Fixed Tagline Structure */}
      <section className="relative bg-white py-12 md:py-24" data-testid="hero-section">
        <div className="max-w-[110rem] mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center">
            <div className="space-y-0 lg:col-span-5 text-center lg:text-left">
              {/* Main Heading */}
              <h1 className="heading-font text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-[#111111] leading-tight mb-0" data-testid="main-heading">
                PashuVaani
              </h1>

              {/* Tagline - EXACTLY as specified with inline styles */}
              <p className="text-xl md:text-2xl font-semibold text-[#1F6559]" style={{ marginTop: '10px', marginBottom: '18px' }}>
                The Voice of Animal Health
              </p>

              {/* Description */}
              <p className="text-base md:text-xl text-[#6F6F6F] leading-relaxed">
                AI-powered care for pets today.<br />
                Universal animal health ecosystem for tomorrow.
              </p>

              <Button
                onClick={() => window.dispatchEvent(new CustomEvent('openPromoModal'))}
                data-testid="get-started-btn"
                className="rounded-full bg-[#1F6559] text-white hover:bg-[#184F46] px-6 py-4 md:px-8 md:py-6 text-base md:text-lg mt-6"
              >
                Chat with Gopu AI
              </Button>
            </div>
            <div className="relative lg:col-span-7 lg:ml-4 flex justify-center lg:justify-end mt-8 lg:mt-0">
              <div className="bg-gradient-to-br from-[#1F6559]/10 to-transparent rounded-[2rem] flex items-center justify-center p-2 sm:p-4 group w-full">
                <div className="relative w-full overflow-hidden rounded-[1.5rem] shadow-xl">

                  <img
                    src={slides[currentSlide].image}
                    className="w-full h-auto max-h-[400px] sm:max-h-[500px] lg:max-h-[700px] object-contain transition-all duration-700 bg-white"
                  />

                  {/* Slider Controls */}
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <button 
                      onClick={() => setCurrentSlide(prev => (prev === 0 ? slides.length - 1 : prev - 1))}
                      className="p-2 rounded-full bg-white/90 hover:bg-white text-[#1F6559] shadow-lg transition-transform hover:scale-110"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                  </div>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <button 
                      onClick={() => setCurrentSlide(prev => (prev + 1) % slides.length)}
                      className="p-2 rounded-full bg-white/90 hover:bg-white text-[#1F6559] shadow-lg transition-transform hover:scale-110"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </div>

                  {/* Buttons for Slider 1 */}
                  {currentSlide === 0 && (
                    <div className="absolute bottom-4 sm:bottom-8 left-0 right-0 px-4 sm:px-8 flex flex-col sm:flex-row justify-center sm:justify-start gap-2 sm:gap-4 z-20">
                      <Button
                        onClick={() => window.dispatchEvent(new CustomEvent('openPromoModal'))}
                        className="rounded-full bg-[#1F6559] text-white hover:bg-[#184F46] px-4 py-2 sm:px-6 sm:py-3 shadow-lg text-sm sm:text-base w-full sm:w-auto"
                      >
                        Try Gopu AI
                      </Button>

                      <Button
                        onClick={() => navigate("/about")}
                        className="rounded-full bg-white text-[#1F6559] hover:bg-gray-50 px-4 py-2 sm:px-6 sm:py-3 shadow-lg text-sm sm:text-base w-full sm:w-auto"
                      >
                        Learn More
                      </Button>
                    </div>
                  )}

                  {/* Button for Slider 3 */}
                  {currentSlide === 2 && (
                    <div className="absolute bottom-8 left-0 right-0 px-8 flex justify-center sm:justify-start z-20">
                      <Button
                        onClick={() => window.dispatchEvent(new CustomEvent('openPromoModal'))}
                        className="rounded-full bg-[#1F6559] text-white hover:bg-[#184F46] px-6 py-3 shadow-lg"
                      >
                        Chat with Gopu
                      </Button>
                    </div>
                  )}
                  
                  {/* Button for Slider 4 */}
                  {currentSlide === 3 && (
                    <div className="absolute bottom-8 left-0 right-0 px-8 flex justify-center sm:justify-start z-20">
                      <Button
                        onClick={() => window.dispatchEvent(new CustomEvent('openPromoModal'))}
                        className="rounded-full bg-[#1F6559] text-white hover:bg-[#184F46] px-6 py-3 shadow-lg"
                      >
                        Chat with Gopu
                      </Button>
                    </div>
                  )}

                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About PashuVaani */}
      <section className="py-24 bg-gradient-to-r from-[#1FA7A6] via-[#38C2B4] to-[#78D65C]" data-testid="about-section">
        <div className="max-w-5xl mx-auto px-6 text-center space-y-6">
          <h2 className="heading-font text-4xl lg:text-5xl font-bold text-white">
            About PashuVaani
          </h2>
          <p className="text-lg text-white/90 leading-relaxed">
            PashuVaani is an AI-driven animal health platform dedicated to making intelligent, accessible,
            and preventive healthcare available for every animal.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pt-12">
            <div className="space-y-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto backdrop-blur-sm">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="heading-font font-semibold text-white">Artificial Intelligence</h3>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto backdrop-blur-sm">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h3 className="heading-font font-semibold text-white">Veterinary Expertise</h3>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto backdrop-blur-sm">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="heading-font font-semibold text-white">Data Intelligence</h3>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto backdrop-blur-sm">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="heading-font font-semibold text-white">Compassionate Design</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Meet Gopu */}
      <section className="py-24 bg-white" data-testid="meet-gopu-section">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
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
      <section className="py-24 bg-gradient-to-r from-[#1FA7A6] via-[#38C2B4] to-[#78D65C]" data-testid="why-section">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="heading-font text-4xl lg:text-5xl font-bold text-white text-center mb-16">
            Why PashuVaani?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "AI-driven health intelligence", icon: Sparkles },
              { title: "Human-centred design", icon: Users },
              { title: "Emotionally connected brand", icon: Heart },
              { title: "Scalable tech foundation", icon: Zap },
              { title: "Urban and rural ecosystems", icon: Globe },
              { title: "Trusted and secure", icon: Shield },
            ].map((item, idx) => (
              <div key={idx} className="p-8 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 space-y-4 hover:bg-white/20 transition-colors">
                <item.icon className="w-8 h-8 text-white" />
                <h3 className="heading-font text-lg font-semibold text-white">{item.title}</h3>
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

      {/* WhatsApp Floating Icon */}
      <a
        href="https://wa.me/917073041236"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center group"
      >
        <div className="absolute inset-0 bg-[#25D366] rounded-full animate-ping opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
        <div className="absolute inset-0 bg-[#25D366] rounded-full animate-pulse opacity-30 shadow-[0_0_15px_rgba(37,211,102,0.8)]"></div>
        <img
          src="https://cdn-icons-png.flaticon.com/512/733/733585.png"
          alt="WhatsApp"
          className="relative w-14 h-14 hover:scale-110 transition-transform drop-shadow-xl"
        />
      </a>

    </div>
  );
};

export default Home;