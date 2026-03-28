import { Heart, Shield, Users, Globe } from "lucide-react";
import { aboutWhoWeServe } from "@/assets/about";

const whoIcons = { heart: Heart, shield: Shield, users: Users, globe: Globe };

export default function AboutWhoWeServeSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-[#1FA7A6] via-[#38C2B4] to-[#78D65C]/10">
      <div className="max-w-5xl mx-auto px-6 space-y-8">
        <h2 className="heading-font text-4xl font-bold text-[#333] text-center">{aboutWhoWeServe.title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {aboutWhoWeServe.items.map((item) => {
            const Icon = whoIcons[item.icon];
            return (
              <div
                key={item.text}
                className="p-6 rounded-2xl bg-teal-50 border border-[#EAEAEA] space-y-3 text-center"
              >
                <Icon className="w-10 h-10 text-[#1F6559] mx-auto" />
                <p className="heading-font font-semibold text-[#333]">{item.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
