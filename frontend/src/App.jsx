import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

// PUBLIC PAGES
import Home from "./pages/user/Home/Home";
import GopuChat from "./pages/user/Gopu/GopuChat";
import Doctors from "./pages/user/Doctors";
import AppointmentsPage from "./pages/user/Appointments/AppointmentsPage";
import Product from "./pages/user/Product";
import Blogs from "./pages/user/Blogs";
import BlogDetail from "./pages/user/BlogDetail";
import AboutUs from "./pages/user/AboutUs/AboutUs";
import OurStory from "./pages/user/OurStory";
import Contact from "./pages/user/Contact";
import Careers from "./pages/user/Careers";
import PashuCareSurakshaPlan from "./pages/user/PashuCareSurakshaPlan";
import TermsAndConditions from "./pages/user/TermsAndConditions/TermsAndConditions";
import PrivacyPolicy from "./pages/user/PrivacyPolicy/PrivacyPolicy";

import "./App.css";
import Layout from "./Layout";




function App() {

  return (
    <HelmetProvider>
    <div className="App min-h-screen flex flex-col">

      <BrowserRouter>
        <Routes>

          {/* ================= PUBLIC ROUTES ================= */}
          <Route path="/" element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/gopu" element={<GopuChat />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/appointments" element={<AppointmentsPage />} />
            <Route path="/product" element={<Product />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/blogs/:id" element={<BlogDetail />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/our-story" element={<OurStory />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/pashucare-suraksha-plan" element={<PashuCareSurakshaPlan />} />
            <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />


            {/* ================= 404 PAGE ================= */}

            <Route
              path="*"
              element={
                <h1 className="text-center text-3xl mt-20">
                  404 Page Not Found
                </h1>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>

    </div>
    </HelmetProvider>
  );

}

export default App;