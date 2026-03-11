import { useState, useEffect } from 'react';
import { fetchDashboardStats, fetchConsultations } from '../services/api';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import StatsCards from '../components/dashboard/StatsCards';
import AIAlerts from '../components/dashboard/AIAlerts';
import RecentConsultations from '../components/dashboard/RecentConsultations';
import HealthTrendsChart from '../components/dashboard/HealthTrendsChart';

const DashboardPage = () => {
    const [stats, setStats] = useState<any>(null);
    const [alerts, setAlerts] = useState<any[]>([]);
    const [consultations, setConsultations] = useState<any[]>([]);

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                const [statsData, consultsData] = await Promise.all([
                    fetchDashboardStats(),
                    fetchConsultations()
                ]);

                setStats(statsData);
                
                // Mapped Consultations for Recent Panel
                setConsultations(consultsData.slice(0, 5).map((c: any) => ({
                    id: c.ticket_id.substring(0, 5),
                    animal: c.animal_species || 'Unknown',
                    farmer: c.farmer_name || 'System',
                    symptom: c.symptom,
                    diagnosis: c.diagnosis || 'Pending Analysis',
                    status: c.status
                })));

                // Simple Alert mapping for dashboard
                setAlerts(consultsData.filter((c:any) => c.status === 'URGENT' || c.status === 'CRITICAL').slice(0, 4).map((c:any) => ({
                    title: c.symptom,
                    subtitle: `Farmer: ${c.farmer_name || 'Unknown'}`,
                    statusText: c.status,
                    type: c.status === 'CRITICAL' ? 'critical' : 'warning'
                })));

            } catch (err) {
                console.error("Dashboard Load Error:", err);
            }
        };
        loadDashboardData();
    }, []);

    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-background-light dark:bg-background-dark">
                <Header />
                <div className="flex-1 overflow-y-auto p-12">
                    <div className="max-w-8xl mx-auto space-y-12">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] rounded-full">System Overview</span>
                                    <span className="text-slate-300 dark:text-slate-700">•</span>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">v2.4.0 Engine</span>
                                </div>
                                <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-tight">Dashboard Central</h1>
                                <p className="text-slate-500 text-lg mt-2 max-w-2xl font-medium">Monitoring the pulse of <span className="text-primary font-bold">12,480 livestock</span> across the regional farmer network.</p>
                            </div>
                            <div className="flex gap-3">
                                <button className="px-6 py-3 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 text-sm font-bold rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 hover:bg-slate-50 transition-all active:scale-95">Download PDF</button>
                                <button className="px-6 py-3 bg-primary text-white text-sm font-bold rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary-hover hover:-translate-y-0.5 transition-all active:scale-95">Analytics Settings</button>
                            </div>
                        </div>

                        <StatsCards stats={stats} />

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2">
                                <HealthTrendsChart />
                            </div>
                            <div className="lg:col-span-1">
                                <AIAlerts alerts={alerts} />
                            </div>
                        </div>

                        <RecentConsultations consultations={consultations} />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DashboardPage;
