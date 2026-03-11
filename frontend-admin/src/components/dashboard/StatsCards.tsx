interface StatsCardProps {
    icon: string;
    label: string;
    value: string;
    trend: string;
    trendUp: boolean;
    colorClass: string;
    bgColorClass: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ icon, label, value, trend, trendUp, colorClass, bgColorClass }) => {
    return (
        <div className="glass-card p-7 hover:scale-[1.03] hover:shadow-2xl hover:shadow-primary/5 cursor-pointer flex flex-col justify-between h-full group">
            <div className="flex items-center justify-between mb-8">
                <div className={`size-14 ${bgColorClass} rounded-[1.25rem] flex items-center justify-center ${colorClass} shadow-inner transition-transform group-hover:rotate-6`}>
                    <span className="material-symbols-outlined text-3xl font-light">{icon}</span>
                </div>
                <div className={`p-1.5 rounded-xl ${trendUp ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600'} flex items-center gap-1`}>
                    <span className="material-symbols-outlined text-sm font-bold">{trendUp ? 'trending_up' : 'trending_down'}</span>
                </div>
            </div>
            <div>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest opacity-80">{label}</p>
                <div className="flex items-baseline gap-2 mt-2">
                    <h3 className="text-4xl font-black text-slate-900 dark:text-slate-50 tracking-tighter">{value}</h3>
                    <span className={`text-[10px] font-black ${trendUp ? 'text-emerald-600' : 'text-red-600'}`}>{trend.split(' ')[0]}</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1 font-medium">{trend.split(' ').slice(1).join(' ')}</p>
            </div>
        </div>
    );
};

const StatsCards: React.FC<{ stats: any }> = ({ stats }) => {
    const metrics = [
        { 
            icon: 'groups', 
            label: 'Total Farmers', 
            value: stats?.total_farmers ? stats.total_farmers.toLocaleString() : 'Loading...', 
            trend: '+12.5% vs last month', 
            trendUp: true, 
            colorClass: 'text-primary', 
            bgColorClass: 'bg-primary/10' 
        },
        { 
            icon: 'warning', 
            label: 'Active AI Alerts', 
            value: stats?.active_treatments ? stats.active_treatments.toString() : '...', 
            trend: '-2.4% vs last week', 
            trendUp: false, 
            colorClass: 'text-red-500', 
            bgColorClass: 'bg-red-50' 
        },
        { 
            icon: 'medical_services', 
            label: 'Network Veterinarians', 
            value: stats?.active_vets ? stats.active_vets.toString() : '...', 
            trend: '+18% vs last month', 
            trendUp: true, 
            colorClass: 'text-amber-500', 
            bgColorClass: 'bg-amber-50' 
        },
        { 
            icon: 'check_circle', 
            label: 'Resolution Rate', 
            value: stats?.resolution_rate ? `${stats.resolution_rate}%` : '...', 
            trend: '+8.2% vs last month', 
            trendUp: true, 
            colorClass: 'text-blue-500', 
            bgColorClass: 'bg-blue-50' 
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((stat, index) => (
                <StatsCard key={index} {...stat} />
            ))}
        </div>
    );
};

export default StatsCards;
