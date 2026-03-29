import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { navbarActions } from "@/assets/content/shared/auth_ui";
import type { NavbarToolbarProps } from "@/types/navbar";

export default function NavbarToolbar({
  mobileMenuOpen,
  onToggleMobile,
  isLoggedIn,
  onGopuClick,
  onLogout,
  onOpenAuth,
}: NavbarToolbarProps) {
  return (
    <div id="user-navbar-toolbar" className="flex items-center gap-2 ">
      <Button
        onClick={onGopuClick}
        className="hidden lg:flex rounded-full bg-white text-[#1F6559] hover:bg-white/90 font-semibold"
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
