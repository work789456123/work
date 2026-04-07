import { Search, Bell, HelpCircle, Menu } from "lucide-react";

interface TopbarProps {
  onMenuClick?: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  return (
    <header className="bg-[#1F6559] text-white py-3 px-4 md:px-8 border-b border-[#154d43] flex items-center justify-between px-4 md:px-8 z-10 shrink-0">
      <div className="flex items-center gap-2 md:gap-4 flex-1 max-w-lg">
        <button 
          className="md:hidden text-white hover:text-gray-200 p-1 -ml-1 rounded-md active:bg-white/10" 
          onClick={onMenuClick}
        >
          <Menu size={24} />
        </button>
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
          <input 
            type="text" 
            placeholder="Search data, animals..." 
            className="w-full pl-10 pr-4 py-2 bg-[#154d43] border border-white/20 rounded-lg text-sm text-white placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-white/30"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-5 ml-4">
        <button className="text-gray-300 hover:text-white hidden sm:block"><Bell size={20} /></button>
        <button className="text-gray-300 hover:text-white hidden sm:block"><HelpCircle size={20} /></button>
        <div className="h-8 w-[1px] bg-white/20 mx-1 md:mx-2 hidden sm:block"></div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-white uppercase tracking-tight">Admin User</p>
            <p className="text-[10px] text-gray-300 font-medium">Master Controller</p>
          </div>
          <div className="h-9 w-9 md:h-10 md:w-10 rounded-full bg-white border-2 border-[#154d43] shadow-sm overflow-hidden flex items-center justify-center font-bold text-[#1F6559] shrink-0">
            A
          </div>
        </div>
      </div>
    </header>
  );
}