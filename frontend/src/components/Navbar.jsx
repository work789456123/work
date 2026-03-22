import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import api from "@/utils/api";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAddPet, setShowAddPet] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    phone_or_email: "",
    password: ""
  });
  const [petData, setPetData] = useState({
    name: "",
    pet_type: "",
    age: "",
    gender: "",
    weight: ""
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      const endpoint = authMode === "login" ? "/auth/login" : "/auth/register";
      const response = await api.post(endpoint, formData);

      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user_name', response.data.user?.full_name || response.data.full_name);
      setIsLoggedIn(true);
      setShowAuth(false);

      // Notify other components (like GopuChat) that login/signup succeeded
      window.dispatchEvent(new Event('authSuccess'));

      if (authMode === "register") {
        setShowAddPet(true);
      }

      toast.success(response.data.msg || response.data.message || "Success");
    } catch (error) {
      toast.error(error.response?.data?.detail || "Authentication failed");
    }
  };

  const handleAddPet = async (e) => {
    e.preventDefault();
    try {
      await api.post("/pets", petData);
      toast.success("Pet added successfully!");
      setShowAddPet(false);
      setPetData({ name: "", pet_type: "", age: "", gender: "", weight: "" });
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to add pet");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_name');
    setIsLoggedIn(false);
    navigate('/');
    toast.success("Logged out successfully");
  };

  const handleGopuClick = () => {
    if (!isLoggedIn) {
      setShowAuth(true);
    } else {
      window.dispatchEvent(new CustomEvent('openPromoModal'));
    }
  };

  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      <nav className="sticky top-0 z-50 bg-[#1F6559] shadow-md">
        <div className="max-w-[110rem] mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center z-50 mr-auto shrink-0" data-testid="logo-link">
              <img
                src="/pvhalflogo.png"
                alt="PashuVaani Logo"
                className="h-10 sm:h-12 md:h-16 w-auto object-contain"
                style={{ maxHeight: '150px' }}
              />
              <span className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-[#1FA7A6] via-[#38C2B4] to-[#78D65C] bg-clip-text text-transparent ml-1 sm:ml-2">
                PashuVaani
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              <Link to="/" className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${location.pathname === "/" ? "text-white bg-white/20" : "text-white/90 hover:text-white hover:bg-white/10"}`}>
                Home
              </Link>

              {/*<Link to="/doctors" className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${location.pathname === "/doctors" ? "text-white bg-white/20" : "text-white/90 hover:text-white hover:bg-white/10"}`}>
                Our Doctors
              </Link>*/}

              <DropdownMenu>
                <DropdownMenuTrigger className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${location.pathname === "/pashucare-suraksha-plan" ? "text-white bg-white/20" : "text-white/90 hover:text-white hover:bg-white/10 flex items-center"}`}>
                  Pashu Raksha <ChevronDown className="ml-1 h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white border-gray-200">
                  <DropdownMenuItem onClick={() => navigate('/pashucare-suraksha-plan')} className="cursor-pointer">
                    Gopu.AI
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast.info('Care Collection is Coming Soon!', { closeButton: true })} className="cursor-pointer">
                    Care Collection
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/*<Link to="/appointmentsform" className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${location.pathname === "/appointmentsform" ? "text-white bg-white/20" : "text-white/90 hover:text-white hover:bg-white/10"}`}>
                Consult with Doctor
              </Link>*/}

              <Link to="/appointments" className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${location.pathname === "/appointments" ? "text-white bg-white/20" : "text-white/90 hover:text-white hover:bg-white/10"}`}
              >
                Consult with Doctor
              </Link>

              <Link to="/blogs" className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${location.pathname === "/blogs" ? "text-white bg-white/20" : "text-white/90 hover:text-white hover:bg-white/10"}`}>
                Blog
              </Link>

              {/* About PashuVaani Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger className="px-4 py-2 text-sm font-medium rounded-lg text-white/90 hover:text-white hover:bg-white/10 flex items-center">
                  About PashuVaani <ChevronDown className="ml-1 h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white border-gray-200">
                  <DropdownMenuItem onClick={() => navigate('/about')} className="cursor-pointer">
                    About Us
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/our-story')} className="cursor-pointer">
                    Founders Stories
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/contact')} className="cursor-pointer">
                    Contact Us
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Link to="/pashucare-suraksha-plan" className="px-4 py-2 text-sm font-medium rounded-lg bg-yellow-500 text-black hover:bg-yellow-400 transition-colors">
                PashuCare Suraksha Plan
              </Link>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-3">
              <Button
                onClick={handleGopuClick}
                className="hidden lg:flex rounded-full bg-white text-[#1F6559] hover:bg-white/90 font-semibold"
                data-testid="try-gopu-button"
              >
                Try Gopu.AI Free
              </Button>

              {isLoggedIn && (
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="hidden lg:flex rounded-full border-white/30 text-white hover:bg-white/10 hover:text-white"
                  data-testid="logout-button"
                >
                  Logout
                </Button>
              )}

              {/* Mobile Hamburger */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-white hover:bg-white/10"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                data-testid="mobile-menu-toggle"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden pb-4 space-y-2" data-testid="mobile-menu">
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-sm font-medium rounded-lg text-white/90 hover:text-white hover:bg-white/10">
                Home
              </Link>
              <Link
                to="/pashucare-suraksha-plan"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg text-white/90 hover:text-white hover:bg-white/10"
              >
                Gopu.AI (Pashu Raksha)
              </Link>
              <button
                onClick={() => {
                  toast.info('Care Collection is Coming Soon!', { closeButton: true });
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-4 py-3 text-sm font-medium rounded-lg text-white/90 hover:text-white hover:bg-white/10 opacity-70"
              >
                Care Collection (Coming Soon)
              </button>
              <Link to="/appointments" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-sm font-medium rounded-lg text-white/90 hover:text-white hover:bg-white/10">
                Consult with Doctor
              </Link>
              <Link to="/blogs" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-sm font-medium rounded-lg text-white/90 hover:text-white hover:bg-white/10">
                Blog
              </Link>
              <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-sm font-medium rounded-lg text-white/90 hover:text-white hover:bg-white/10">
                About Us
              </Link>
              <Link to="/our-story" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-sm font-medium rounded-lg text-white/90 hover:text-white hover:bg-white/10">
                Founders Stories
              </Link>
              <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-sm font-medium rounded-lg text-white/90 hover:text-white hover:bg-white/10">
                Contact Us
              </Link>
              <Link to="/pashucare-suraksha-plan" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-sm font-medium rounded-lg bg-yellow-500 text-black hover:bg-yellow-400">
                PashuCare Suraksha Plan
              </Link>

              <Button
                onClick={() => {
                  handleGopuClick();
                  setMobileMenuOpen(false);
                }}
                className="w-full rounded-full bg-white text-[#1F6559] hover:bg-white/90 font-semibold"
              >
                Try Gopu.AI Free
              </Button>

              {isLoggedIn && (
                <Button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  variant="outline"
                  className="w-full rounded-full border-white/30 text-white hover:bg-white/10"
                >
                  Logout
                </Button>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Auth Dialog */}
      <Dialog open={showAuth} onOpenChange={setShowAuth}>
        <DialogContent className="sm:max-w-md" data-testid="auth-dialog">
          <DialogHeader>
            <DialogTitle className="heading-font text-2xl">
              {authMode === "login" ? "Welcome Back" : "Create Account"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAuth} className="space-y-4">
            {authMode === "register" && (
              <div>
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  data-testid="auth-fullname-input"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  required
                  className="rounded-lg border-[#EAEAEA]"
                />
              </div>
            )}
            <div>
              <Label htmlFor="phone_or_email">Phone or Email</Label>
              <Input
                id="phone_or_email"
                data-testid="auth-phone-email-input"
                value={formData.phone_or_email}
                onChange={(e) => setFormData({ ...formData, phone_or_email: e.target.value })}
                required
                className="rounded-lg border-[#EAEAEA]"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                data-testid="auth-password-input"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className="rounded-lg border-[#EAEAEA]"
              />
            </div>
            <Button
              type="submit"
              data-testid="auth-submit-button"
              className="w-full rounded-full bg-[#1F6559] text-white hover:bg-[#184F46]"
            >
              {authMode === "login" ? "Login" : "Sign Up"}
            </Button>
            <p className="text-center text-sm text-[#6F6F6F]">
              {authMode === "login" ? "Don't have an account? " : "Already have an account? "}
              <button
                type="button"
                onClick={() => setAuthMode(authMode === "login" ? "register" : "login")}
                className="text-[#1F6559] font-medium hover:underline"
                data-testid="auth-toggle-button"
              >
                {authMode === "login" ? "Sign Up" : "Login"}
              </button>
            </p>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Pet Dialog */}
      <Dialog open={showAddPet} onOpenChange={setShowAddPet}>
        <DialogContent className="sm:max-w-md" data-testid="add-pet-dialog">
          <DialogHeader>
            <DialogTitle className="heading-font text-2xl">
              Add Your Pet/Animal
            </DialogTitle>
            <p className="text-sm text-[#6F6F6F]">Meet your personal animal health AI agent</p>
          </DialogHeader>
          <form onSubmit={handleAddPet} className="space-y-4">
            <div>
              <Label htmlFor="pet_name">Pet Name</Label>
              <Input
                id="pet_name"
                data-testid="pet-name-input"
                value={petData.name}
                onChange={(e) => setPetData({ ...petData, name: e.target.value })}
                required
                className="rounded-lg border-[#EAEAEA]"
              />
            </div>
            <div>
              <Label htmlFor="pet_type">Pet Type</Label>
              <Input
                id="pet_type"
                data-testid="pet-type-input"
                placeholder="Dog, Cat, etc."
                value={petData.pet_type}
                onChange={(e) => setPetData({ ...petData, pet_type: e.target.value })}
                required
                className="rounded-lg border-[#EAEAEA]"
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  data-testid="pet-age-input"
                  placeholder="2 years"
                  value={petData.age}
                  onChange={(e) => setPetData({ ...petData, age: e.target.value })}
                  className="rounded-lg border-[#EAEAEA]"
                />
              </div>
              <div>
                <Label htmlFor="gender">Gender</Label>
                <Input
                  id="gender"
                  data-testid="pet-gender-input"
                  placeholder="Male/Female"
                  value={petData.gender}
                  onChange={(e) => setPetData({ ...petData, gender: e.target.value })}
                  className="rounded-lg border-[#EAEAEA]"
                />
              </div>
              <div>
                <Label htmlFor="weight">Weight</Label>
                <Input
                  id="weight"
                  data-testid="pet-weight-input"
                  placeholder="10 kg"
                  value={petData.weight}
                  onChange={(e) => setPetData({ ...petData, weight: e.target.value })}
                  className="rounded-lg border-[#EAEAEA]"
                />
              </div>
            </div>
            <div className="flex space-x-3">
              <Button
                type="submit"
                data-testid="pet-submit-button"
                className="flex-1 rounded-full bg-[#1F6559] text-white hover:bg-[#184F46]"
              >
                Add Pet
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddPet(false)}
                data-testid="pet-skip-button"
                className="flex-1 rounded-full border-[#EAEAEA]"
              >
                Skip for Now
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Navbar;
