import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { navbarActions } from "@/assets/shared/auth_ui";

export default function NavbarToolbar({
  mobileMenuOpen,
  onToggleMobile,
  isLoggedIn,
  onGopuClick,
  onLogout,
  onOpenAuth,
}) {
  return (
    <div className="flex items-center space-x-3 ml-4 lg:ml-8">
      <Button
        onClick={onGopuClick}
        className="hidden lg:flex rounded-full bg-white text-[#1F6559] hover:bg-white/90 font-semibold mr-3"
        data-testid="try-gopu-button"
      >
        {navbarActions.tryGopu}
      </Button>
      {isLoggedIn && (
        <Button
          onClick={onLogout}
          variant="outline"
          className="hidden lg:flex rounded-full border-white/30 text-white hover:bg-white/10 hover:text-white"
          data-testid="logout-button"
        >
          {navbarActions.logout}
        </Button>
      )}
      {!isLoggedIn && (
        <Button
          onClick={onOpenAuth}
          variant="outline"
          className="hidden lg:flex rounded-full border-white/30 text-white hover:bg-white/10 hover:text-white"
        >
          {navbarActions.loginSignup}
        </Button>
      )}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden text-white hover:bg-white/10"
        onClick={onToggleMobile}
        data-testid="mobile-menu-toggle"
      >
        {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>
    </div>
  );
}
