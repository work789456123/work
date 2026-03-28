import React from 'react';

const Header = () => {
  return (
    <header className="h-20 bg-teal-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center px-8 justify-between sticky top-0 z-10 shrink-0">
      
      {/* Global Search */}
      <div className="relative w-96 max-w-md hidden md:block">
        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">search</span>
        <input 
          type="text" 
          placeholder="Search animals, farmers, or alerts..." 
          className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-full py-2.5 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-brand-primary/20 outline-none placeholder:text-slate-400 text-slate-700 dark:text-slate-200 transition-shadow"
        />
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-6 ml-auto">
        <button className="relative text-slate-400 hover:text-brand-primary transition-colors">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute 1px top-0 right-0 size-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-900"></span>
        </button>

        <div className="h-8 w-px bg-slate-200 dark:bg-slate-700"></div>

        <div className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 p-1.5 pr-2 rounded-full transition-colors border border-transparent dark:hover:border-slate-700">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-800 dark:text-slate-100">Dr. Rajesh Kumar</p>
            <p className="text-xs text-slate-500 font-medium">Chief Veterinarian</p>
          </div>
          <img 
            src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100" 
            alt="Profile" 
            className="size-10 rounded-full object-cover ring-2 ring-brand-primary/10"
          />
        </div>
      </div>
      
    </header>
  );
};

export default Header;
