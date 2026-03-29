import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

// PUBLIC PAGES
import Home from "./pages/Home/Home";
import GopuChat from "./pages/Gopu/GopuChat";
import Doctors from "./pages/Doctors";
import AppointmentsPage from "./pages/Appointments/AppointmentsPage";
import Product from "./pages/Product";
import Blogs from "./pages/Blogs";
import BlogDetail from "./pages/BlogDetail";
import AboutUs from "./pages/AboutUs/AboutUs";
import OurStory from "./pages/OurStory";
import Contact from "./pages/Contact";
import Careers from "./pages/Careers";
import PashuCareSurakshaPlan from "./pages/PashuCareSurakshaPlan";
import TermsAndConditions from "./pages/TermsAndConditions/TermsAndConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy/PrivacyPolicy";

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