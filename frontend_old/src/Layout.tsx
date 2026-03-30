import { Outlet } from "react-router-dom"
import Navbar from "./components/Navbar/Navbar"
import Footer from "./components/Footer"
import { Toaster } from "sonner"
import TermsModal from "./components/TermsModal"
import PromoModal from "./components/PromoModal"
import ScrollToTop from "./components/ScrollToTop"

function Layout() {
    return (
        <>
            <ScrollToTop />
            <Navbar />
            <main className="flex-1 [overflow-anchor:none]">
                <Outlet />
            </main>
            <Footer />
            <Toaster position="top-right" />
            <TermsModal />
            <PromoModal />
        </>
    )
}

export default Layout