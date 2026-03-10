const About = () => {
  const founders = [
    {
      name: "Mr. Mohan Vij",
      role: "Co-Founder & CEO",
      image: "https://customer-assets.emergentagent.com/job_73651be8-bbea-4eee-a6be-0162100b6ac1/artifacts/ni8cmuaj_Mohan%20Vij.jpeg",
      story: "For Mr. Mohan Vij, the idea behind PashuVaani began with a simple realization — when animals fall sick, people often feel helpless. With a strong entrepreneurial drive and a vision to create meaningful impact, he set out to build a platform that would combine technology with compassion."
    },
    {
      name: "Mr. Utkarsh Srivastava",
      role: "Co-Founder, CTO & COO",
      image: "https://customer-assets.emergentagent.com/job_73651be8-bbea-4eee-a6be-0162100b6ac1/artifacts/r2osltwb_Utkarsh%20Srivastava.jpeg",
      story: "For Mr. Utkarsh Srivastava, the mission was about building something scalable, intelligent, and dependable. He believed that artificial intelligence could do more than automate conversations — it could become a protective layer for animals and a decision-support system for their caregivers."
    },
    {
      name: "Mrs. Archana Srivastava",
      role: "Advisor",
      image: "https://customer-assets.emergentagent.com/job_73651be8-bbea-4eee-a6be-0162100b6ac1/artifacts/wpt18fyw_Archana%20Srivastava.jpeg",
      story: "A trusted advisor bringing experience and strategic guidance to PashuVaani's mission."
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA]" data-testid="about-page">
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
          <h1 className="heading-font text-4xl lg:text-5xl font-bold text-[#111111]" data-testid="about-heading">Our Story</h1>
          <p className="text-xl text-[#6F6F6F] leading-relaxed">
            Why We Built PashuVaani
          </p>
          <p className="text-lg text-[#6F6F6F] leading-relaxed">
            PashuVaani was not born in a boardroom. It was born from observation, concern, and a deep belief 
            that animal healthcare deserves to be smarter, faster, and more accessible.
          </p>
        </div>
      </section>

      <section className="py-24 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="heading-font text-3xl lg:text-4xl font-bold text-[#111111] text-center mb-16">From the Desk of the Founders</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {founders.map((founder, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl border border-[#EAEAEA] space-y-6" data-testid="founder-card">
                <img src={founder.image} alt={founder.name} className="w-32 h-32 rounded-full mx-auto object-cover" data-testid="founder-image" />
                <div className="text-center">
                  <h3 className="heading-font text-xl font-semibold text-[#111111]" data-testid="founder-name">{founder.name}</h3>
                  <p className="text-sm text-[#0F766E] font-medium">{founder.role}</p>
                </div>
                <p className="text-sm text-[#6F6F6F] leading-relaxed">{founder.story}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 space-y-12">
          <div className="space-y-6">
            <h2 className="heading-font text-3xl font-bold text-[#111111]">Why We Started with Pets</h2>
            <p className="text-lg text-[#6F6F6F] leading-relaxed">
              We chose to begin with pets because they are family. When a pet is unwell, emotions run high. 
              Decisions must be made quickly. Reliable guidance matters. By starting with pets, we are building 
              a foundation of trust, empathy, and intelligent care — before expanding into a universal animal health ecosystem.
            </p>
          </div>

          <div className="space-y-6">
            <h2 className="heading-font text-3xl font-bold text-[#111111]">The Birth of Gopu</h2>
            <p className="text-lg text-[#6F6F6F] leading-relaxed">
              As we built the platform, we realized something important: People do not connect with algorithms. 
              They connect with warmth. That is how Gopu was born — not just as a mascot, but as a symbol of protection, 
              intelligence, and reassurance. Gopu represents what we stand for: Compassion powered by technology.
            </p>
          </div>

          <div className="space-y-6">
            <h2 className="heading-font text-3xl font-bold text-[#111111]">The Road Ahead</h2>
            <p className="text-lg text-[#6F6F6F] leading-relaxed">
              PashuVaani is more than an app. It is a long-term commitment to preventive animal healthcare, 
              intelligent decision support, reduced disease losses, and stronger, more confident caregivers. 
              We are building a future where no pet parent or animal caretaker feels alone during a health concern.
            </p>
            <p className="text-lg text-[#0F766E] font-semibold">And this is just the beginning.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;