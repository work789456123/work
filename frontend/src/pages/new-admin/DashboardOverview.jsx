import React from 'react';
import StatsCards from '../../components/new-admin/StatsCards';
import HealthTrendsChart from '../../components/new-admin/HealthTrendsChart';
import AIAlerts from '../../components/new-admin/AIAlerts';
import RecentConsultations from '../../components/new-admin/RecentConsultations';

const DashboardOverview = () => {
    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Title & Filters */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">Dashboard Overview</h1>
                    <p className="text-slate-500 mt-1">Real-time health monitoring and analytics powered by Gopu AI.</p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="px-4 py-2 bg-white dark:bg-slate-800 border border-brand-primary/10 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm text-slate-700 dark:text-slate-200">
                        <span className="material-symbols-outlined text-sm">calendar_today</span>
                        Last 30 Days
                    </button>
                    <button className="px-4 py-2 bg-white dark:bg-slate-800 border border-brand-primary/10 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm text-slate-700 dark:text-slate-200">
                        <span className="material-symbols-outlined text-sm">file_download</span>
                        Export
                    </button>
                </div>
            </div>

            {/* Summary Stats */}
            <StatsCards />

            {/* Charts & Activity Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Activity Chart */}
                <div className="lg:col-span-2">
                    <HealthTrendsChart />
                </div>
                {/* Side Panel: Critical Alerts */}
                <div className="lg:col-span-1">
                    <AIAlerts />
                </div>
            </div>

            {/* Recent Activity Table */}
            <RecentConsultations />
        </div>
    );
};

export default DashboardOverview;
