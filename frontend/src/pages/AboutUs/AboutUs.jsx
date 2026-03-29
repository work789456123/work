import AboutHeroSection from "./components/AboutHeroSection";
import AboutIntroPillarsVetSection from "./components/AboutIntroPillarsVetSection";
import AboutMeetGopuSection from "./components/AboutMeetGopuSection";
import AboutPoweredBySection from "./components/AboutPoweredBySection";
import AboutStorySection from "./components/AboutStorySection";
import AboutMissionSection from "./components/AboutMissionSection";
import AboutWhySection from "./components/AboutWhySection";
import AboutPhilosophySection from "./components/AboutPhilosophySection";
import AboutWhoWeServeSection from "./components/AboutWhoWeServeSection";
import AboutClosingCtaSection from "./components/AboutClosingCtaSection";
import UserPageShell from "@/motion/UserPageShell";

const AboutUs = () => (
  <UserPageShell id="page-about-us" className="min-h-screen bg-teal-50">
    <AboutHeroSection />
    <AboutIntroPillarsVetSection />
    <AboutMeetGopuSection />
    <AboutPoweredBySection />
    <AboutStorySection />
    <AboutMissionSection />
    <AboutWhySection />
    <AboutPhilosophySection />
    <AboutWhoWeServeSection />
    <AboutClosingCtaSection />
  </UserPageShell>
);

export default AboutUs;
