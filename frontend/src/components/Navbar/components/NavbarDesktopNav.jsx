import { Link, useNavigate, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export default function NavbarDesktopNav({ primaryNav }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleChildClick = (child) => {
    if (child.action === "careCollectionSoon") {
      toast.info("Care Collection is Coming Soon!", { closeButton: true });
      return;
    }
    if (child.link) navigate(child.link);
  };

  return (
    <div id="user-navbar-desktop" className="hidden xl:flex items-center space-x-1">
      {primaryNav.map((link) => {
        if (link.children?.length > 0) {
          return (
            <DropdownMenu key={link.name}>
              <DropdownMenuTrigger className="px-4 py-2 text-sm font-medium rounded-lg transition-colors text-white/90 hover:text-white hover:bg-white/10 flex items-center">
                {link.name} <ChevronDown className="ml-1 h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white border-gray-200">
                {link.children.map((child) => (
                  <DropdownMenuItem
                    key={child.name}
                    onClick={() => handleChildClick(child)}
                    className="cursor-pointer"
                  >
                    {child.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        }
        return (
          <Link
            key={link.name}
            to={link.link}
            className={
              link.spl
                ? "px-4 py-2 text-sm font-medium rounded-lg bg-yellow-500 text-black hover:bg-yellow-400 transition-colors"
                : `px-4 py-2 text-sm font-medium rounded-lg transition-colors ${location.pathname === link.link ? "text-white bg-white/20" : "text-white/90 hover:text-white hover:bg-white/10"} `
            }
          >
            {link.name}
          </Link>
        );
      })}
    </div>
  );
}
