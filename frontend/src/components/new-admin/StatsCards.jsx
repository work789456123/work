import React from 'react';

const StatsCard = ({ icon, label, value, trend, trendUp, colorClass, bgColorClass }) => {
    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-brand-primary/5">
            <div className="flex items-center justify-between mb-4">
                <div className={`size-10 ${bgColorClass} rounded-lg flex items-center justify-center ${colorClass}`}>
                    <span className="material-symbols-outlined">{icon}</span>
                </div>
                <span className={`${trendUp ? 'text-emerald-600 bg-emerald-50' : 'text-red-600 bg-red-50'} text-xs font-bold flex items-center gap-1 px-2 py-1 rounded-full`}>
                    <span className="material-symbols-outlined text-xs">{trendUp ? 'trending_up' : 'trending_down'}</span>
                    {trend}
                </span>
            </div>
            <p className="text-slate-500 text-sm font-medium">{label}</p>
            <h3 className="text-2xl font-bold mt-1 text-slate-900 dark:text-slate-100">{value}</h3>
        </div>
    );
};

const StatsCards = () => {
    const stats = [
        { icon: 'pets', label: 'Total Animals', value: '12,840', trend: '12%', trendUp: true, colorClass: 'text-brand-primary', bgColorClass: 'bg-brand-primary/10' },
        { icon: 'warning', label: 'Active Alerts', value: '24', trend: '5%', trendUp: true, colorClass: 'text-red-600', bgColorClass: 'bg-red-100' },
        { icon: 'chat_bubble', label: 'Recent Consultations', value: '156', trend: '2%', trendUp: false, colorClass: 'text-blue-600', bgColorClass: 'bg-blue-100' },
        { icon: 'verified_user', label: 'Verified Farmers', value: '3,420', trend: '8%', trendUp: true, colorClass: 'text-amber-600', bgColorClass: 'bg-amber-100' },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
                <StatsCard key={index} {...stat} />
            ))}
        </div>
    );
};

export default StatsCards;
