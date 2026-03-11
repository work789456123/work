import { useState, useEffect } from 'react';
import { fetchConsultations, fetchDashboardStats } from '../services/api';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';

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

const ConsultationsPage = () => {
    const [activeTab, setActiveTab] = useState('All');
    const [searchQuery] = useState('');
    const [consultations, setConsultations] = useState<any[]>([]);
    const [stats, setStats] = useState<DashboardStats | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [consultationsData, statsData] = await Promise.all([
                    fetchConsultations(),
                    fetchDashboardStats()
                ]);

                setStats(statsData);

                const mapped = consultationsData.map((d: any) => ({
                    id: d.ticket_id,
                    farmer: { name: d.farmer_name || 'Unknown', initials: (d.farmer_name || 'U')[0] },
                    animal: `${d.animal_species || 'Unknown'} (${d.animal_tag || d.animal_id.substring(0,8).toUpperCase()})`,
                    issue: d.symptom,
                    date: d.date ? new Date(d.date).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recent',
                    status: d.status.toUpperCase(),
                    assignedVet: null 
                }));
                setConsultations(mapped);
            } catch (err) {
                console.error("Failed to load consultations:", err);
            }
        };
        loadData();
    }, []);

    const filteredConsultations = consultations.filter(req => {
        const matchesTab =
            activeTab === 'All' ? true :
                activeTab === 'Unassigned' ? !req.assignedVet :
                    activeTab === 'Ongoing' ? req.assignedVet && req.status !== 'COMPLETED' :
                        activeTab === 'Completed' ? req.status === 'COMPLETED' : true;

        const matchesSearch = req.farmer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            req.animal.toLowerCase().includes(searchQuery.toLowerCase()) ||
            req.id.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesTab && matchesSearch;
    });

    const handleManualAssign = (id: string) => {
        alert(`Dummy Action: Opening manual assignment modal for request ${id}`);
    };

    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-background-light dark:bg-background-dark">
                <Header />

                <div className="flex-1 overflow-y-auto p-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Consultation Requests</h2>
                                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage and assign patient consultation tickets.</p>
                            </div>
                            <button
                                onClick={() => alert('Dummy Action: Open New Manual Request Form')}
                                className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-all hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98]"
                            >
                                <span className="material-symbols-outlined text-xl">add</span>
                                New Manual Request
                            </button>
                        </div>

                        {/* Tabs & Filters */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-primary/10 overflow-hidden shadow-sm mb-8">
                            <div className="flex flex-col md:flex-row md:items-center justify-between px-6 border-b border-primary/5">
                                <div className="flex overflow-x-auto gap-8 no-scrollbar">
                                    {['All', 'Unassigned', 'Ongoing', 'Completed'].map(tab => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tab)}
                                            className={`py-5 text-sm transition-colors whitespace-nowrap 
                                        ${activeTab === tab ? 'font-bold text-primary border-b-2 border-primary' : 'font-medium text-slate-500 hover:text-primary'}
                                      `}
                                        >
                                            {tab === 'Unassigned' ? `Unassigned (${consultations.filter(c => !c.assignedVet).length})` : tab}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex items-center gap-4 py-4">
                                    <div className="flex items-center gap-2 px-3 py-2 bg-background-light dark:bg-slate-800 rounded-lg text-xs font-semibold cursor-pointer border border-transparent hover:border-primary/20 transition-all text-slate-600 dark:text-slate-300">
                                        <span className="material-symbols-outlined text-sm">calendar_month</span>
                                        Oct 1 - Oct 15, 2023
                                    </div>
                                    <button className="p-2 bg-background-light dark:bg-slate-800 rounded-lg hover:text-primary transition-colors text-slate-500">
                                        <span className="material-symbols-outlined text-lg">filter_list</span>
                                    </button>
                                </div>
                            </div>

                            {/* Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-background-light/50 dark:bg-slate-800/50">
                                        <tr>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Request ID</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Farmer Name</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Animal</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Issue</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Assigned Vet</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-primary/5">
                                        {filteredConsultations.map((req) => (
                                            <tr key={req.id} className="hover:bg-primary/5 transition-colors group">
                                                <td className="px-6 py-5 text-sm font-medium text-slate-700 dark:text-slate-300">{req.id}</td>
                                                <td className="px-6 py-5 whitespace-nowrap">
                                                    <div className="flex items-center gap-3">
                                                        <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                                            {req.farmer.initials}
                                                        </div>
                                                        <span className="text-sm font-semibold text-slate-900 dark:text-white">{req.farmer.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 whitespace-nowrap">
                                                    <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-md text-xs font-medium text-slate-700 dark:text-slate-300">
                                                        {req.animal}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5 text-sm text-slate-600 dark:text-slate-400 min-w-[200px]">
                                                    {req.issue}
                                                </td>
                                                <td className="px-6 py-5 text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">
                                                    {req.date}
                                                </td>
                                                <td className="px-6 py-5 whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${req.status === 'URGENT' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                                        req.status === 'ROUTINE' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                                            'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                        }`}>
                                                        {req.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5 text-right whitespace-nowrap">
                                                    {req.assignedVet ? (
                                                        <div className="flex items-center gap-2 justify-end">
                                                            <img className="size-6 rounded-full border border-primary/20" src={req.assignedVet.avatar} alt={req.assignedVet.name} />
                                                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{req.assignedVet.name}</span>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleManualAssign(req.id)}
                                                            className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary/90 transition-all flex items-center gap-2 ml-auto shadow-sm active:scale-[0.98]"
                                                        >
                                                            <span className="material-symbols-outlined text-sm">person_add</span>
                                                            Assign Manually
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Summary Cards Section */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-primary/10 shadow-sm flex flex-col justify-between hover:border-primary/20 transition-all">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-primary/10 rounded-xl text-primary">
                                        <span className="material-symbols-outlined">timer</span>
                                    </div>
                                    <span className="text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-lg">-15% from last week</span>
                                </div>
                                <div>
                                    <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">Average Response Time</h3>
                                    <p className="text-3xl font-black mt-1 text-slate-900 dark:text-white">
                                        {stats?.avg_response_time ? `${stats.avg_response_time} min` : '14.5 min'}
                                    </p>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-primary/10 shadow-sm flex flex-col justify-between hover:border-primary/20 transition-all">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-primary/10 rounded-xl text-primary">
                                        <span className="material-symbols-outlined">groups</span>
                                    </div>
                                    <span className="text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-lg">8 on field duty</span>
                                </div>
                                <div>
                                    <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">Active Veterinarians</h3>
                                    <p className="text-3xl font-black mt-1 text-slate-900 dark:text-white">
                                        {stats?.active_vets || '24'}
                                    </p>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-primary/10 shadow-sm flex flex-col justify-between hover:border-primary/20 transition-all">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-primary/10 rounded-xl text-primary">
                                        <span className="material-symbols-outlined">verified</span>
                                    </div>
                                    <span className="text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-lg">Target: 95%</span>
                                </div>
                                <div>
                                    <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">Resolution Rate</h3>
                                    <p className="text-3xl font-black mt-1 text-slate-900 dark:text-white">
                                        {stats?.resolution_rate ? `${stats.resolution_rate}%` : '92.8%'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ConsultationsPage;
