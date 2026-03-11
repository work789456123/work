interface AlertProps {
    icon: string;
    title: string;
    subtitle: string;
    statusText: string;
    statusColorClass: string;
    iconBgClass: string;
    iconColorClass: string;
}

const AlertItem: React.FC<AlertProps> = ({ icon, title, subtitle, statusText, statusColorClass, iconBgClass, iconColorClass }) => (
    <div className="flex gap-4 p-4 rounded-[1.5rem] hover:bg-white/40 dark:hover:bg-white/5 transition-all group cursor-pointer border border-transparent hover:border-white/20 active:scale-[0.98]">
        <div className={`size-12 rounded-2xl ${iconBgClass} flex items-center justify-center ${iconColorClass} flex-shrink-0 shadow-sm transition-transform group-hover:scale-110`}>
            <span className="material-symbols-outlined text-2xl">{icon}</span>
        </div>
        <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
                <p className="text-sm font-black text-slate-900 dark:text-slate-100 truncate">{title}</p>
                <span className={`text-[10px] ${statusColorClass} font-black uppercase tracking-tighter`}>{statusText}</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">{subtitle}</p>
            <div className="mt-3 h-1 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div className={`h-full ${iconColorClass.includes('red') ? 'bg-red-500' : 'bg-amber-500'} w-2/3`}></div>
            </div>
        </div>
    </div>
);

const AIAlerts: React.FC<{ alerts: any[] }> = ({ alerts }) => {
    return (
        <div className="glass-card p-10 flex flex-col h-full border-red-500/5">
            <div className="flex items-center justify-between mb-8">
                <h3 className="font-black text-xl text-slate-900 dark:text-slate-50 tracking-tight">AI Insights</h3>
                <div className="size-8 rounded-full bg-red-500/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-red-500 text-lg animate-pulse">new_releases</span>
                </div>
            </div>
            <div className="space-y-4 flex-1 overflow-y-auto pr-2 sidebar-scroll">
                {alerts.length > 0 ? alerts.map((alert, index) => (
                    <AlertItem 
                        key={index} 
                        icon={alert.type === 'critical' ? 'emergency' : 'warning_amber'}
                        title={alert.title}
                        subtitle={alert.subtitle}
                        statusText={alert.statusText}
                        statusColorClass={alert.type === 'critical' ? 'text-red-500' : 'text-amber-600'}
                        iconBgClass={alert.type === 'critical' ? 'bg-red-500/10' : 'bg-amber-500/10'}
                        iconColorClass={alert.type === 'critical' ? 'text-red-600' : 'text-amber-600'}
                    />
                )) : (
                    <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                        <span className="material-symbols-outlined text-4xl mb-3 opacity-30">verified_user</span>
                        <p className="text-sm font-medium">No active critical alerts</p>
                    </div>
                )}
            </div>
            <button className="w-full mt-8 py-4 bg-primary/5 hover:bg-primary/10 text-primary text-xs font-black uppercase tracking-widest rounded-2xl transition-all active:scale-[0.98]">
                Intelligence Dashboard
            </button>
        </div>
    );
};

export default AIAlerts;
