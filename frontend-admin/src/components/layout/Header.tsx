const Header: React.FC = () => {
    return (
        <header className="h-20 border-b border-primary/5 bg-white/70 dark:bg-background-dark/70 backdrop-blur-xl px-10 flex items-center justify-between flex-shrink-0 sticky top-0 z-40">
            <div className="flex items-center gap-4 flex-1">
                <div className="relative w-full max-w-lg group">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl transition-colors group-focus-within:text-primary">search</span>
                    <input
                        className="w-full pl-12 pr-5 py-3 bg-slate-100 dark:bg-slate-900/50 border-none rounded-2xl text-sm focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-slate-400"
                        placeholder="Quick search across records..."
                        type="text"
                    />
                </div>
            </div>

            <div className="flex items-center gap-6">
                <button className="size-12 rounded-2xl flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-90 relative group">
                    <span className="material-symbols-outlined text-2xl group-hover:scale-110 transition-transform">notifications</span>
                    <span className="absolute top-3.5 right-3.5 size-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-900 shadow-sm animate-bounce"></span>
                </button>
                
                <div className="h-10 w-[1px] bg-slate-200 dark:bg-slate-800 mx-2"></div>

                <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100">Dr. Rajesh Kumar</p>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-primary/70 mt-1">Chief Veterinarian</p>
                    </div>
                    <div className="size-11 rounded-2xl bg-primary/10 flex items-center justify-center overflow-hidden border-2 border-white dark:border-slate-800 shadow-sm transition-transform hover:scale-105 cursor-pointer">
                        <img
                            className="w-full h-full object-cover"
                            alt="Professional headshot of a veterinarian"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCo-561AszzcNSAOK13UHhXxKc3SWd4hLEdJKr0xG2eCg7d9zVQdxoEP3-1roZVlsxO0mFBvSNMhv8ShS5Ke8tohX6abyYpdG0T449HQbUQ6WmPT_R-ZAMpXCQ0ICEsAyOm3Gw-7i2lu3ZkjCqkclIYZaoyzWTncbhJnQ4swgZy0sLNxU2--3uymF0MAv8J87MlHAsxHWv0CJHFGufmN84RTes6jMhMYaZJIJPJyyc6m2nlRTHgQjSqMIdMSrcDTfXgpF_TE2ULh6g"
                        />
                    </div>
                    <button 
                        onClick={() => {
                            localStorage.removeItem('token');
                            window.location.href = '/login';
                        }}
                        className="size-11 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-2xl transition-all active:scale-90"
                        title="Logout"
                    >
                        <span className="material-symbols-outlined text-2xl">logout</span>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
