
interface Animal {
    id: string;
    type: string;
    lastChecked: string;
    status: 'healthy' | 'warning' | 'alert';
}

interface Activity {
    type: 'vaccination' | 'verification' | 'creation';
    title: string;
    description: string;
    date: string;
}

interface FarmerDetailsModalProps {
    farmer: {
        id: string;
        name: string;
        location: string;
        contact: string;
        status: string;
        avatar: string;
    } | null;
    isOpen: boolean;
    onClose: () => void;
}

const FarmerDetailsModal: React.FC<FarmerDetailsModalProps> = ({ farmer, isOpen, onClose }) => {
    if (!farmer || !isOpen) return null;

    const animals: Animal[] = [
        { id: '88', type: 'HF Cow', lastChecked: '2 days ago', status: 'healthy' },
        { id: '12', type: 'Gir Cow', lastChecked: 'Vaccination Pending', status: 'warning' },
        { id: '04', type: 'Buffalo', lastChecked: 'Under Observation', status: 'alert' },
        { id: '01', type: 'Bull', lastChecked: 'Healthy', status: 'healthy' },
    ];

    const activities: Activity[] = [
        { type: 'vaccination', title: 'Vaccination Completed', description: 'Lumpy skin vaccine for Cow-88', date: 'Jan 12, 2024' },
        { type: 'verification', title: 'Profile Verified', description: 'By Admin Rajesh Kumar', date: 'Dec 20, 2023' },
        { type: 'creation', title: 'Account Created', description: 'Farmer joined PashuVaani', date: 'Dec 15, 2023' },
    ];

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'healthy': return <span className="material-symbols-outlined text-green-600">check_circle</span>;
            case 'warning': return <span className="material-symbols-outlined text-amber-500">warning</span>;
            case 'alert': return <span className="material-symbols-outlined text-red-500">error</span>;
            default: return null;
        }
    };

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'vaccination': return <span className="material-symbols-outlined text-sm">vaccines</span>;
            case 'verification': return <span className="material-symbols-outlined text-sm">assignment_turned_in</span>;
            case 'creation': return <span className="material-symbols-outlined text-sm">person_add</span>;
            default: return null;
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 md:p-8 overflow-y-auto" onClick={onClose}>
            <div
                className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div className="bg-primary p-6 md:p-8 text-white relative">
                    <button className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors" onClick={onClose}>
                        <span className="material-symbols-outlined text-3xl">close</span>
                    </button>
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <img className="w-32 h-32 rounded-2xl border-4 border-white/20 object-cover shadow-lg" alt={farmer.name} src={farmer.avatar} />
                        <div className="text-center md:text-left">
                            <div className="flex items-center justify-center md:justify-start gap-3">
                                <h3 className="text-3xl font-black">{farmer.name}</h3>
                                <span className="bg-white/20 text-xs font-bold px-3 py-1 rounded-full backdrop-blur-md uppercase tracking-wider">{farmer.id}</span>
                            </div>
                            <p className="text-white/80 mt-1 flex items-center justify-center md:justify-start gap-2">
                                <span className="material-symbols-outlined text-sm">location_on</span>
                                {farmer.location}
                            </p>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-4 text-sm">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-white/70">call</span>
                                    <span className="font-medium">{farmer.contact}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-white/70 font-variation-settings-fill">verified</span>
                                    <span className="font-medium">Verified Farmer</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal Content */}
                <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Registered Animals */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="flex items-center justify-between">
                            <h4 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">pets</span>
                                Registered Animals (12)
                            </h4>
                            <button className="text-primary font-bold text-sm hover:underline">Manage All</button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {animals.map((animal) => (
                                <div key={animal.id} className="p-4 rounded-xl border border-primary/10 bg-primary/5 flex items-center gap-4 hover:border-primary/20 transition-all">
                                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                                        <span className="material-symbols-outlined text-3xl">cruelty_free</span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-slate-800 dark:text-slate-200">{animal.type} - {animal.id}</p>
                                        <p className="text-xs text-slate-500">{animal.lastChecked}</p>
                                    </div>
                                    {getStatusIcon(animal.status)}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Activity & Sidebar Stats */}
                    <div className="space-y-6">
                        <div className="p-5 bg-background-light dark:bg-slate-800 rounded-2xl border border-primary/5">
                            <h4 className="font-bold text-slate-900 dark:text-white mb-4">Farmer Activity</h4>
                            <div className="space-y-6">
                                {activities.map((activity, index) => (
                                    <div key={index} className="flex gap-3 relative">
                                        {index !== activities.length - 1 && (
                                            <div className="w-px h-full bg-primary/20 absolute left-3.5 top-2"></div>
                                        )}
                                        <div className={`w-7 h-7 rounded-full flex items-center justify-center z-10 shrink-0 ${index === 0 ? 'bg-primary text-white' : 'bg-primary/20 text-primary'
                                            }`}>
                                            {getActivityIcon(activity.type)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{activity.title}</p>
                                            <p className="text-xs text-slate-500">{activity.description}</p>
                                            <p className="text-[10px] text-primary/60 font-bold mt-0.5">{activity.date}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex flex-col gap-3">
                            <button className="w-full bg-primary text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-primary/20">
                                <span className="material-symbols-outlined">history</span>
                                View Full History
                            </button>
                            <button className="w-full bg-primary/10 text-primary py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/20 active:scale-[0.98] transition-all">
                                <span className="material-symbols-outlined">mail</span>
                                Contact Farmer
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FarmerDetailsModal;
