import React from 'react';

const RecentConsultations = () => {
    const consultations = [
        {
            id: 'C-12',
            animal: 'Jersey Cow',
            farmer: 'Amith Verma',
            symptom: 'Reduced milk yield',
            diagnosis: 'Mastitis Risk (92%)',
            status: 'Active',
            diagnosisClasses: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-100 dark:border-blue-900/30',
            statusClasses: 'text-emerald-600 dark:text-emerald-400',
            dotClasses: 'bg-emerald-500'
        },
        {
            id: 'G-08',
            animal: 'Beetal Goat',
            farmer: 'Sunita Devi',
            symptom: 'Loss of appetite',
            diagnosis: 'Nutritional Gap',
            status: 'Resolved',
            diagnosisClasses: 'bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400 border-transparent',
            statusClasses: 'text-slate-400 dark:text-slate-500',
            dotClasses: 'bg-slate-300'
        },
        {
            id: 'B-45',
            animal: 'Murrah Buffalo',
            farmer: 'Rajesh Patil',
            symptom: 'Fever & lethargy',
            diagnosis: 'HS Infection (High)',
            status: 'Critical',
            diagnosisClasses: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-100 dark:border-red-900/30',
            statusClasses: 'text-amber-500 dark:text-amber-400',
            dotClasses: 'bg-amber-400 animate-pulse'
        },
    ];

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-brand-primary/5 overflow-hidden">
            <div className="px-8 py-6 border-b border-brand-primary/5 flex items-center justify-between">
                <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">Recent Consultations</h3>
                <button className="text-brand-primary text-sm font-bold hover:underline">View History</button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-background-light dark:bg-slate-900/50">
                        <tr>
                            <th className="px-8 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">Animal ID</th>
                            <th className="px-8 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">Farmer</th>
                            <th className="px-8 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">Symptom Reported</th>
                            <th className="px-8 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">AI Diagnosis</th>
                            <th className="px-8 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">Status</th>
                            <th className="px-8 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right border-b border-slate-100 dark:border-slate-800">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-primary/5">
                        {consultations.map((item, index) => (
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
                                    <span className={`text-xs px-2 py-1 rounded font-medium ${item.diagnosisClasses}`}>
                                        {item.diagnosis}
                                    </span>
                                </td>
                                <td className="px-8 py-4">
                                    <span className={`flex items-center gap-1.5 text-xs font-semibold ${item.statusClasses}`}>
                                        <span className={`size-1.5 rounded-full ${item.dotClasses}`}></span>
                                        {item.status}
                                    </span>
                                </td>
                                <td className="px-8 py-4 text-right">
                                    <button className="text-slate-400 hover:text-brand-primary transition-colors">
                                        <span className="material-symbols-outlined">more_horiz</span>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RecentConsultations;
