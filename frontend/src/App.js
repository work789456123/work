import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Home from "@/pages/Home";
import GopuChat from "@/pages/GopuChat";
import Doctors from "@/pages/Doctors";
import Appointments from "@/pages/Appointments";
import Product from "@/pages/Product";
import Blogs from "@/pages/Blogs";
import BlogDetail from "@/pages/BlogDetail";
import AboutUs from "@/pages/AboutUs";
import OurStory from "@/pages/OurStory";
import Contact from "@/pages/Contact";
import Careers from "@/pages/Careers";
import PashuCareSurakshaPlan from "@/pages/PashuCareSurakshaPlan";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";
import "@/App.css";

function App() {
  return (
    <div className="App min-h-screen flex flex-col">
      <BrowserRouter>
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/gopu" element={<GopuChat />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/product" element={<Product />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/blogs/:id" element={<BlogDetail />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/our-story" element={<OurStory />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/pashucare-suraksha-plan" element={<PashuCareSurakshaPlan />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Routes>
        </main>
        <Footer />
        <Toaster position="top-right" />
      </BrowserRouter>
    </div>
  );
}

export default App;
