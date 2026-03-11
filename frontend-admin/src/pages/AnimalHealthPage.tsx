import { useState, useEffect } from 'react';
import { fetchAnimals, fetchFarmers, fetchDashboardStats } from '../services/api';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';

interface AnimalRecord {
    id: string;
    tagId: string;
    species: string;
    breed: string;
    farmer: string;
    location: string;
    healthStatus: 'Healthy' | 'Monitoring' | 'Critical';
    lastCheckup: string;
    nextCheckup: string;
    recentDiagnosis: string;
}

interface FarmerRaw {
    id: string;
    name: string;
    location: string;
}

interface AnimalRaw {
    id: string;
    tag_id: string;
    species: string;
    breed: string;
    farmer_id: string;
    health_status: 'Healthy' | 'Monitoring' | 'Critical';
    recent_diagnosis?: string;
    created_at?: string;
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

const AnimalHealthPage = () => {
    const [activeFilter, setActiveFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [records, setRecords] = useState<AnimalRecord[]>([]);
    const [stats, setStats] = useState<DashboardStats | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [animalsData, farmersData, dashboardData] = await Promise.all([
                    fetchAnimals(),
                    fetchFarmers(),
                    fetchDashboardStats()
                ]);

                setStats(dashboardData);

                const farmerMap = new Map();
                farmersData.forEach((f: FarmerRaw) => {
                    farmerMap.set(f.id, f);
                });

                const mappedRecords = animalsData.map((d: AnimalRaw) => ({
                    id: d.id.substring(0, 8).toUpperCase(),
                    tagId: d.tag_id,
                    species: d.species,
                    breed: d.breed,
                    farmer: farmerMap.get(d.farmer_id)?.name || 'Unknown',
                    location: farmerMap.get(d.farmer_id)?.location || 'Unknown',
                    healthStatus: d.health_status,
                    lastCheckup: d.created_at ? new Date(d.created_at).toLocaleDateString() : 'Recent',
                    nextCheckup: 'Scheduled',
                    recentDiagnosis: d.recent_diagnosis || 'None'
                }));
                setRecords(mappedRecords);
            } catch (err) {
                console.error("Failed to load health records:", err);
            }
        };
        loadData();
    }, []);

    const filteredRecords = records.filter(req => {
        const matchesTab =
            activeFilter === 'All' ? true :
                activeFilter === 'Critical' ? req.healthStatus === 'Critical' :
                    activeFilter === 'Monitoring' ? req.healthStatus === 'Monitoring' :
                        activeFilter === 'Healthy' ? req.healthStatus === 'Healthy' : true;

        const matchesSearch = req.tagId.toLowerCase().includes(searchQuery.toLowerCase()) ||
            req.farmer.toLowerCase().includes(searchQuery.toLowerCase()) ||
            req.species.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesTab && matchesSearch;
    });

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
                                <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Animal Health Records</h2>
                                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Centralized view for livestock health across all registered farms.</p>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => alert('Dummy Action: Open Add Record Form')}
                                    className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-all hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98]"
                                >
                                    <span className="material-symbols-outlined text-xl">add</span>
                                    Add Health Record
                                </button>
                            </div>
                        </div>

                        {/* Top Metric Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-primary/10 shadow-sm flex items-center gap-4">
                                <div className="size-12 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-2xl">vaccines</span>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Vaccination Rate</p>
                                    <h4 className="text-2xl font-bold text-slate-900 dark:text-white">{stats?.vaccination_rate || 0}%</h4>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-primary/10 shadow-sm flex items-center gap-4">
                                <div className="size-12 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-2xl">favorite</span>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Herd Health Score</p>
                                    <h4 className="text-2xl font-bold text-slate-900 dark:text-white">
                                        {(stats?.vaccination_rate || 0) > 90 ? 'A+' : (stats?.vaccination_rate || 0) > 80 ? 'A-' : 'B'}
                                    </h4>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-primary/10 shadow-sm flex items-center gap-4">
                                <div className="size-12 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-600 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-2xl">medication</span>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Active Treatments</p>
                                    <h4 className="text-2xl font-bold text-slate-900 dark:text-white">{stats?.active_treatments || 0}</h4>
                                </div>
                            </div>
                        </div>

                        {/* Data Overview Area */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-primary/10 overflow-hidden shadow-sm">
                            <div className="flex flex-col md:flex-row md:items-center justify-between px-6 border-b border-primary/5">
                                <div className="flex overflow-x-auto gap-8 no-scrollbar">
                                    {['All', 'Critical', 'Monitoring', 'Healthy'].map(tab => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveFilter(tab)}
                                            className={`py-5 text-sm transition-colors whitespace-nowrap 
                                                ${activeFilter === tab ? 'font-bold text-primary border-b-2 border-primary' : 'font-medium text-slate-500 hover:text-primary'}
                                            `}
                                        >
                                            {tab === 'Critical' ? `Critical (${records.filter(r => r.healthStatus === 'Critical').length})` : tab}
                                        </button>
                                    ))}
                                </div>
                                <div className="py-4 w-full md:w-auto min-w-[300px]">
                                    <div className="relative w-full">
                                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                                        <input
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2.5 bg-background-light dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20"
                                            placeholder="Search by tag ID, farmer, or species..."
                                            type="text"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50 dark:bg-slate-800/50">
                                        <tr>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 tracking-wider">TAG ID</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 tracking-wider">ANIMAL & BREED</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 tracking-wider">FARMER</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 tracking-wider">RECENT DIAGNOSIS</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 tracking-wider">STATUS</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 tracking-wider text-right">ACTION</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-primary/5">
                                        {filteredRecords.map((req) => (
                                            <tr key={req.id} className="hover:bg-primary/5 transition-colors group">
                                                <td className="px-6 py-4 text-sm font-bold text-primary">{req.tagId}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{req.species}</p>
                                                        <p className="text-xs text-slate-500">{req.breed}</p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{req.farmer}</p>
                                                        <p className="text-[11px] text-slate-500">{req.location}</p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 max-w-[200px] truncate" title={req.recentDiagnosis}>
                                                    {req.recentDiagnosis}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded border ${req.healthStatus === 'Healthy' ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/20' :
                                                        req.healthStatus === 'Monitoring' ? 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/20' :
                                                            'bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20'
                                                        }`}>
                                                        {req.healthStatus}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right whitespace-nowrap">
                                                    <button
                                                        onClick={() => alert(`Dummy Action: Open full health history for ${req.tagId}`)}
                                                        className="px-4 py-1.5 border border-primary/20 text-primary text-xs font-bold rounded-lg hover:bg-primary/5 transition-all shadow-sm active:scale-[0.98]"
                                                    >
                                                        View History
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
};

export default AnimalHealthPage;
