import { useState, useEffect } from 'react';
import { fetchAlerts, fetchDashboardStats } from '../services/api';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';

interface AIDetection {
    id: string;
    tagId: string;
    farm: string;
    type: string;
    confidence: number;
    time: string;
    status: 'Critical' | 'Warning' | 'Info';
    description: string;
}

interface DashboardStats {
    vaccination_rate: number;
    active_treatments: number;
    accuracy_score: number;
    scans_today: number;
    system_uptime: number;
    avg_response_time: number;
    active_vets: number;
    resolution_rate: number;
}

const AIMonitoringPage = () => {
    const [filter, setFilter] = useState('All');
    const [detections, setDetections] = useState<AIDetection[]>([]);
    const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);

    useEffect(() => {
        const loadAlerts = async () => {
            try {
                const [alertsData, statsData] = await Promise.all([
                    fetchAlerts(),
                    fetchDashboardStats()
                ]);
                
                setDashboardStats(statsData);

                const mapped = alertsData.map((d: any) => ({
                    id: d.id.substring(0, 8).toUpperCase(),
                    tagId: d.tag_id,
                    farm: d.farm,
                    type: d.type,
                    confidence: d.confidence,
                    time: d.created_at ? new Date(d.created_at).toLocaleTimeString() : d.time_label,
                    status: d.status,
                    description: d.description
                }));
                setDetections(mapped);
            } catch (err) {
                console.error("Failed to load AI monitoring data:", err);
            }
        };
        loadAlerts();
    }, []);

    const statsMetrics = [
        { label: 'System Uptime', value: `${dashboardStats?.system_uptime || 0}%`, trend: 'Stable', icon: 'bolt', color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
        { label: 'Live Cameras', value: '142', trend: '+5', icon: 'videocam', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
        { label: 'Scans Today', value: dashboardStats?.scans_today?.toLocaleString() || '0', trend: '+12%', icon: 'document_scanner', color: 'text-primary', bg: 'bg-primary/10' },
        { label: 'Accuracy Score', value: `${dashboardStats?.accuracy_score || 0}%`, trend: 'Stable', icon: 'my_location', color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
    ];

    const filteredDetections = filter === 'All' ? detections : detections.filter(d => d.status === filter);

    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-background-light dark:bg-background-dark">
                <Header />

                <div className="flex-1 overflow-y-auto p-8">
                    <div className="max-w-7xl mx-auto space-y-6">

                        {/* Header Section */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                                    <span className="relative flex h-4 w-4">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white dark:border-background-dark"></span>
                                    </span>
                                    Live AI Monitoring
                                </h1>
                                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Real-time computer vision and biometric telemetry feed from the Gopu AI network.</p>
                            </div>
                            <div className="flex gap-3">
                                <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-primary/10 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm text-slate-700 dark:text-slate-200">
                                    <span className="material-symbols-outlined text-sm">tune</span>
                                    AI Settings
                                </button>
                                <button
                                    onClick={() => alert('Dummy Action: Generate AI performance report')}
                                    className="flex items-center gap-2 bg-primary text-white px-5 py-2 rounded-lg font-bold text-sm hover:opacity-90 transition-all shadow-sm active:scale-[0.98]"
                                >
                                    <span className="material-symbols-outlined text-sm">download</span>
                                    Export Logs
                                </button>
                            </div>
                        </div>

                        {/* AI System Stats */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {statsMetrics.map((stat, idx) => (
                                <div key={idx} className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-primary/10 shadow-sm flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={`size-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                                            <span className="material-symbols-outlined text-xl">{stat.icon}</span>
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                                            <h4 className="text-xl font-black text-slate-900 dark:text-white leading-none mt-1">{stat.value}</h4>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">{stat.trend}</span>
                                </div>
                            ))}
                        </div>

                        {/* Live Feed Feed */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                            {/* Feed List */}
                            <div className="lg:col-span-2 space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">Detection Feed</h3>
                                    <div className="flex gap-2">
                                        {['All', 'Critical', 'Warning', 'Info'].map(f => (
                                            <button
                                                key={f}
                                                onClick={() => setFilter(f)}
                                                className={`px-3 py-1 text-xs font-bold rounded-full border transition-all ${filter === f ? 'bg-slate-800 text-white dark:bg-white dark:text-slate-900 border-transparent' : 'bg-white dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                                                    }`}
                                            >
                                                {f}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {filteredDetections.map(detection => (
                                        <div key={detection.id} className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-primary/10 shadow-sm flex flex-col sm:flex-row sm:items-start gap-4 hover:border-primary/30 transition-colors group">
                                            <div className={`size-12 rounded-full flex-shrink-0 flex items-center justify-center border-2 ${detection.status === 'Critical' ? 'bg-red-50 text-red-600 border-red-100 dark:bg-red-900/20 dark:border-red-900/50' :
                                                detection.status === 'Warning' ? 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/20 dark:border-amber-900/50' :
                                                    'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/20 dark:border-blue-900/50'
                                                }`}>
                                                <span className="material-symbols-outlined">
                                                    {detection.status === 'Critical' ? 'emergency' : detection.status === 'Warning' ? 'warning' : 'info'}
                                                </span>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-bold text-slate-900 dark:text-white">{detection.type}</span>
                                                            <span className="text-xs font-medium text-slate-500">• {detection.time}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 mt-1 text-sm text-slate-600 dark:text-slate-400 font-medium">
                                                            <span className="text-primary font-bold">{detection.farm}</span>
                                                            <span>|</span>
                                                            <span className="font-mono bg-slate-100 dark:bg-slate-700 px-1.5 rounded">{detection.tagId}</span>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Confidence</p>
                                                        <div className="flex items-center gap-1.5">
                                                            <div className="w-16 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                                                <div
                                                                    className={`h-full rounded-full ${detection.confidence > 90 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                                                                    style={{ width: `${detection.confidence}%` }}
                                                                ></div>
                                                            </div>
                                                            <span className="text-xs font-bold text-slate-700 dark:text-white">{detection.confidence}%</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-slate-600 dark:text-slate-300 mt-3 leading-relaxed border-l-2 border-primary/20 pl-3 italic">
                                                    "{detection.description}"
                                                </p>

                                                {detection.status !== 'Info' && (
                                                    <div className="mt-4 flex gap-2">
                                                        <button
                                                            onClick={() => alert(`Dummy Action: Escalate ${detection.id} to vet consultation.`)}
                                                            className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold rounded-lg shadow-sm hover:opacity-90 transition-all"
                                                        >
                                                            Escalate to Consult
                                                        </button>
                                                        <button
                                                            onClick={() => alert('Dummy Action: Dismiss AI alert.')}
                                                            className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
                                                        >
                                                            Dismiss False Positive
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Camera Status Grid */}
                            <div className="lg:col-span-1">
                                <div className="bg-slate-900 dark:bg-black rounded-2xl p-6 shadow-xl sticky top-8 border border-white/10 relative overflow-hidden">
                                    {/* Decorative glowing orb */}
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full"></div>

                                    <div className="flex items-center justify-between mb-6 relative z-10">
                                        <h3 className="font-bold text-white">Live Camera Feeds</h3>
                                        <span className="size-2 rounded-full bg-red-500 animate-pulse"></span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 relative z-10">
                                        {[1, 2, 3, 4].map(i => (
                                            <div key={i} className="aspect-video bg-slate-800 rounded-lg border border-slate-700 relative overflow-hidden group cursor-pointer">
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-2 opacity-100 group-hover:opacity-0 transition-opacity">
                                                    <span className="text-[9px] text-white/50 uppercase tracking-wider font-mono">CAM-0{i}</span>
                                                    <span className="text-[10px] text-white font-bold truncate">Sector {i} Array</span>
                                                </div>
                                                {/* Simulated "heat map" or "vision" overlay on hover */}
                                                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                                    <span className="material-symbols-outlined text-white">visibility</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-6 pt-6 border-t border-white/10 relative z-10">
                                        <div className="flex justify-between items-center text-sm mb-3">
                                            <span className="text-slate-400">Processing Load</span>
                                            <span className="text-white font-mono">72%</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-gradient-to-r from-primary to-blue-500 w-[72%]"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
};

export default AIMonitoringPage;
