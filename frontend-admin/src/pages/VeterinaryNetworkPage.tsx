import { useState, useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import { fetchDoctors } from '../services/api';

const VeterinaryNetworkPage = () => {
    const [veterinarians, setVeterinarians] = useState<any[]>([]);

    useEffect(() => {
        const loadDoctors = async () => {
            try {
                const data = await fetchDoctors();
                const mappedVets = data.map((doc: any) => ({
                    id: doc.id,
                    name: doc.name,
                    specialization: doc.specialty,
                    contact: doc.languages || 'Multiple Languages',
                    email: `${doc.name.toLowerCase().replace(/\s+/g, '.')}@pashuvaani.com`,
                    consultations: doc.reviews?.toLocaleString() || '0',
                    rating: doc.rating?.toString() || '0.0',
                    status: doc.availability === 'Offline' ? 'Offline' : 'Active',
                    avatar: doc.image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuA6dVS3AhYLbJ1OXJAjkSEi56uQtCGmyW73Aau4QJgWyJHDOQ9vaEM2WnsAFcKpp_anDHlQDyVsbiCnsEdNYntLl7BXHbuoXkzwPHtKz8HoF4G4AkLCiqK9hoJx_vtbdZ-3t7OwHbtLm3rkcAeXlrdsryh5emDiYno3Uob46b6Lyx38813NWwFKNEr6WSczoANhc7VFGAJGN6GcJEyatSBWXCBqODm4G3Mllx14cjEej4HQFqJylqcFtvkC8NfXb51k8nzIXg5wS7A'
                }));
                setVeterinarians(mappedVets);
            } catch (error) {
                console.error('Error fetching doctors:', error);
            }
        };
        loadDoctors();
    }, []);

    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-background-light dark:bg-background-dark">
                <Header />

                <div className="flex-1 overflow-y-auto p-8">
                    <div className="max-w-7xl mx-auto">
                        {/* Dashboard Summary & Actions */}
                        <div className="flex flex-col lg:flex-row justify-between items-start gap-6 mb-8">
                            <div className="max-w-xl">
                                <h1 className="text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tight mb-2">Veterinary Network</h1>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Manage and monitor certified veterinary professionals across your operational regions. Currently overseeing 248 active practitioners.</p>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => alert('Dummy Action: Generate and download report (e.g. PDF/CSV)')}
                                    className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 border border-primary/10 text-primary font-bold rounded-xl hover:bg-primary/5 transition-all shadow-sm"
                                >
                                    <span className="material-symbols-outlined">download</span>
                                    Export Report
                                </button>
                                <button
                                    onClick={() => alert('Dummy Action: Open Add Veterinarian Form')}
                                    className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-[0.98]"
                                >
                                    <span className="material-symbols-outlined">person_add</span>
                                    Add New Veterinarian
                                </button>
                            </div>
                        </div>

                        {/* Network Overview & Filters */}
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                            {/* Distribution Card */}
                            <div className="lg:col-span-1 bg-white dark:bg-slate-800 p-5 rounded-2xl border border-primary/5 flex flex-col h-full shadow-sm">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Regional Coverage</h3>
                                    <span className="material-symbols-outlined text-primary text-sm">map</span>
                                </div>
                                <div className="relative h-32 rounded-xl mb-4 bg-primary/5 overflow-hidden border border-primary/5">
                                    <div
                                        className="absolute inset-0 bg-cover bg-center opacity-40 grayscale"
                                        style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB9QUGPtEeJWkLJYU3Vp3RgLjnx92syoChcKufxygp-lyzpl2foPYQH1cZuoBrHaybll9YaVRpW5tAJj00RR-WJhDjh1t44anUarfZnjmXXOte6H9mNw6G-_UhTFnEdd2q2LHHwm1Vm2aSJGxMusKT38ay_QKNzCjo3C7ce5umbSme_xzlqISkJkyalypBHEfi1FdhO-MQ2W_UZlIzOa3e4ANROTX0ySJP4CyiMeYBjXlKvFS3O_4G0pqMdnVfNRQ6rZDXOanwUVM4')" }}
                                    ></div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="bg-primary/90 text-white text-[10px] px-2 py-1 rounded font-bold uppercase tracking-widest shadow-lg">12 Regions Covered</span>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-slate-500 font-medium font-bold">North Zone</span>
                                        <span className="text-primary font-bold">42%</span>
                                    </div>
                                    <div className="w-full bg-primary/5 h-1.5 rounded-full overflow-hidden">
                                        <div className="bg-primary h-full rounded-full" style={{ width: '42%' }}></div>
                                    </div>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-slate-500 font-medium font-bold">South Zone</span>
                                        <span className="text-primary font-bold">35%</span>
                                    </div>
                                    <div className="w-full bg-primary/5 h-1.5 rounded-full overflow-hidden">
                                        <div className="bg-primary h-full rounded-full" style={{ width: '35%' }}></div>
                                    </div>
                                </div>
                            </div>

                            {/* Search & Filters */}
                            <div className="lg:col-span-3 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-primary/5 shadow-sm">
                                <div className="flex flex-col h-full justify-between">
                                    <div className="relative w-full mb-6">
                                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                                        <input
                                            className="w-full pl-12 pr-4 py-3 bg-background-light dark:bg-slate-900/50 border-none rounded-xl focus:ring-2 focus:ring-primary text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
                                            placeholder="Search by name, License ID, contact or expertise..."
                                            type="text"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 block">Specialization</label>
                                            <div className="relative">
                                                <select className="w-full appearance-none bg-background-light dark:bg-slate-900/50 border-none rounded-lg py-2 pl-3 pr-10 text-sm focus:ring-1 focus:ring-primary text-slate-700 dark:text-slate-300">
                                                    <option>All Specializations</option>
                                                    <option>Livestock (Large Animal)</option>
                                                    <option>Companion Pets</option>
                                                    <option>Avian/Poultry</option>
                                                    <option>Exotics</option>
                                                </select>
                                                <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 block">Current Status</label>
                                            <div className="relative">
                                                <select className="w-full appearance-none bg-background-light dark:bg-slate-900/50 border-none rounded-lg py-2 pl-3 pr-10 text-sm focus:ring-1 focus:ring-primary text-slate-700 dark:text-slate-300">
                                                    <option>All Status</option>
                                                    <option>Active / Online</option>
                                                    <option>On-Call Only</option>
                                                    <option>Offline</option>
                                                    <option>Suspended</option>
                                                </select>
                                                <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 block">Location</label>
                                            <div className="relative">
                                                <select className="w-full appearance-none bg-background-light dark:bg-slate-900/50 border-none rounded-lg py-2 pl-3 pr-10 text-sm focus:ring-1 focus:ring-primary text-slate-700 dark:text-slate-300">
                                                    <option>All Regions</option>
                                                    <option>Uttar Pradesh</option>
                                                    <option>Punjab</option>
                                                    <option>Maharashtra</option>
                                                    <option>Karnataka</option>
                                                </select>
                                                <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Veterinarian List Table */}
                        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-primary/5 overflow-hidden shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-primary/5 bg-primary/5">
                                            <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Veterinarian</th>
                                            <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Specialization</th>
                                            <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Contact Info</th>
                                            <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center">Consultations</th>
                                            <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Rating</th>
                                            <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
                                            <th className="px-6 py-4"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-primary/5">
                                        {veterinarians.map((vet) => (
                                            <tr key={vet.id} className="hover:bg-primary/[0.02] transition-colors group">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-3">
                                                        <img alt={vet.name} className="size-12 rounded-xl object-cover" src={vet.avatar} />
                                                        <div>
                                                            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{vet.name}</p>
                                                            <p className="text-[11px] text-slate-500">ID: {vet.id}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wide ${vet.specialization === 'Livestock Expert' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' :
                                                        vet.specialization === 'Small Animal Care' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' :
                                                            'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                                        }`}>
                                                        {vet.specialization}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm whitespace-nowrap">
                                                    <p className="font-medium text-slate-700 dark:text-slate-300">{vet.contact}</p>
                                                    <p className="text-slate-500 text-xs">{vet.email}</p>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{vet.consultations}</p>
                                                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Lifetime</p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-1">
                                                        <span className="material-symbols-outlined text-amber-400 text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{vet.rating}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-1.5">
                                                        <span className={`size-2 rounded-full ${vet.status === 'Active' ? 'bg-green-500' :
                                                            vet.status === 'On-Call' ? 'bg-amber-500' :
                                                                'bg-slate-400'
                                                            }`}></span>
                                                        <span className={`text-xs font-bold uppercase ${vet.status === 'Active' ? 'text-green-600 dark:text-green-400' :
                                                            vet.status === 'On-Call' ? 'text-amber-600 dark:text-amber-400' :
                                                                'text-slate-500'
                                                            }`}>{vet.status}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button className="p-2 text-slate-400 hover:text-primary rounded-lg transition-colors">
                                                        <span className="material-symbols-outlined">more_vert</span>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {/* Pagination */}
                            <div className="px-6 py-4 flex items-center justify-between border-t border-primary/5 bg-primary/[0.01]">
                                <p className="text-xs text-slate-500 font-medium">Showing 1 to {veterinarians.length} of 248 veterinarians</p>
                                <div className="flex gap-2">
                                    <button className="size-8 flex items-center justify-center rounded-lg border border-primary/10 text-slate-400 hover:bg-white dark:hover:bg-slate-700 transition-all">
                                        <span className="material-symbols-outlined text-lg">chevron_left</span>
                                    </button>
                                    <button className="size-8 flex items-center justify-center rounded-lg bg-primary text-white text-xs font-bold shadow-sm shadow-primary/20">1</button>
                                    <button className="size-8 flex items-center justify-center rounded-lg border border-primary/10 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 text-xs font-bold">2</button>
                                    <button className="size-8 flex items-center justify-center rounded-lg border border-primary/10 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 text-xs font-bold">3</button>
                                    <button className="size-8 flex items-center justify-center rounded-lg border border-primary/10 text-slate-400 hover:bg-white dark:hover:bg-slate-700 transition-all">
                                        <span className="material-symbols-outlined text-lg">chevron_right</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default VeterinaryNetworkPage;
