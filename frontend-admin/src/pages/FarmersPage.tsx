import { useState, useEffect } from 'react';
import { fetchFarmers } from '../services/api';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import FarmerDetailsModal from '../components/dashboard/FarmerDetailsModal';

interface Farmer {
    id: string;
    name: string;
    registered: string;
    location: string;
    contact: string;
    animals: number;
    status: string;
    avatar: string;
}

interface FarmerRaw {
    id: string;
    name: string;
    location: string;
    contact: string;
    status: string;
    created_at?: string;
    animal_count?: number;
}

const FarmersPage = () => {
    const [selectedFarmer, setSelectedFarmer] = useState<Farmer | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleFarmerClick = (farmer: Farmer) => {
        setSelectedFarmer(farmer);
        setIsModalOpen(true);
    };
    const [farmers, setFarmers] = useState<Farmer[]>([]);

    useEffect(() => {
        const loadFarmers = async () => {
            try {
                const data = await fetchFarmers();
                const mappedFarmers = data.map((d: FarmerRaw) => ({
                    id: d.id.substring(0, 8).toUpperCase(),
                    name: d.name,
                    registered: d.created_at ? new Date(d.created_at).toLocaleDateString() : 'Recent',
                    location: d.location,
                    contact: d.contact,
                    animals: d.animal_count || 0,
                    status: d.status,
                    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(d.name)}&background=random`
                }));
                setFarmers(mappedFarmers);
            } catch (err) {
                console.error("Failed to load farmers", err);
            }
        };
        loadFarmers();
    }, []);

    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-background-light dark:bg-background-dark">
                <Header />

                <div className="flex-1 overflow-y-auto p-8">
                    <div className="max-w-7xl mx-auto space-y-6">

                        {/* Title and Filter Row */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">Farmer Management</h2>
                                <p className="text-slate-500 text-sm mt-1">Directory of all 1,248 registered dairy farmers in the Northern Region.</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="px-3 py-2 bg-white dark:bg-slate-800 border border-primary/10 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm text-slate-700 dark:text-slate-300">
                                    <span className="material-symbols-outlined text-sm">filter_list</span>
                                    Filter
                                </button>
                                <button
                                    onClick={() => alert('Dummy Action: Generate and download report')}
                                    className="px-3 py-2 bg-white dark:bg-slate-800 border border-primary/10 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm text-slate-700 dark:text-slate-300"
                                >
                                    <span className="material-symbols-outlined text-sm">download</span>
                                    Export
                                </button>
                                <button
                                    onClick={() => alert('Dummy Action: Open Add New Farmer Form')}
                                    className="px-3 py-2 bg-primary text-white rounded-lg text-sm font-bold flex items-center gap-2 hover:opacity-90 transition-all shadow-sm active:scale-[0.98]"
                                >
                                    <span className="material-symbols-outlined text-sm">person_add</span>
                                    Add Farmer
                                </button>
                            </div>
                        </div>

                        {/* Data Table Section */}
                        <div className="bg-white dark:bg-slate-900 rounded-xl border border-primary/10 shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-primary/10">
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Farmer Name</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Farmer ID</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Location</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Contact</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Animals</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Status</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-primary/5">
                                        {farmers.map((farmer) => (
                                            <tr
                                                key={farmer.id}
                                                className="group hover:bg-primary/5 transition-all cursor-pointer"
                                                onClick={() => handleFarmerClick(farmer)}
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-3">
                                                        <div className="size-10 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden ring-2 ring-transparent group-hover:ring-primary/20 transition-all">
                                                            <img className="size-full object-cover" alt={farmer.name} src={farmer.avatar} />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{farmer.name}</p>
                                                            <p className="text-xs text-slate-500">Registered {farmer.registered}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="text-sm font-mono text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">{farmer.id}</span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400">
                                                        <span className="material-symbols-outlined text-[16px] text-primary">location_on</span>
                                                        {farmer.location}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">{farmer.contact}</p>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-1">
                                                        <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{farmer.animals}</span>
                                                        <span className="material-symbols-outlined text-[16px] text-slate-400">cottage</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    <span className={`px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-full border ${farmer.status === 'Verified'
                                                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800'
                                                        : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                                                        }`}>
                                                        {farmer.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                                    <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-all translate-x-0 group-hover:translate-x-1">chevron_right</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
                                <p className="text-xs text-slate-500 font-medium">Showing <span className="text-slate-900 dark:text-slate-100">1 - 5</span> of <span className="text-slate-900 dark:text-slate-100">1,248</span> farmers</p>
                                <div className="flex items-center gap-2">
                                    <button className="size-8 rounded border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:bg-white dark:hover:bg-slate-800 disabled:opacity-50" disabled>
                                        <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                                    </button>
                                    <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
                                        <button className="size-8 rounded bg-primary text-white text-xs font-bold">1</button>
                                        <button className="size-8 rounded hover:bg-primary/10 text-xs font-medium">2</button>
                                        <button className="size-8 rounded hover:bg-primary/10 text-xs font-medium">3</button>
                                        <span className="text-slate-400 text-xs px-1">...</span>
                                        <button className="size-8 rounded hover:bg-primary/10 text-xs font-medium">250</button>
                                    </div>
                                    <button className="size-8 rounded border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 transition-colors shadow-sm">
                                        <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Load More Section for Mobile */}
                        <div className="flex justify-center mt-4 md:hidden">
                            <button className="w-full max-w-xs py-3 border-2 border-primary text-primary font-bold rounded-xl hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2">
                                <span className="material-symbols-outlined">expand_more</span>
                                Load More Farmers
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            <FarmerDetailsModal
                farmer={selectedFarmer}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default FarmersPage;
