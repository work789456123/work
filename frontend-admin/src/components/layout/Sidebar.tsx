import { NavLink } from 'react-router-dom';

const Sidebar: React.FC = () => {
    const navItems = [
        { icon: 'dashboard', label: 'Dashboard', path: '/dashboard' },
        { icon: 'person', label: 'Farmers', path: '/farmers' },
        { icon: 'health_and_safety', label: 'Animal Health', path: '/health' },
        { icon: 'monitoring', label: 'AI Monitoring', path: '/monitoring' },
        { icon: 'medical_services', label: 'Veterinary Network', path: '/network' },
        { icon: 'chat', label: 'Consultations', path: '/consultations' },
        { icon: 'auto_stories', label: 'Knowledge Base', path: '/kb' },
    ];

    const systemItems = [
        { icon: 'notifications', label: 'Notifications', path: '/notifications' },
        { icon: 'payments', label: 'Payments', path: '/payments' },
        { icon: 'analytics', label: 'Reports', path: '/reports' },
        { icon: 'settings', label: 'Settings', path: '/settings' },
    ];

    return (
        <aside className="w-68 flex-shrink-0 border-r border-primary/5 bg-white/80 dark:bg-background-dark/80 backdrop-blur-xl flex flex-col h-screen sticky top-0">
            <div className="p-8 flex items-center gap-4">
                <div className="size-10 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20 rotate-3 transition-transform hover:rotate-0">
                    <span className="material-symbols-outlined text-2xl">pets</span>
                </div>
                <div>
                    <h2 className="text-primary font-black text-2xl tracking-tighter leading-none">PashuVaani</h2>
                    <div className="flex items-center gap-1.5 mt-1">
                        <span className="size-1.5 rounded-full bg-green-500 animate-pulse"></span>
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/60">Gopu AI</span>
                    </div>
                </div>
            </div>

            <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto sidebar-scroll">
                {navItems.map((item) => (
                    <NavLink
                        key={item.label}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 ${isActive
                                ? 'bg-primary text-white font-semibold shadow-lg shadow-primary/20 scale-[1.02]'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary'
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <span
                                    className="material-symbols-outlined text-[20px]"
                                    style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                                >
                                    {item.icon}
                                </span>
                                <span className="text-sm">{item.label}</span>
                            </>
                        )}
                    </NavLink>
                ))}

                <div className="pt-4 pb-2">
                    <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">System</p>
                </div>

                {systemItems.map((item) => (
                    <NavLink
                        key={item.label}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 ${isActive
                                ? 'bg-primary text-white font-semibold shadow-lg shadow-primary/20'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary'
                            }`
                        }
                    >
                        <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                        <span className="text-sm">{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-6 mt-auto">
                <div className="bg-gradient-to-br from-primary/10 to-transparent p-5 rounded-[2rem] border border-primary/5 mb-6">
                    <p className="text-[10px] text-primary font-extrabold uppercase tracking-widest mb-3 opacity-70">System Health</p>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="size-2.5 rounded-full bg-green-500"></div>
                            <div className="absolute inset-0 size-2.5 rounded-full bg-green-500 animate-ping opacity-75"></div>
                        </div>
                        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">AI Engine active</span>
                    </div>
                </div>
                <button className="w-full flex items-center justify-center gap-3 bg-primary py-4 rounded-2xl text-white text-sm font-bold shadow-xl shadow-primary/20 hover:bg-primary-hover hover:-translate-y-0.5 transition-all active:scale-[0.96]">
                    <span className="material-symbols-outlined text-lg">add_circle</span>
                    New Consultation
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
