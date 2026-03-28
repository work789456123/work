import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useReducer } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { toast } from "sonner";
import api from "@/utils/api";
import { brand } from "@/assets/content/shared/brand";
import { primaryNav } from "@/assets/content/shared/navigation";
import { navbarReducer, initialNavbarState } from "@/components/user/Navbar/navbarReducer";
import NavbarDesktopNav from "@/components/user/Navbar/components/NavbarDesktopNav";
import NavbarMobileMenu from "@/components/user/Navbar/components/NavbarMobileMenu";
import NavbarToolbar from "@/components/user/Navbar/components/NavbarToolbar";
import { NavbarAuthDialog, NavbarPetDialog } from "@/components/user/Navbar/components/NavbarDialogs";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [state, dispatch] = useReducer(navbarReducer, initialNavbarState);

  useEffect(() => {
    const token = localStorage.getItem("token");
    dispatch({ type: "SET_LOGGED_IN", value: !!token });

    const handleOpenAuth = () => dispatch({ type: "SHOW_AUTH" });
    window.addEventListener("openAuthModal", handleOpenAuth);
    return () => window.removeEventListener("openAuthModal", handleOpenAuth);
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      const endpoint = state.authMode === "login" ? "/auth/login" : "/auth/register";
      const response = await api.post(endpoint, state.formData);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user_name", response.data.full_name);
      dispatch({
        type: "AUTH_SUCCESS",
        showPetDialog: state.authMode === "register",
      });
      window.dispatchEvent(new CustomEvent("authSuccess"));
      toast.success("Logged in successfully");
    } catch (error) {
      toast.error(error.response?.data?.detail || "Authentication failed");
    }
  };

  const handleAddPet = async (e) => {
    e.preventDefault();
    try {
      await api.post("/pets", state.petData);
      toast.success("Pet added successfully!");
      dispatch({ type: "SET_SHOW_ADD_PET", value: false });
      dispatch({ type: "RESET_PET_FORM" });
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to add pet");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_name");
    dispatch({ type: "LOGOUT" });
    navigate("/");
    toast.success("Logged out successfully");
  };

  const handleGopuClick = () => {
    if (!state.isLoggedIn) {
      dispatch({ type: "SHOW_AUTH" });
    } else {
      window.dispatchEvent(new CustomEvent("openPromoModal"));
    }
  };

  if (location.pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <>
      <nav id="user-navbar" className="sticky top-0 z-50 bg-[#1F6559] shadow-md">
        <div id="user-navbar-inner" className="max-w-[1400px] mx-auto  px-4 sm:px-6 lg:px-2">
          <div id="user-navbar-bar" className="flex items-center justify-between h-20">
            <Button
              variant="ghost"
              size="icon"
              className="max-lg:hidden xl:hidden text-white hover:bg-white/10"
              onClick={() => dispatch({ type: "TOGGLE_MOBILE_MENU" })}
              data-testid="mobile-menu-toggle"
            >
              {state.mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
            <Link
              id="user-navbar-brand"
              to="/"
              className="flex items-center z-50 mr-auto shrink-0"
              data-testid="logo-link"
            >
              <img
                src="/pvhalflogo.png"
                alt={brand.logoAlt}
                className="h-10 sm:h-12 md:h-16 w-auto object-contain"
                style={{ maxHeight: "150px" }}
              />
              <span className="text-xl sm:text-[1.25rem] md:text-2xl font-bold tracking-tight bg-gradient-to-r from-[#1FA7A6] via-[#38C2B4] to-[#78D65C] bg-clip-text text-transparent ">
                {brand.name}
              </span>
            </Link>

            <NavbarDesktopNav primaryNav={primaryNav} />

            <NavbarToolbar
              mobileMenuOpen={state.mobileMenuOpen}
              onToggleMobile={() => dispatch({ type: "TOGGLE_MOBILE_MENU" })}
              isLoggedIn={state.isLoggedIn}
              onGopuClick={handleGopuClick}
              onLogout={handleLogout}
              onOpenAuth={() => dispatch({ type: "SHOW_AUTH" })}
            />
          </div>

          <NavbarMobileMenu
            open={state.mobileMenuOpen}
            rakshaOpen={state.rakshaOpen}
            isLoggedIn={state.isLoggedIn}
            onClose={() => dispatch({ type: "SET_MOBILE_MENU", value: false })}
            onToggleRaksha={() => dispatch({ type: "TOGGLE_RAKSHA" })}
            onGopuClick={handleGopuClick}
            onLogout={handleLogout}
            onOpenAuth={() => dispatch({ type: "SHOW_AUTH" })}
          />
        </div>
      </nav>

      <NavbarAuthDialog
        open={state.showAuth}
        onOpenChange={(v) => dispatch({ type: "SET_SHOW_AUTH", value: v })}
        authMode={state.authMode}
        formData={state.formData}
        onFieldChange={(field, value) =>
          dispatch({ type: "SET_FORM_FIELD", field, value })
        }
        onToggleMode={() => dispatch({ type: "TOGGLE_AUTH_MODE" })}
        onSubmit={handleAuth}
      />

      <NavbarPetDialog
        open={state.showAddPet}
        onOpenChange={(v) => dispatch({ type: "SET_SHOW_ADD_PET", value: v })}
        petData={state.petData}
        onFieldChange={(field, value) =>
          dispatch({ type: "SET_PET_FIELD", field, value })
        }
        onSubmit={handleAddPet}
        onSkip={() => dispatch({ type: "SET_SHOW_ADD_PET", value: false })}
      />
    </>
  );
};

export default Navbar;
