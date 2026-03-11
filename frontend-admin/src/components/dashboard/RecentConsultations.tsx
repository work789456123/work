const RecentConsultations: React.FC<{ consultations: any[] }> = ({ consultations }) => {
    const getStatusClasses = (status: string) => {
        switch (status?.toUpperCase()) {
            case 'URGENT':
            case 'CRITICAL':
                return {
                    diagnosis: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-100 dark:border-red-900/30',
                    status: 'text-amber-500 dark:text-amber-400',
                    dot: 'bg-amber-400 animate-pulse'
                };
            case 'COMPLETED':
                return {
                    diagnosis: 'bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400 border-transparent',
                    status: 'text-slate-400 dark:text-slate-500',
                    dot: 'bg-slate-300'
                };
            default:
                return {
                    diagnosis: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-100 dark:border-blue-900/30',
                    status: 'text-emerald-600 dark:text-emerald-400',
                    dot: 'bg-emerald-500'
                };
        }
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-primary/5 overflow-hidden">
            <div className="px-8 py-6 border-b border-primary/5 flex items-center justify-between">
                <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">Recent Consultations</h3>
                <button className="text-primary text-sm font-bold hover:underline">View History</button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-background-light dark:bg-slate-900/50">
                        <tr>
                            <th className="px-8 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Animal ID</th>
                            <th className="px-8 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Farmer</th>
                            <th className="px-8 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Symptom Reported</th>
                            <th className="px-8 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">AI Diagnosis</th>
                            <th className="px-8 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                            <th className="px-8 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-primary/5">
                        {consultations.length > 0 ? consultations.map((item, index) => {
                            const classes = getStatusClasses(item.status);
                            return (
                                <tr key={index} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                    <td className="px-8 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="size-8 rounded bg-slate-100 dark:bg-slate-700 flex items-center justify-center font-bold text-xs text-slate-500 dark:text-slate-400">{item.id}</div>
                                            <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{item.animal}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-4 text-sm text-slate-600 dark:text-slate-400">{item.farmer}</td>
                                    <td className="px-8 py-4 text-sm italic text-slate-600 dark:text-slate-400">{item.symptom}</td>
                                    <td className="px-8 py-4">
                                        <span className={`text-xs px-2 py-1 rounded font-medium ${classes.diagnosis}`}>
                                            {item.diagnosis}
                                        </span>
                                    </td>
                                    <td className="px-8 py-4">
                                        <span className={`flex items-center gap-1.5 text-xs font-semibold ${classes.status}`}>
                                            <span className={`size-1.5 rounded-full ${classes.dot}`}></span>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-4 text-right">
                                        <button className="text-slate-400 hover:text-primary transition-colors">
                                            <span className="material-symbols-outlined">more_horiz</span>
                                        </button>
                                    </td>
                                </tr>
                            );
                        }) : (
                            <tr>
                                <td colSpan={6} className="px-8 py-10 text-center text-slate-400 text-sm italic">
                                    No recent consultations found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RecentConsultations;
